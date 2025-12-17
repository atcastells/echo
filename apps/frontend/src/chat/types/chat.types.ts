// Chat API v1 Types - Matching OpenAPI specification

// ============================================================================
// Conversation Types
// ============================================================================

export interface Conversation {
  id: string;
  agentId: string;
  userId: string;
  title?: string;
  contextPolicy?: ContextPolicy;
  createdAt: string;
  updatedAt: string;
}

export interface ContextPolicy {
  memory: "full" | "sliding_window" | "summarized";
  max_tokens?: number;
  summarization: "disabled" | "auto";
}

// ============================================================================
// Content Block Types
// ============================================================================

export type ContentBlockType = "text" | "markdown" | "code" | "citation";

export interface ContentBlock {
  type: ContentBlockType;
  value: string;
  language?: string; // for code blocks
  source?: string; // for citations
}

// ============================================================================
// Message Types
// ============================================================================

export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "streaming" | "complete" | "failed" | "interrupted";

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: ContentBlock[];
  status: MessageStatus;
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface MessageMetadata {
  latency_ms?: number;
  token_usage?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

// ============================================================================
// SSE Event Types
// ============================================================================

export type SSEEventType =
  | "chat.started"
  | "chat.completed"
  | "chat.interrupted"
  | "chat.failed"
  | "agent.thinking"
  | "message.delta"
  | "message.completed"
  | "agent.action.proposed"
  | "agent.action.executing"
  | "agent.action.completed"
  | "agent.action.failed"
  | "agent.prompt";

export interface SSEEvent {
  event: SSEEventType;
  conversation_id: string;
  message_id?: string;
  payload: Record<string, unknown>;
}

// SSE Event Payloads
export interface ChatStartedPayload {
  conversation_id: string;
  message_id: string;
}

export interface MessageDeltaPayload {
  delta: string;
  index?: number;
}

export interface MessageCompletedPayload {
  message: ChatMessage;
}

export interface ChatFailedPayload {
  error: string;
  code?: string;
}

export interface AgentActionProposedPayload {
  action_id: string;
  action_type: string;
  description: string;
  parameters: Record<string, unknown>;
  requires_confirmation: boolean;
}

// ============================================================================
// Request Types
// ============================================================================

export interface CreateConversationRequest {
  agent_id: string;
  title?: string;
}

export interface ChatRequest {
  conversation_id: string;
  message: {
    role: "user";
    content: ContentBlock[];
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

export interface ChatControlRequest {
  conversation_id: string;
  command?: "interrupt";
  message_id?: string;
  action_id?: string;
  decision?: "confirm" | "cancel" | "modify";
  parameters_override?: Record<string, unknown>;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ChatResponse {
  message: ChatMessage;
}

export interface ChatControlResponse {
  success: boolean;
  message: string;
  events?: SSEEvent[];
}
