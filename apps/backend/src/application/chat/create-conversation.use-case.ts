import { Service, Container } from "typedi";
import {
  CHAT_REPOSITORY,
  AGENT_REPOSITORY,
} from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { AgentRepository } from "../../domain/ports/outbound/agent-repository.js";
import {
  Conversation,
  createConversation,
  DEFAULT_CONTEXT_POLICY,
} from "../../domain/entities/conversation.js";
import { AgentType } from "../../domain/entities/agent.js";
import { randomUUID } from "node:crypto";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";

@Service()
export class CreateConversationUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);
  private readonly agentRepository: AgentRepository =
    Container.get(AGENT_REPOSITORY);

  async execute(
    userId: string,
    agentId: string,
    title?: string,
  ): Promise<Conversation> {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) throw new HttpError(404, "Agent not found");

    // Access control
    if (agent.type === AgentType.PRIVATE && agent.userId !== userId) {
      throw new HttpError(403, "Unauthorized access to private agent");
    }

    // Feature flag check: when threads are disabled, only allow one default conversation
    if (!agent.configuration.enableThreads) {
      const existingConversations = await this.chatRepository.getConversations(
        userId,
        agentId,
      );
      if (existingConversations.length > 0) {
        throw new HttpError(
          403,
          "Multiple conversations are disabled for this agent. Use the existing conversation.",
        );
      }
    }

    const conversation = createConversation({
      id: randomUUID(),
      agentId,
      userId,
      title: title || "New Conversation",
      contextPolicy: DEFAULT_CONTEXT_POLICY,
    });

    return this.chatRepository.createConversation(conversation);
  }
}
