/**
 * Agent Types
 *
 * Type definitions for agents matching backend entities.
 */

export enum AgentType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum AgentStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface AgentConfiguration {
  systemPrompt: string;
  tone: string;
  enableThreads: boolean;
  version?: string;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  configuration: AgentConfiguration;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
