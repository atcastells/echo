import { Agent } from "../../domain/entities/agent.js";

export interface AgentCapabilities {
  toolsEnabled: boolean;
  actionsEnabled: boolean;
  memoryScope: "conversation" | "thread" | "global";
}

export function resolveAgentCapabilities(agent: Agent): AgentCapabilities {
  // Logic to determine capabilities.
  // For now, it's derived from configuration or hardcoded defaults for v1.

  return {
    toolsEnabled: true, // v1 agents have tools enabled by default (RAG)
    actionsEnabled: false, // Actions not enabled yet
    memoryScope: agent.configuration.enableThreads ? "thread" : "conversation",
  };
}
