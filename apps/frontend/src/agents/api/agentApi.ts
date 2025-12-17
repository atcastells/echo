/**
 * Agent API Client
 *
 * Provides functions to interact with the Agent API endpoints.
 */

import { apiClient } from "@/shared/api";
import type { Agent } from "../types";

export const agentApi = {
  /**
   * Get the default agent for the authenticated user.
   */
  getDefaultAgent: (): Promise<Agent> =>
    apiClient.get<Agent>("/api/v1/agents/default"),

  /**
   * List all agents for the authenticated user.
   */
  listAgents: (): Promise<Agent[]> => apiClient.get<Agent[]>("/v1/agents"),

  /**
   * Get a specific agent by ID.
   */
  getAgent: (agentId: string): Promise<Agent> =>
    apiClient.get<Agent>(`/v1/agents/${agentId}`),
};
