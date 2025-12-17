import { z } from "zod";
import {
  ChatRole,
  MessageStatus,
} from "../../../../../domain/entities/chat-message.js";

// =============================================================================
// Conversation Schema (replaces Thread)
// =============================================================================

export const contextPolicySchema = z.object({
  memory: z.enum(["on", "off", "ephemeral"]),
  max_tokens: z.number(),
  summarization: z.enum(["auto", "manual"]),
});

export const conversationSchema = z.object({
  agentId: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  contextPolicy: contextPolicySchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ConversationSchema = z.infer<typeof conversationSchema>;

// =============================================================================
// ChatMessage Schema
// =============================================================================

export const messageContentSchema = z.object({
  type: z.enum(["text", "markdown", "code", "citation"]),
  value: z.string(),
  language: z.string().optional(),
});

export const messageMetadataSchema = z.object({
  latency_ms: z.number().optional(),
  token_usage: z
    .object({
      input: z.number(),
      output: z.number(),
    })
    .optional(),
});

export const chatMessageSchema = z.object({
  conversationId: z.string(),
  role: z.nativeEnum(ChatRole),
  content: z.array(messageContentSchema),
  status: z.nativeEnum(MessageStatus),
  createdAt: z.date(),
  metadata: messageMetadataSchema.optional(),
});

export type ChatMessageSchema = z.infer<typeof chatMessageSchema>;

// =============================================================================
// Legacy Thread Schema (for backward compatibility)
// @deprecated Use conversationSchema instead
// =============================================================================

export const threadSchema = z.object({
  agentId: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ThreadSchema = z.infer<typeof threadSchema>;
