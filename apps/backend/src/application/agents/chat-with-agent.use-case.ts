import { Service, Inject } from "typedi";
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
import { GetUserGoalUseCase } from "../goals/get-user-goal.use-case.js";

export interface ChatWithAgentInput {
  agentId: string;
  userId: string;
  message: string;
  /** @deprecated Use conversationId instead */
  threadId?: string;
  conversationId?: string;
}

/**
 * @deprecated Use StreamChatWithAgentUseCase instead for better performance and user experience.
 */
@Service()
export class ChatWithAgentUseCase {
  constructor(
    @Inject(AGENT_REPOSITORY) private readonly agentRepository: AgentRepository,
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: ChatRepository,
    private readonly conversationAgentFactory: ConversationAgentFactory,
    private readonly getUserGoalUseCase: GetUserGoalUseCase,
  ) {}

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

    // 2.1 Inject Goal Context
    const userGoal = await this.getUserGoalUseCase.execute(userId);
    let goalBlock = "";

    goalBlock = userGoal
      ? `USER CURRENT GOAL
Objective: ${userGoal.objective}
Status: Active

Instruction:
All advice should prioritize progress toward this objective.

`
      : `USER CURRENT GOAL
None set.

Instruction:
If appropriate, help the user clarify a concrete professional goal.
Do not force goal setting.

`;

    const axesBlock = `STRATEGY AXES
- Positioning
- Market Readiness
- Opportunity Flow
- Performance

Instruction:
Frame advice in terms of these axes when relevant.

`;

    const systemPromptWithGoal = `${goalBlock}${axesBlock}${runtimeAgent.systemPrompt}`;

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
      systemPrompt: systemPromptWithGoal,
      tools,
      temperature: runtimeAgent.temperature,
    });

    console.log({
      agentId: agent.id,
      agentVersion: agent.configuration.version,
      msg: "Invoking agent executor",
      prompt: systemPromptWithGoal,
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
