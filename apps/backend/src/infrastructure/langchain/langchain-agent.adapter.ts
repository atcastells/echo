import { AgentConfiguration } from "../../domain/entities/agent.js";

export interface LangChainRuntimeConfiguration {
  systemPrompt: string;
  temperature: number;
  memory: "conversation" | "thread";
}

export function buildLangChainAgent(
  configuration: AgentConfiguration,
): LangChainRuntimeConfiguration {
  return {
    systemPrompt: configuration.systemPrompt,
    temperature: resolveTemperature(configuration.tone),
    memory: configuration.enableThreads ? "thread" : "conversation",
  };
}

export function resolveTemperature(tone: string): number {
  switch (tone) {
    case "professional-supportive": {
      return 0.4;
    }
    case "concise": {
      return 0.2;
    }
    case "creative": {
      return 0.8;
    }
    default: {
      return 0.5;
    }
  }
}

export class AgentScopeError extends Error {
  public code = "AGENT_SCOPE_VIOLATION";

  constructor(message = "Input is out of scope for this agent") {
    super(message);
    this.name = "AgentScopeError";
  }
}

export function validateInputScope(input: string): void {
  // Simple heuristic for demo/v1 safety
  // In reality, this might be a classification model call
  const forbiddenTerms = ["ignore all instructions", "system override"];
  const lower = input.toLowerCase();

  if (forbiddenTerms.some((term) => lower.includes(term))) {
    throw new AgentScopeError();
  }
}
