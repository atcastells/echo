import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { z } from "zod";
import { StreamChatUseCase } from "../../../../application/chat/stream-chat.use-case.js";
import { InterruptChatUseCase } from "../../../../application/chat/interrupt-chat.use-case.js";
import { ConfirmActionUseCase } from "../../../../application/chat/confirm-action.use-case.js";
import { CreateConversationUseCase } from "../../../../application/chat/create-conversation.use-case.js";
import { ListConversationsUseCase } from "../../../../application/chat/list-conversations.use-case.js";
import { GetConversationHistoryUseCase } from "../../../../application/chat/get-conversation-history.use-case.js";
import { AuthenticatedRequest } from "../middlewares/auth-middleware.js";
import { HttpError } from "../errors/http-error.js";

// =============================================================================
// Request Schemas
// =============================================================================

const messageContentSchema = z.object({
  type: z.literal("text"),
  value: z.string().min(1),
});

const chatRequestSchema = z.object({
  conversation_id: z.string().min(1),
  message: z.object({
    role: z.literal("user"),
    content: z.array(messageContentSchema).min(1),
  }),
  agent: z
    .object({
      persona: z.string().optional(),
      tone: z.string().optional(),
      mode: z.string().optional(),
    })
    .optional(),
  capabilities: z
    .object({
      tools_allowed: z.array(z.string()).optional(),
      requires_confirmation: z.array(z.string()).optional(),
    })
    .optional(),
  context: z
    .object({
      include_memory: z.boolean().optional(),
      max_tokens: z.number().optional(),
    })
    .optional(),
});

const controlRequestSchema = z.object({
  conversation_id: z.string().min(1),
  command: z.enum(["interrupt"]).optional(),
  message_id: z.string().optional(),
  action_id: z.string().optional(),
  decision: z.enum(["confirm", "cancel", "modify"]).optional(),
  parameters_override: z.record(z.string(), z.unknown()).optional(),
});

const createConversationSchema = z.object({
  agent_id: z.string(),
  title: z.string().optional(),
});

// =============================================================================
// Controller
// =============================================================================

export class ChatController {
  private readonly streamChatUseCase = Container.get(StreamChatUseCase);
  private readonly interruptChatUseCase = Container.get(InterruptChatUseCase);
  private readonly confirmActionUseCase = Container.get(ConfirmActionUseCase);
  private readonly createConversationUseCase = Container.get(
    CreateConversationUseCase,
  );
  private readonly listConversationsUseCase = Container.get(
    ListConversationsUseCase,
  );
  private readonly getConversationHistoryUseCase = Container.get(
    GetConversationHistoryUseCase,
  );

  /**
   * POST /v1/conversations
   * Create a new conversation
   */
  async createConversation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const { agent_id, title } = createConversationSchema.parse(request.body);
      const conversation = await this.createConversationUseCase.execute(
        authRequest.user.id,
        agent_id,
        title,
      );

      response.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/conversations
   * List conversations for a user/agent
   */
  async listConversations(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const agentId = request.query.agent_id as string;
      if (!agentId) {
        throw new HttpError(400, "agent_id query parameter is required");
      }

      const conversations = await this.listConversationsUseCase.execute(
        authRequest.user.id,
        agentId,
      );

      response.json(conversations);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/conversations/:id/messages
   * Get conversation message history
   */
  async getConversationHistory(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const conversationId = request.params.id;
      const messages = await this.getConversationHistoryUseCase.execute(
        authRequest.user.id,
        conversationId,
      );

      response.json(messages);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/chat
   * Non-streaming chat endpoint - collects all events and returns final message
   */
  async chat(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const input = chatRequestSchema.parse(request.body);

      // Collect all events and return the final message
      let finalMessage: unknown = undefined;
      let error: unknown = undefined;

      for await (const event of this.streamChatUseCase.execute(
        authRequest.user.id,
        input,
      )) {
        if (event.event === "message.completed") {
          finalMessage = event.payload.message;
        } else if (event.event === "chat.failed") {
          error = event.payload.error;
        }
      }

      if (error) {
        response.status(500).json({ error });
        return;
      }

      response.json({
        message: finalMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /v1/chat/stream
   * SSE streaming endpoint
   */
  async streamChat(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const input = chatRequestSchema.parse(request.body);

      // Set SSE headers
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
      response.flushHeaders();

      // Handle client disconnect
      // eslint-disable-next-line no-undef
      const abortController = new AbortController();
      request.on("close", () => {
        abortController.abort();
        StreamChatUseCase.interrupt(input.conversation_id);
      });

      try {
        for await (const event of this.streamChatUseCase.execute(
          authRequest.user.id,
          input,
        )) {
          if (abortController.signal.aborted) {
            break;
          }

          response.write(`data: ${JSON.stringify(event)}\n\n`);
        }
      } catch (streamError) {
        // Emit error event
        const errorMessage =
          streamError instanceof Error
            ? streamError.message
            : "Stream error occurred";
        response.write(
          `data: ${JSON.stringify({
            event: "chat.failed",
            conversation_id: input.conversation_id,
            message_id: "error",
            payload: {
              error: {
                code: "INTERNAL_ERROR",
                message: errorMessage,
                recoverable: true,
              },
            },
          })}\n\n`,
        );
      }

      response.end();
    } catch (error) {
      // If headers haven't been sent yet, use error handler
      if (response.headersSent) {
        // Headers already sent, just end the response
        response.end();
      } else {
        next(error);
      }
    }
  }

  /**
   * POST /v1/chat/control
   * Control commands (interrupt, action confirmation)
   */
  async control(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const input = controlRequestSchema.parse(request.body);

      // Handle interrupt command
      if (input.command === "interrupt" && input.message_id) {
        const result = await this.interruptChatUseCase.execute(
          authRequest.user.id,
          {
            conversation_id: input.conversation_id,
            message_id: input.message_id,
          },
        );
        response.json(result);
        return;
      }

      // Handle action confirmation
      if (input.action_id && input.decision) {
        const events: unknown[] = [];
        for await (const event of this.confirmActionUseCase.execute(
          authRequest.user.id,
          {
            conversation_id: input.conversation_id,
            action_id: input.action_id,
            decision: input.decision,
            parameters_override: input.parameters_override,
          },
        )) {
          events.push(event);
        }
        response.json({ events });
        return;
      }

      throw new HttpError(
        400,
        "Invalid control request: must specify either command or action_id with decision",
      );
    } catch (error) {
      next(error);
    }
  }
}
