import { Service, Container } from "typedi";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import {
  AGENT_REPOSITORY,
  CHAT_REPOSITORY,
} from "../../infrastructure/constants.js";
import { ConversationAgentFactory } from "../../adapters/inbound/primary/agents/conversation-agent-factory.js";
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
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);
  private readonly conversationAgentFactory: ConversationAgentFactory =
    Container.get(ConversationAgentFactory);

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

      if (agent.type === AgentType.PRIVATE && agent.userId !== userId) {
        throw new HttpError(403, "Unauthorized access to private agent");
      }

      // 2. Emit chat.started
      yield {
        event: "chat.started",
        conversation_id: input.conversation_id,
        message_id: messageId,
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
          id: randomUUID(),
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

      // 6. Build agent and stream response
      const systemMessage = this.buildSystemMessage(agent);
      const tools = [createRetrieveContextTool(userId)];
      const agentExecutor = this.conversationAgentFactory.buildWithSystemPrompt(
        {
          systemPrompt: systemMessage.content.toString(),
          tools,
        },
      );

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

      // For now, use non-streaming invoke and simulate streaming
      // TODO: Integrate with LangChain streaming callback
      const result = await agentExecutor.invoke({
        input: userMessageText,
        chat_history: chatHistory,
      });

      // Check for interrupt before sending response
      if (this.isAborted(input.conversation_id)) {
        yield* this.handleInterrupt(input.conversation_id, messageId);
        return;
      }

      // eslint-disable-next-line unicorn/prefer-at
      const lastMessage = result.messages[result.messages.length - 1];
      const replyContent = lastMessage?.content?.toString() ?? "";

      // 7. Stream response tokens (simulated chunking for now)
      const chunks = this.chunkResponse(replyContent);
      for (const chunk of chunks) {
        if (this.isAborted(input.conversation_id)) {
          yield* this.handleInterrupt(input.conversation_id, messageId);
          return;
        }

        const deltaEvent: MessageDeltaEvent = {
          event: "message.delta",
          conversation_id: input.conversation_id,
          message_id: messageId,
          payload: {
            type: "text",
            value: chunk,
          },
        };
        yield deltaEvent;
      }

      // 8. Save assistant message
      const latencyMs = Date.now() - startTime;
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
      // Emit error event
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorCode =
        error instanceof HttpError ? "PERMISSION_DENIED" : "INTERNAL_ERROR";

      yield {
        event: "chat.failed",
        conversation_id: input.conversation_id,
        message_id: messageId,
        payload: {
          error: {
            code: errorCode,
            message: errorMessage,
            recoverable: true,
          },
        },
      };
    } finally {
      // Cleanup
      StreamChatUseCase.activeStreams.delete(input.conversation_id);
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

  private chunkResponse(text: string, chunkSize = 20): string[] {
    const words = text.split(" ");
    const chunks: string[] = [];
    let current = "";

    for (const word of words) {
      if (current.length + word.length + 1 > chunkSize && current) {
        chunks.push(current + " ");
        current = word;
      } else {
        current = current ? current + " " + word : word;
      }
    }

    if (current) {
      chunks.push(current);
    }

    return chunks;
  }
}
