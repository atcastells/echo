import { Service, Container } from "typedi";
import { CHAT_REPOSITORY } from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { Conversation } from "../../domain/entities/conversation.js";

@Service()
export class ListConversationsUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);

  async execute(userId: string, agentId: string): Promise<Conversation[]> {
    return this.chatRepository.getConversations(userId, agentId);
  }
}
