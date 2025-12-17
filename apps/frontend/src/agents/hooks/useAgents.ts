/**
 * Agent Hooks
 *
 * TanStack Query hooks for agent operations.
 */

import { useQuery } from "@tanstack/react-query";
import { agentKeys } from "@/shared/api";
import { agentApi } from "../api";

/**
 * Hook to fetch the default agent for the authenticated user.
 */
export const useDefaultAgent = () => {
  return useQuery({
    queryKey: [...agentKeys.all, "default"] as const,
    queryFn: () => agentApi.getDefaultAgent(),
    staleTime: 5 * 60 * 1000, // Consider default agent stable for 5 minutes
  });
};

/**
 * Hook to fetch all agents for the authenticated user.
 */
export const useAgents = () => {
  return useQuery({
    queryKey: agentKeys.list(),
    queryFn: () => agentApi.listAgents(),
  });
};

/**
 * Hook to fetch a specific agent by ID.
 */
export const useAgent = (agentId: string) => {
  return useQuery({
    queryKey: agentKeys.detail(agentId),
    queryFn: () => agentApi.getAgent(agentId),
    enabled: !!agentId,
  });
};
