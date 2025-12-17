import { Service, Container } from "typedi";
import { Agent } from "../../domain/entities/agent.js";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import { AGENT_REPOSITORY } from "../../infrastructure/constants.js";

@Service()
export class GetAgentUseCase {
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);

  async execute(agentId: string): Promise<Agent | undefined> {
    return this.agentRepository.findById(agentId);
  }
}
