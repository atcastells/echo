/**
 * Chat Message Entity
 *
 * Represents a single message in a conversation. Messages are immutable
 * once created - only the status field may change.
 */

export enum ChatRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export enum MessageStatus {
  STREAMING = "streaming",
  COMPLETE = "complete",
  FAILED = "failed",
  INTERRUPTED = "interrupted",
}

/**
 * Structured content block within a message
 */
export interface MessageContent {
  type: "text" | "markdown" | "code" | "citation";
  value: string;
  /** Programming language for code blocks */
  language?: string;
}

/**
 * Optional metadata about message generation
 */
export interface MessageMetadata {
  /** Time to generate response in milliseconds */
  latency_ms?: number;
  /** Token usage statistics */
  token_usage?: {
    input: number;
    output: number;
  };
}

export interface ChatMessage {
  /** Unique identifier (UUID) */
  id: string;
  /** Conversation this message belongs to */
  conversationId: string;
  /** Role of the message sender */
  role: ChatRole;
  /** Structured content blocks */
  content: MessageContent[];
  /** Current status of the message */
  status: MessageStatus;
  /** Creation timestamp */
  createdAt: Date;
  /** Optional generation metadata */
  metadata?: MessageMetadata;
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create a simple text content array from a string
 */
export function createTextContent(text: string): MessageContent[] {
  return [{ type: "text", value: text }];
}

/**
 * Extract plain text from structured content
 */
export function getPlainText(content: MessageContent[]): string {
  return content.map((c) => c.value).join("\n");
}

/**
 * Create a new ChatMessage with defaults
 */
export function createChatMessage(
  parameters: Pick<ChatMessage, "id" | "conversationId" | "role" | "content"> &
    Partial<Pick<ChatMessage, "status" | "metadata">>,
): ChatMessage {
  return {
    id: parameters.id,
    conversationId: parameters.conversationId,
    role: parameters.role,
    content: parameters.content,
    status: parameters.status ?? MessageStatus.COMPLETE,
    createdAt: new Date(),
    metadata: parameters.metadata,
  };
}
