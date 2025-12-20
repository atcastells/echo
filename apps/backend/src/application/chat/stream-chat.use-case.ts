import { Service, Container } from "typedi";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import {
  AGENT_REPOSITORY,
  CHAT_REPOSITORY,
  LLM_ADAPTER_FACTORY,
} from "../../infrastructure/constants.js";
import { LLMAdapterFactory } from "../../adapters/outbound/external-services/llm/index.js";
import {
  SSEEvent,
  MessageDeltaEvent,
  MessageCompletedEvent,
} from "../../domain/types/sse-event.types.js";
import {
  ChatRole,
  MessageStatus,
  MessageContent,
  createChatMessage,
  createTextContent,
} from "../../domain/entities/chat-message.js";
import { Agent, AgentType } from "../../domain/entities/agent.js";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";
import { createRetrieveContextTool } from "../../adapters/outbound/external-services/tools/rag/retrieve-context.tool.js";
import { randomUUID } from "node:crypto";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { GetUserGoalUseCase } from "../goals/get-user-goal.use-case.js";

export interface StreamChatInput {
  conversation_id: string;
  message: {
    role: "user";
    content: Array<{ type: "text"; value: string }>;
  };
  agent?: {
    persona?: string;
    tone?: string;
    mode?: string;
  };
  capabilities?: {
    tools_allowed?: string[];
    requires_confirmation?: string[];
  };
  context?: {
    include_memory?: boolean;
    max_tokens?: number;
  };
}

@Service()
export class StreamChatUseCase {
  private static readonly INVOKE_TIMEOUT_MS = 60_000;

  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);
  private readonly llmAdapterFactory: LLMAdapterFactory =
    Container.get(LLM_ADAPTER_FACTORY);
  private readonly getUserGoalUseCase = Container.get(GetUserGoalUseCase);

  // Track active streams for interrupt support
  private static activeStreams = new Map<
    string,
    { aborted: boolean; messageId: string }
  >();

  static interrupt(conversationId: string): boolean {
    const stream = StreamChatUseCase.activeStreams.get(conversationId);
    if (stream) {
      stream.aborted = true;
      return true;
    }
    return false;
  }

  async *execute(
    userId: string,
    input: StreamChatInput,
  ): AsyncGenerator<SSEEvent> {
    const messageId = randomUUID();
    const startTime = Date.now();

    console.log(
      `[chat] stream start conversation=${input.conversation_id} user=${userId} messageId=${messageId}`,
    );

    // Register this stream for potential interrupt
    StreamChatUseCase.activeStreams.set(input.conversation_id, {
      aborted: false,
      messageId,
    });

    try {
      // 1. Validate conversation and get agent
      const conversation = await this.chatRepository.getConversationById(
        input.conversation_id,
      );
      if (!conversation) {
        throw new HttpError(404, "Conversation not found");
      }

      if (conversation.userId !== userId) {
        throw new HttpError(403, "Unauthorized access to conversation");
      }

      const agent = await this.agentRepository.findById(conversation.agentId);
      if (!agent) {
        throw new HttpError(404, "Agent not found");
      }

      console.log(
        `[chat] agent loaded conversation=${input.conversation_id} agent=${agent.id} type=${agent.type}`,
      );

      if (agent.type === AgentType.PRIVATE && agent.userId !== userId) {
        throw new HttpError(403, "Unauthorized access to private agent");
      }

      // 2. Emit chat.started
      const userMessageId = randomUUID();
      yield {
        event: "chat.started",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: {
          user_message_id: userMessageId,
        },
      };

      // 3. Save user message
      const userMessageContent: MessageContent[] = input.message.content.map(
        (c) => ({
          type: c.type,
          value: c.value,
        }),
      );

      await this.chatRepository.saveMessage(
        createChatMessage({
          id: userMessageId,
          conversationId: input.conversation_id,
          role: ChatRole.USER,
          content: userMessageContent,
          status: MessageStatus.COMPLETE,
        }),
      );

      // 4. Emit thinking event
      yield {
        event: "agent.thinking",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: { reason: "retrieving_context" },
      };

      // Check for interrupt
      if (this.isAborted(input.conversation_id)) {
        yield* this.handleInterrupt(input.conversation_id, messageId);
        return;
      }

      // 5. Load conversation history
      const chatHistory = await this.loadChatHistory(input.conversation_id);

      // 5.1 Get User Goal
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

      // 6. Get LLM adapter and prepare messages
      const llmAdapter = this.llmAdapterFactory.getDefaultAdapter();
      const systemMessage = this.buildSystemMessage(agent, goalBlock, axesBlock);
      const tools = [createRetrieveContextTool(userId)];

      if (!llmAdapter.isConfigured()) {
        throw new Error(
          "No LLM provider configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY",
        );
      }

      console.log(
        `[chat] invoking streaming agent conversation=${input.conversation_id} messageId=${messageId} provider=${llmAdapter.getProviderName()} model=${llmAdapter.getModelId()}`,
      );

      console.log({
        agentId: agent.id,
        agentVersion: agent.configuration.version,
        msg: "Invoking streaming agent executor",
        prompt: systemMessage.content,
      });

      // Emit planning thinking
      yield {
        event: "agent.thinking",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: { reason: "planning" },
      };

      // Get user message text
      const userMessageText = input.message.content
        .map((c) => c.value)
        .join("\n");

      console.log(
        `[chat] starting stream conversation=${input.conversation_id} inputLength=${userMessageText.length} historyLength=${chatHistory.length}`,
      );

      // Build the full message array for the LLM
      const messages: BaseMessage[] = [
        systemMessage,
        ...chatHistory,
        new HumanMessage(userMessageText),
      ];

      // Stream response using LLM adapter
      let replyContent = "";
      const streamGenerator = llmAdapter.streamWithTools({
        messages,
        tools,
        maxToolRounds: 3,
      });

      // Create a timeout wrapper for the streaming
      const timeoutPromise = new Promise<never>((_, reject) =>
        globalThis.setTimeout(
          () =>
            reject(
              new Error(
                `Agent stream timed out after ${StreamChatUseCase.INVOKE_TIMEOUT_MS}ms`,
              ),
            ),
          StreamChatUseCase.INVOKE_TIMEOUT_MS,
        ),
      );

      // Process stream events
      // We need to race between stream iteration and timeout
      // Using a manual iteration approach to support timeout
      const iterator = streamGenerator[Symbol.asyncIterator]();

      while (true) {
        // Check for interrupt
        if (this.isAborted(input.conversation_id)) {
          yield* this.handleInterrupt(input.conversation_id, messageId);
          return;
        }

        const nextResult = await Promise.race([
          iterator.next(),
          timeoutPromise,
        ]);

        if (nextResult.done) {
          break;
        }

        const streamEvent = nextResult.value;

        switch (streamEvent.type) {
          case "token": {
            // Emit token as message delta
            replyContent += streamEvent.content;
            const deltaEvent: MessageDeltaEvent = {
              event: "message.delta",
              conversation_id: input.conversation_id,
              message_id: messageId,
              payload: {
                type: "text",
                value: streamEvent.content,
              },
            };
            yield deltaEvent;
            break;
          }
          case "tool_start": {
            // Emit tool usage event
            yield {
              event: "agent.thinking",
              conversation_id: input.conversation_id,
              message_id: messageId,
              payload: { reason: "tool_selection" },
            };
            break;
          }
          case "tool_end": {
            // Tool execution completed
            console.log(
              `[chat] tool completed conversation=${input.conversation_id} tool=${streamEvent.name}`,
            );
            break;
          }
          case "done": {
            // Streaming completed
            console.log(
              `[chat] agent streaming completed conversation=${input.conversation_id} messageId=${messageId}`,
            );
            break;
          }
        }
      }

      // 8. Save assistant message
      const latencyMs = Date.now() - startTime;
      console.log(
        `[chat] saving assistant message conversation=${input.conversation_id} messageId=${messageId} latencyMs=${latencyMs} contentLength=${replyContent.length}`,
      );
      const assistantMessage = createChatMessage({
        id: messageId,
        conversationId: input.conversation_id,
        role: ChatRole.ASSISTANT,
        content: createTextContent(replyContent),
        status: MessageStatus.COMPLETE,
        metadata: {
          latency_ms: latencyMs,
        },
      });

      await this.chatRepository.saveMessage(assistantMessage);

      // 9. Emit message.completed
      const completedEvent: MessageCompletedEvent = {
        event: "message.completed",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: {
          message: {
            id: messageId,
            role: "agent",
            content: assistantMessage.content,
            status: "complete",
            created_at: assistantMessage.createdAt.toISOString(),
            metadata: {
              latency_ms: latencyMs,
            },
          },
        },
      };
      yield completedEvent;

      // 10. Emit chat.completed
      yield {
        event: "chat.completed",
        conversation_id: input.conversation_id,
        message_id: messageId,
      };
    } catch (error) {
      console.error(
        `[chat] stream error conversation=${input.conversation_id} messageId=${messageId}`,
        error,
      );
      // Emit error event
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Determine error code based on error type
      let errorCode = "INTERNAL_ERROR";
      let recoverable = true;

      if (error instanceof HttpError) {
        errorCode = "PERMISSION_DENIED";
      } else if (
        errorMessage.includes("rate limit") ||
        errorMessage.includes("429") ||
        errorMessage.includes("quota")
      ) {
        errorCode = "RATE_LIMITED";
        recoverable = true;
      } else if (errorMessage.includes("timed out")) {
        errorCode = "INTERNAL_ERROR";
        recoverable = true;
      }

      yield {
        event: "chat.failed",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: {
          error: {
            code: errorCode as
              | "RATE_LIMITED"
              | "TOOL_FAILED"
              | "PERMISSION_DENIED"
              | "INTERNAL_ERROR"
              | "VALIDATION_ERROR",
            message: errorMessage,
            recoverable,
          },
        },
      };
    } finally {
      // Cleanup
      StreamChatUseCase.activeStreams.delete(input.conversation_id);
      console.log(
        `[chat] stream end conversation=${input.conversation_id} messageId=${messageId}`,
      );
    }
  }

  private isAborted(conversationId: string): boolean {
    const stream = StreamChatUseCase.activeStreams.get(conversationId);
    return stream?.aborted ?? false;
  }

  private async *handleInterrupt(
    conversationId: string,
    messageId: string,
  ): AsyncGenerator<SSEEvent> {
    yield {
      event: "chat.interrupted",
      conversation_id: conversationId,
      message_id: messageId,
    };
  }

  private async loadChatHistory(
    conversationId: string,
  ): Promise<BaseMessage[]> {
    const messages = await this.chatRepository.getMessages(conversationId);
    const history: BaseMessage[] = [];

    for (const message of messages) {
      const text = message.content.map((c) => c.value).join("\n");
      if (message.role === ChatRole.USER) {
        history.push(new HumanMessage(text));
      } else if (message.role === ChatRole.ASSISTANT) {
        history.push(new AIMessage(text));
      }
    }

    return history;
  }

  private buildSystemMessage(
    agent: Agent,
    goalBlock: string,
    axesBlock: string,
  ): SystemMessage {
    return new SystemMessage(`${goalBlock}${axesBlock}
You are an AI assistant named "${agent.name}".

Operating Principle:
You operate in a goal-aware mode.
Early interactions should prioritize sense-making over task selection.

If a USER CURRENT GOAL is provided:
- Treat it as the primary reason the user is interacting with you.
- Frame advice, explanations, and questions to support progress toward that goal.
- Avoid generic or unrelated career advice.

If no USER CURRENT GOAL is set:
- Do not assume intent.
- Help clarify a concrete professional goal only when appropriate.
- Do not force goal setting.
- Continue to provide useful, low-commitment guidance.

Your role:
You are a professional career assistant.
Your purpose is to help the user succeed professionally over time through clear, grounded, and practical guidance.

Behavior rules:
- Be clear, calm, and supportive
- When the user expresses a broad or early-stage intent (e.g. “changing jobs”), do not respond with a list of services or options. First help the user articulate the underlying motivation or situation.
- When intent is unclear, prefer offering structured options over asking multiple direct questions
- When offering options early, frame them as ways of thinking about the situation, not as a list of services or features.
- Ask clarifying questions sparingly and one at a time
- Prefer actionable guidance over theory
- Avoid assumptions about the user's background or emotional state
- Do not execute actions unless explicitly requested
- Do not provide legal, medical, or financial advice
- If uncertain, say so

Focus areas:
- Career planning
- CV and resume improvement
- Interview preparation
- Skill assessment
- Professional communication

Quality bar:
- Prioritize correctness and user trust
- Avoid overconfidence
- Explain reasoning when it improves clarity

Tone:
${agent.configuration.tone}

Context usage:
If you need factual details from the user's uploaded documents, call the tool "retrieve_context" with an appropriate query.
The tool returns JSON with relevant snippets and metadata. Use it to ground your answer.
`);
  }
}
