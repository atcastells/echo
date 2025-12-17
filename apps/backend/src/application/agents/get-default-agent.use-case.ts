import { Service, Container } from "typedi";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import { AGENT_REPOSITORY } from "../../infrastructure/constants.js";
import { Agent } from "../../domain/entities/agent.js";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";

@Service()
export class GetDefaultAgentUseCase {
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);

  async execute(userId: string): Promise<Agent> {
    const agents = await this.agentRepository.findByUserId(userId);
    const defaultAgent = agents.find((agent) => agent.isDefault);

    if (!defaultAgent) {
      // Fallback: If no default agent is explicitly marked (migration/legacy),
      // we could either return the first one or throw.
      // For now, let's create one on the fly or throw.
      // Given the robustness requirement, I'll simple throw 404 and let frontend handle or
      // return the first 'Career Assistant' named one if exists.
      // Let's stick to strict `isDefault` for now as we just added it.
      
      const legacyDefault = agents.find(a => a.name === "Career Assistant");
      if (legacyDefault) return legacyDefault;

      throw new HttpError(404, "Default agent not found for user", "DEFAULT_AGENT_MISSING");
    }

    return defaultAgent;
  }
}
