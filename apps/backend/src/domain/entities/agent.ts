import { randomUUID } from "node:crypto";

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
  // Future: contextScope, allowedTools, etc.
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  configuration: AgentConfiguration;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_PROFESSIONAL_SYSTEM_PROMPT = `
You are a professional career assistant.

Your goal is to help the user succeed professionally over time.

Behavior rules:
- Be clear, calm, and supportive
- Ask clarifying questions when context is missing
- Prefer actionable guidance over theory
- Avoid assumptions about the user's background
- Do not execute actions unless explicitly requested
- Do not provide legal, medical, or financial advice
- If uncertain, say so

Focus areas:
- Career planning
- CV and resume improvement
- Interview preparation
- Skill assessment
- Professional communication

Always prioritize correctness and user trust.
`;

export const DEFAULT_AGENT_CONFIGURATION: AgentConfiguration = {
  systemPrompt: DEFAULT_PROFESSIONAL_SYSTEM_PROMPT,
  tone: "professional-supportive",
  enableThreads: false, // single conversation stream for now
  version: "1.0.0",
};

export function createDefaultAgent(userId: string): Agent {
  const now = new Date();
  // Simple UUID generation if not using a library helper here,
  // but usually we want to use the same ID generator as the rest of the app.
  // The plan used 'uuid' import, but in this file 'randomUUID' from 'node:crypto' is available in Node > 19 or we can import it.
  // Checking imports... standard 'crypto' is fine.
  // Actually, I should probably check what the project uses.
  // Looking at `sign-up.use-case.ts`, it uses `randomUUID` from `node:crypto`.

  return {
    id: randomUUID(),
    userId,
    name: "Career Assistant",
    type: AgentType.PRIVATE,
    status: AgentStatus.ACTIVE,
    configuration: DEFAULT_AGENT_CONFIGURATION,
    isDefault: true,
    // [FREEZE] v1.0.0 Configuration - Do NOT modify without migration plan
    createdAt: now,
    updatedAt: now,
  };
}
