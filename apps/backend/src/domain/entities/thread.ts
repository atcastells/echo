/**
 * @deprecated Use Conversation from './conversation.ts' instead.
 * This file is kept for backward compatibility during migration.
 */

import { Conversation } from "./conversation.js";

/**
 * @deprecated Use Conversation instead
 */
export type Thread = Omit<Conversation, "contextPolicy">;

/**
 * Convert a Conversation to the legacy Thread format
 * @deprecated
 */
export function conversationToThread(conversation: Conversation): Thread {
  return {
    id: conversation.id,
    agentId: conversation.agentId,
    userId: conversation.userId,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}
