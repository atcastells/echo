/**
 * useConversations Hook
 *
 * React Query hooks for conversation CRUD operations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chatApi";
import type { CreateConversationRequest } from "../types/chat.types";

// ============================================================================
// Query Keys
// ============================================================================

export const conversationKeys = {
  all: ["conversations"] as const,
  list: (agentId: string) => [...conversationKeys.all, "list", agentId] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
  messages: (id: string) =>
    [...conversationKeys.all, "messages", id] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch all conversations for an agent.
 */
export const useConversations = (agentId: string) => {
  return useQuery({
    queryKey: conversationKeys.list(agentId),
    queryFn: () => chatApi.listConversations(agentId),
    enabled: !!agentId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Fetch messages for a specific conversation.
 */
export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => chatApi.getConversationMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new conversation.
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) =>
      chatApi.createConversation(data),
    onSuccess: (newConversation, variables) => {
      // Invalidate the conversations list to refetch
      queryClient.invalidateQueries({
        queryKey: conversationKeys.list(variables.agent_id),
      });

      // Optionally, optimistically add to cache
      queryClient.setQueryData(
        conversationKeys.detail(newConversation.id),
        newConversation,
      );
    },
  });
};

/**
 * Hook to invalidate conversation messages (useful after sending a message).
 */
export const useInvalidateMessages = () => {
  const queryClient = useQueryClient();

  return (conversationId: string) => {
    queryClient.invalidateQueries({
      queryKey: conversationKeys.messages(conversationId),
    });
  };
};
