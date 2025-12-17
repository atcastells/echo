/**
 * Chat API Client
 *
 * Provides functions to interact with the Chat API v1 endpoints.
 */

import { apiClient } from "@/shared/api";
import type {
  Conversation,
  ChatMessage,
  CreateConversationRequest,
  ChatRequest,
  ChatControlRequest,
  ChatControlResponse,
  ChatResponse,
  SSEEvent,
} from "../types/chat.types";
import { createSSEStream, type SSEClientOptions } from "./sseClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const chatApi = {
  // ============================================================================
  // Conversation CRUD Operations
  // ============================================================================

  /**
   * Create a new conversation with an agent.
   */
  createConversation: (data: CreateConversationRequest): Promise<Conversation> =>
    apiClient.post<Conversation>("/v1/conversations", data),

  /**
   * List all conversations for a specific agent.
   */
  listConversations: (agentId: string): Promise<Conversation[]> =>
    apiClient.get<Conversation[]>("/v1/conversations", {
      params: { agent_id: agentId },
    }),

  /**
   * Get all messages for a conversation.
   */
  getConversationMessages: (conversationId: string): Promise<ChatMessage[]> =>
    apiClient.get<ChatMessage[]>(`/v1/conversations/${conversationId}/messages`),

  // ============================================================================
  // Chat Operations
  // ============================================================================

  /**
   * Send a message and receive a complete response (non-streaming).
   */
  chat: (data: ChatRequest): Promise<ChatResponse> =>
    apiClient.post<ChatResponse>("/v1/chat", data),

  /**
   * Send a message and receive streaming response via SSE.
   *
   * @returns Promise resolving to AbortController for cancellation
   */
  chatStream: (
    data: ChatRequest,
    handlers: SSEClientOptions,
  ): Promise<AbortController> => {
    const token = localStorage.getItem("auth_token");
    return createSSEStream(`${API_BASE}/v1/chat/stream`, data, token, handlers);
  },

  // ============================================================================
  // Chat Control Operations
  // ============================================================================

  /**
   * Control an active chat session (interrupt, confirm actions, etc.).
   */
  control: (data: ChatControlRequest): Promise<ChatControlResponse> =>
    apiClient.post<ChatControlResponse>("/v1/chat/control", data),

  /**
   * Interrupt an ongoing streaming response.
   */
  interrupt: (
    conversationId: string,
    messageId?: string,
  ): Promise<ChatControlResponse> =>
    apiClient.post<ChatControlResponse>("/v1/chat/control", {
      conversation_id: conversationId,
      command: "interrupt",
      message_id: messageId,
    }),

  /**
   * Confirm a proposed agent action.
   */
  confirmAction: (
    conversationId: string,
    actionId: string,
  ): Promise<ChatControlResponse> =>
    apiClient.post<ChatControlResponse>("/v1/chat/control", {
      conversation_id: conversationId,
      action_id: actionId,
      decision: "confirm",
    }),

  /**
   * Cancel a proposed agent action.
   */
  cancelAction: (
    conversationId: string,
    actionId: string,
  ): Promise<ChatControlResponse> =>
    apiClient.post<ChatControlResponse>("/v1/chat/control", {
      conversation_id: conversationId,
      action_id: actionId,
      decision: "cancel",
    }),

  /**
   * Modify and confirm a proposed agent action with new parameters.
   */
  modifyAction: (
    conversationId: string,
    actionId: string,
    parametersOverride: Record<string, unknown>,
  ): Promise<ChatControlResponse> =>
    apiClient.post<ChatControlResponse>("/v1/chat/control", {
      conversation_id: conversationId,
      action_id: actionId,
      decision: "modify",
      parameters_override: parametersOverride,
    }),
};

// Re-export types for convenience
export type { SSEEvent, SSEClientOptions };
