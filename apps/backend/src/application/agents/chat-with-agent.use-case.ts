import { Service, Container } from "typedi";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { ConversationAgentFactory } from "../../adapters/inbound/primary/agents/conversation-agent-factory.js";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";
import {
  AGENT_REPOSITORY,
  CHAT_REPOSITORY,
} from "../../infrastructure/constants.js";
import { Agent, AgentType } from "../../domain/entities/agent.js";
import {
  ChatRole,
  MessageStatus,
  createTextContent,
  getPlainText,
} from "../../domain/entities/chat-message.js";
import { randomUUID } from "node:crypto";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";
import { createRetrieveContextTool } from "../../adapters/outbound/external-services/tools/rag/retrieve-context.tool.js";

export interface ChatWithAgentInput {
  agentId: string;
  userId: string;
  message: string;
  /** @deprecated Use conversationId instead */
  threadId?: string;
  conversationId?: string;
}

@Service()
export class ChatWithAgentUseCase {
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);
  private readonly conversationAgentFactory: ConversationAgentFactory =
    Container.get(ConversationAgentFactory);

  async execute(input: ChatWithAgentInput): Promise<string> {
    const { agentId, userId, message } = input;
    // Support both threadId (legacy) and conversationId
    const conversationId = input.conversationId ?? input.threadId;

    // 1. Retrieve and Validate Agent
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new HttpError(404, "Agent not found");
    }

    if (agent.type === AgentType.PRIVATE && agent.userId !== userId) {
      throw new HttpError(403, "Unauthorized access to private agent");
    }

    // Conversation Verification
    if (conversationId) {
      await this.validateConversationAccess(conversationId, userId, agent);
    }

    // 2. Construct Prompt (System + History)
    // RAG is available as a tool; it should be invoked by the model when needed.
    const systemMessage = this.buildSystemMessage(agent);
    const chatHistory: BaseMessage[] = [];

    // Load History if using conversation
    if (conversationId) {
      const history = await this.chatRepository.getMessages(conversationId);
      for (const historyMessage of history) {
        const text = getPlainText(historyMessage.content);
        if (historyMessage.role === ChatRole.USER) {
          chatHistory.push(new HumanMessage(text));
        } else if (historyMessage.role === ChatRole.ASSISTANT) {
          chatHistory.push(new AIMessage(text));
        }
      }
    }

    // 3. Generate Response via tool-capable agent
    const tools = [createRetrieveContextTool(userId)];
    const agentExecutor = this.conversationAgentFactory.buildWithSystemPrompt({
      systemPrompt: systemMessage.content.toString(),
      tools,
    });

    const result = await agentExecutor.invoke({
      input: message,
      chat_history: chatHistory,
    });

    const lastMessage = result.messages.at(-1);
    const replyContent = lastMessage?.content?.toString() ?? "";

    // 5. Save Persistence (Async)
    if (conversationId) {
      await this.saveHistory(conversationId, message, replyContent);
    }

    return replyContent;
  }

  private async validateConversationAccess(
    conversationId: string,
    userId: string,
    agent: Agent,
  ) {
    if (!agent.configuration.enableThreads) {
      throw new HttpError(403, "Conversations are disabled for this agent");
    }
    const conversation =
      await this.chatRepository.getConversationById(conversationId);
    if (!conversation) throw new HttpError(404, "Conversation not found");
    if (conversation.userId !== userId)
      throw new HttpError(403, "Unauthorized access to conversation");
  }

  private buildSystemMessage(agent: Agent): SystemMessage {
    return new SystemMessage(`
You are an AI assistant named "${agent.name}".
Your instructions are:
${agent.configuration.systemPrompt}

Tone: ${agent.configuration.tone}

If you need factual details from the user's uploaded documents, call the tool "retrieve_context" with an appropriate query.
The tool returns JSON with relevant snippets and metadata. Use it to ground your answer.
`);
  }

  private async saveHistory(
    conversationId: string,
    userMessage: string,
    assistantMessage: string,
  ) {
    await this.chatRepository.saveMessage({
      id: randomUUID(),
      conversationId,
      role: ChatRole.USER,
      content: createTextContent(userMessage),
      status: MessageStatus.COMPLETE,
      createdAt: new Date(),
    });

    await this.chatRepository.saveMessage({
      id: randomUUID(),
      conversationId,
      role: ChatRole.ASSISTANT,
      content: createTextContent(assistantMessage),
      status: MessageStatus.COMPLETE,
      createdAt: new Date(),
    });
  }
}
