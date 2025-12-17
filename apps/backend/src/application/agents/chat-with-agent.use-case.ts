import { Service, Container } from "typedi";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { ConversationAgentFactory } from "../../adapters/inbound/primary/agents/conversation-agent-factory.js";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
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
import {
  buildLangChainAgent,
  validateInputScope,
} from "../../infrastructure/langchain/langchain-agent.adapter.js";

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

    // Safety Check
    validateInputScope(message);

    // Observability
    console.info({
      agentId: agent.id,
      agentVersion: agent.configuration.version,
      msg: "Executing agent",
    });

    // 2. Construct Runtime Configuration
    const runtimeAgent = buildLangChainAgent(agent.configuration);

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
      systemPrompt: runtimeAgent.systemPrompt,
      tools,
      temperature: runtimeAgent.temperature,
    });

    const result = await agentExecutor.invoke({
      input: message,
      chat_history: chatHistory,
    });

    // eslint-disable-next-line unicorn/prefer-at
    const lastMessage = result.messages[result.messages.length - 1];
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
    const conversation =
      await this.chatRepository.getConversationById(conversationId);
    if (!conversation) throw new HttpError(404, "Conversation not found");
    if (conversation.userId !== userId)
      throw new HttpError(403, "Unauthorized access to conversation");

    // When threads are disabled, verify this is the user's only conversation for this agent
    if (!agent.configuration.enableThreads) {
      const userConversations = await this.chatRepository.getConversations(
        userId,
        agent.id,
      );
      const isDefaultConversation = userConversations.some(
        (c) => c.id === conversationId,
      );
      if (!isDefaultConversation) {
        throw new HttpError(403, "Invalid conversation for this agent");
      }
    }
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
