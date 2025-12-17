/**
 * Chat Feature Public API
 *
 * Re-exports all chat-related types, hooks, and utilities.
 */

// Types
export * from "./types";

// API
export { chatApi } from "./api";
export type { SSEClientOptions } from "./api";

// Hooks
export {
  useChat,
  useConversations,
  useConversationMessages,
  useCreateConversation,
  useInvalidateMessages,
  conversationKeys,
} from "./hooks";
export type { UseChatOptions, UseChatReturn } from "./hooks";

// State Machines
export {
  conversationMachine,
  type ConversationContext,
  type ConversationEvent,
} from "./machines";
