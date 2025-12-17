import { Service, Container } from "typedi";
import { CHAT_REPOSITORY } from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { SSEEvent } from "../../domain/types/sse-event.types.js";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";

export interface ConfirmActionInput {
  conversation_id: string;
  action_id: string;
  decision: "confirm" | "cancel" | "modify";
  parameters_override?: Record<string, unknown>;
}

/**
 * Handle action confirmations from the client.
 *
 * When an agent proposes an action with requires_confirmation: true,
 * the client must call this use case to confirm, cancel, or modify
 * the action before it can be executed.
 */
@Service()
export class ConfirmActionUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);

  // In-memory action store (in production, use persistent storage)
  private static pendingActions = new Map<
    string,
    {
      action_id: string;
      conversation_id: string;
      type: string;
      parameters: Record<string, unknown>;
      status: "proposed" | "confirmed" | "executing" | "completed" | "failed";
    }
  >();

  static registerAction(
    actionId: string,
    conversationId: string,
    type: string,
    parameters: Record<string, unknown>,
  ): void {
    ConfirmActionUseCase.pendingActions.set(actionId, {
      action_id: actionId,
      conversation_id: conversationId,
      type,
      parameters,
      status: "proposed",
    });
  }

  async *execute(
    userId: string,
    input: ConfirmActionInput,
  ): AsyncGenerator<SSEEvent> {
    // 1. Validate conversation access
    const conversation = await this.chatRepository.getConversationById(
      input.conversation_id,
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    if (conversation.userId !== userId) {
      throw new HttpError(403, "Unauthorized access to conversation");
    }

    // 2. Get pending action
    const action = ConfirmActionUseCase.pendingActions.get(input.action_id);
    if (!action) {
      throw new HttpError(404, "Action not found");
    }

    if (action.conversation_id !== input.conversation_id) {
      throw new HttpError(403, "Action does not belong to this conversation");
    }

    if (action.status !== "proposed") {
      throw new HttpError(400, `Action is already ${action.status}`);
    }

    // 3. Handle decision
    if (input.decision === "cancel") {
      ConfirmActionUseCase.pendingActions.delete(input.action_id);
      // No event needed for cancel - client already knows
      return;
    }

    // Merge parameter overrides
    if (input.parameters_override) {
      action.parameters = {
        ...action.parameters,
        ...input.parameters_override,
      };
    }

    // 4. Mark as executing
    action.status = "executing";
    yield {
      event: "agent.action.executing",
      conversation_id: input.conversation_id,
      message_id: input.action_id, // Use action_id as message_id for action events
      payload: {
        action_id: input.action_id,
      },
    };

    try {
      // 5. Execute the action (placeholder - actual execution depends on action type)
      // In a real implementation, this would dispatch to specific action handlers
      await this.executeAction(action);

      action.status = "completed";
      yield {
        event: "agent.action.completed",
        conversation_id: input.conversation_id,
        message_id: input.action_id,
        payload: {
          action_id: input.action_id,
        },
      };
    } catch (error) {
      action.status = "failed";
      const errorMessage =
        error instanceof Error ? error.message : "Action execution failed";

      yield {
        event: "agent.action.failed",
        conversation_id: input.conversation_id,
        message_id: input.action_id,
        payload: {
          action_id: input.action_id,
          error: {
            code: "TOOL_FAILED",
            message: errorMessage,
            recoverable: true,
          },
        },
      };
    } finally {
      // Cleanup
      ConfirmActionUseCase.pendingActions.delete(input.action_id);
    }
  }

  private async executeAction(action: {
    type: string;
    parameters: Record<string, unknown>;
  }): Promise<void> {
    // Placeholder for action execution
    // In production, this would dispatch to specific handlers based on action.type
    switch (action.type) {
      case "rewrite": {
        // Handle rewrite action
        break;
      }
      case "generate": {
        // Handle generate action
        break;
      }
      case "execute_tool": {
        // Handle tool execution
        break;
      }
      default: {
        throw new Error(`Unknown action type: ${action.type}`);
      }
    }
  }
}
