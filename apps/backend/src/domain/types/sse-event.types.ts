/**
 * SSE Event Types for Conversational Agent API
 *
 * These types define all Server-Sent Events that the backend can emit
 * during a chat conversation. Events are designed to drive frontend
 * state machines deterministically.
 */

// =============================================================================
// Error Model
// =============================================================================

export interface ErrorPayload {
  code:
    | "RATE_LIMITED"
    | "TOOL_FAILED"
    | "PERMISSION_DENIED"
    | "INTERNAL_ERROR"
    | "VALIDATION_ERROR";
  message: string;
  recoverable: boolean;
  retry_after_ms?: number;
}

// =============================================================================
// Base Event Envelope
// =============================================================================

export interface BaseSSEEvent {
  event: string;
  conversation_id: string;
  message_id: string;
}

// =============================================================================
// Lifecycle Events
// =============================================================================

export interface ChatStartedEvent extends BaseSSEEvent {
  event: "chat.started";
}

export interface ChatCompletedEvent extends BaseSSEEvent {
  event: "chat.completed";
}

export interface ChatInterruptedEvent extends BaseSSEEvent {
  event: "chat.interrupted";
}

export interface ChatFailedEvent extends BaseSSEEvent {
  event: "chat.failed";
  payload: {
    error: ErrorPayload;
  };
}

export type ChatLifecycleEvent =
  | ChatStartedEvent
  | ChatCompletedEvent
  | ChatInterruptedEvent
  | ChatFailedEvent;

// =============================================================================
// Thinking / Reasoning Events
// =============================================================================

export type ThinkingReason =
  | "retrieving_context"
  | "planning"
  | "tool_selection";

export interface ThinkingEvent extends BaseSSEEvent {
  event: "agent.thinking";
  payload: {
    reason: ThinkingReason;
  };
}

// =============================================================================
// Streaming Token Events
// =============================================================================

export type ContentType = "text" | "markdown" | "code";

export interface MessageDeltaEvent extends BaseSSEEvent {
  event: "message.delta";
  payload: {
    type: ContentType;
    value: string;
    language?: string;
  };
}

// =============================================================================
// Message Completion
// =============================================================================

export interface MessageCompletedEvent extends BaseSSEEvent {
  event: "message.completed";
  payload: {
    message: {
      id: string;
      role: "user" | "agent" | "system";
      content: Array<{
        type: "text" | "markdown" | "code" | "citation";
        value: string;
        language?: string;
      }>;
      status: "complete" | "streaming" | "failed" | "interrupted";
      created_at: string;
      metadata?: {
        latency_ms?: number;
        token_usage?: {
          input: number;
          output: number;
        };
      };
    };
  };
}

// =============================================================================
// Action Events
// =============================================================================

export type ActionType = "rewrite" | "generate" | "execute_tool";

export interface ActionProposedEvent extends BaseSSEEvent {
  event: "agent.action.proposed";
  payload: {
    action_id: string;
    type: ActionType;
    label: string;
    preview: string;
    requires_confirmation: boolean;
    parameters: Record<string, unknown>;
  };
}

export interface ActionExecutingEvent extends BaseSSEEvent {
  event: "agent.action.executing";
  payload: {
    action_id: string;
  };
}

export interface ActionCompletedEvent extends BaseSSEEvent {
  event: "agent.action.completed";
  payload: {
    action_id: string;
    result_message?: {
      id: string;
      role: "agent";
      content: Array<{
        type: "text" | "markdown" | "code" | "citation";
        value: string;
        language?: string;
      }>;
      status: "complete";
      created_at: string;
    };
  };
}

export interface ActionFailedEvent extends BaseSSEEvent {
  event: "agent.action.failed";
  payload: {
    action_id: string;
    error: ErrorPayload;
  };
}

export type ActionEvent =
  | ActionProposedEvent
  | ActionExecutingEvent
  | ActionCompletedEvent
  | ActionFailedEvent;

// =============================================================================
// Agent Prompt Events
// =============================================================================

export type PromptType =
  | "clarification"
  | "suggestion"
  | "warning"
  | "confirmation";

export interface PromptOption {
  id: string;
  label: string;
}

export interface AgentPromptEvent extends BaseSSEEvent {
  event: "agent.prompt";
  payload: {
    prompt_id: string;
    type: PromptType;
    content: string;
    options: PromptOption[];
  };
}

// =============================================================================
// Transparency Events
// =============================================================================

export interface TransparencyEvent extends BaseSSEEvent {
  event: "agent.transparency";
  payload: {
    context_used: string[];
    tools_invoked: string[];
    memory_written: boolean;
    confidence: number;
  };
}

// =============================================================================
// Union of All SSE Events
// =============================================================================

export type SSEEvent =
  | ChatLifecycleEvent
  | ThinkingEvent
  | MessageDeltaEvent
  | MessageCompletedEvent
  | ActionEvent
  | AgentPromptEvent
  | TransparencyEvent;

// =============================================================================
// Event Type Guard Helpers
// =============================================================================

export function isLifecycleEvent(event: SSEEvent): event is ChatLifecycleEvent {
  return event.event.startsWith("chat.");
}

export function isActionEvent(event: SSEEvent): event is ActionEvent {
  return event.event.startsWith("agent.action.");
}

export function isStreamingEvent(event: SSEEvent): event is MessageDeltaEvent {
  return event.event === "message.delta";
}
