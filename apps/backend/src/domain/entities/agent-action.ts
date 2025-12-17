/**
 * Agent Action Entity
 *
 * Represents an action proposed by the agent that may require
 * user confirmation before execution.
 */

export type ActionType = "rewrite" | "generate" | "execute_tool";

export type ActionStatus =
  | "proposed"
  | "confirmed"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export interface AgentAction {
  /** Unique identifier (UUID) */
  id: string;
  /** Conversation this action belongs to */
  conversationId: string;
  /** Message that triggered this action */
  messageId: string;
  /** Type of action */
  type: ActionType;
  /** Human-readable label for the action */
  label: string;
  /** Short preview/description of what the action will do */
  preview: string;
  /** Whether user confirmation is required before execution */
  requiresConfirmation: boolean;
  /** Action-specific parameters */
  parameters: Record<string, unknown>;
  /** Current status of the action */
  status: ActionStatus;
  /** Result of the action (if completed) */
  result?: unknown;
  /** Error details (if failed) */
  error?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Create a new AgentAction with defaults
 */
export function createAgentAction(
  parameters: Pick<
    AgentAction,
    | "id"
    | "conversationId"
    | "messageId"
    | "type"
    | "label"
    | "preview"
    | "parameters"
  > &
    Partial<Pick<AgentAction, "requiresConfirmation" | "status">>,
): AgentAction {
  const now = new Date();
  return {
    id: parameters.id,
    conversationId: parameters.conversationId,
    messageId: parameters.messageId,
    type: parameters.type,
    label: parameters.label,
    preview: parameters.preview,
    requiresConfirmation: parameters.requiresConfirmation ?? true,
    parameters: parameters.parameters,
    status: parameters.status ?? "proposed",
    createdAt: now,
    updatedAt: now,
  };
}
