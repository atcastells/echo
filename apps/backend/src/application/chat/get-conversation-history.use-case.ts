import { Service, Container } from "typedi";
import { CHAT_REPOSITORY } from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { ChatMessage } from "../../domain/entities/chat-message.js";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";

@Service()
export class GetConversationHistoryUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);

  async execute(
    userId: string,
    conversationId: string,
  ): Promise<ChatMessage[]> {
    const conversation =
      await this.chatRepository.getConversationById(conversationId);
    if (!conversation) throw new HttpError(404, "Conversation not found");

    if (conversation.userId !== userId) {
      throw new HttpError(403, "Unauthorized access to conversation");
    }

    return this.chatRepository.getMessages(conversationId);
  }
}
