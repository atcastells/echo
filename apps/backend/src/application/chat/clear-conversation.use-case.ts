import { Service, Container } from "typedi";
import { CHAT_REPOSITORY } from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";

@Service()
export class ClearConversationUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);
  async execute(conversationId: string): Promise<void> {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    // We only clear messages, we don't delete the conversation itself
    await this.chatRepository.deleteMessages(conversationId);
  }
}
