/**
 * State machines barrel export.
 *
 * State machines are ONLY allowed in:
 * - Organisms
 * - Pages
 *
 * Explicitly FORBIDDEN in:
 * - Atoms
 * - Molecules
 */

export * from "./common.types";
export {
  composerMachine,
  type ComposerContext,
  type ComposerEvent,
} from "./composer.machine";
export {
  messageItemMachine,
  type MessageItemContext,
  type MessageItemEvent,
} from "./messageItem.machine";
export {
  actionSurfaceMachine,
  type ActionSurfaceContext,
  type ActionSurfaceEvent,
} from "./actionSurface.machine";
export {
  agentPromptMachine,
  type AgentPromptContext,
  type AgentPromptEvent,
} from "./agentPrompt.machine";
