/**
 * Conversation Entity
 *
 * Replaces the Thread entity. A Conversation represents a stateful
 * chat session between a user and an agent.
 */

export interface ContextPolicy {
  /** Memory mode: on = persistent, off = no memory, ephemeral = session only */
  memory: "on" | "off" | "ephemeral";
  /** Maximum tokens to include in context window */
  max_tokens: number;
  /** Summarization strategy for long conversations */
  summarization: "auto" | "manual";
}

export const DEFAULT_CONTEXT_POLICY: ContextPolicy = {
  memory: "on",
  max_tokens: 8000,
  summarization: "auto",
};

export interface Conversation {
  /** Unique identifier (UUID) */
  id: string;
  /** Optional title for the conversation */
  title?: string;
  /** Agent this conversation is with */
  agentId: string;
  /** User who owns this conversation */
  userId: string;
  /** Context/memory policy for this conversation */
  contextPolicy: ContextPolicy;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Create a new Conversation with default values
 */
export function createConversation(
  parameters: Pick<Conversation, "id" | "agentId" | "userId"> &
    Partial<Pick<Conversation, "title" | "contextPolicy">>,
): Conversation {
  const now = new Date();
  return {
    id: parameters.id,
    title: parameters.title,
    agentId: parameters.agentId,
    userId: parameters.userId,
    contextPolicy: parameters.contextPolicy ?? DEFAULT_CONTEXT_POLICY,
    createdAt: now,
    updatedAt: now,
  };
}
