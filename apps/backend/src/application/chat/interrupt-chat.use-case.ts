import { Service, Container } from "typedi";
import { CHAT_REPOSITORY } from "../../infrastructure/constants.js";
import { ChatRepository } from "../../domain/ports/outbound/chat-repository.js";
import { SSEEvent } from "../../domain/types/sse-event.types.js";
import { MessageStatus } from "../../domain/entities/chat-message.js";
import { HttpError } from "../../adapters/inbound/http/errors/http-error.js";
import { StreamChatUseCase } from "./stream-chat.use-case.js";

export interface InterruptChatInput {
  conversation_id: string;
  message_id: string;
}

@Service()
export class InterruptChatUseCase {
  private readonly chatRepository: ChatRepository =
    Container.get(CHAT_REPOSITORY);

  async execute(userId: string, input: InterruptChatInput): Promise<SSEEvent> {
    // 1. Validate conversation access
    const conversation = await this.chatRepository.getConversationById(
      input.conversation_id,
    );
    if (!conversation) {
      throw new HttpError(404, "Conversation not found");
    }

    if (conversation.userId !== userId) {
      throw new HttpError(403, "Unauthorized access to conversation");
    }

    // 2. Signal abort to active stream
    const interrupted = StreamChatUseCase.interrupt(input.conversation_id);

    if (!interrupted) {
      // No active stream, but still return success
      // The stream may have already completed
    }

    // 3. Update message status if it exists
    await this.chatRepository.updateMessageStatus(
      input.message_id,
      MessageStatus.INTERRUPTED,
    );

    return {
      event: "chat.interrupted",
      conversation_id: input.conversation_id,
      message_id: input.message_id,
    };
  }
}
