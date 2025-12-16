import { Conversation } from "../../entities/conversation.js";
import { ChatMessage } from "../../entities/chat-message.js";

/**
 * Repository port for chat/conversation persistence
 */
export interface ChatRepository {
  // Conversation operations
  createConversation(conversation: Conversation): Promise<Conversation>;
  getConversations(userId: string, agentId: string): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | null>;
  updateConversation(
    id: string,
    updates: Partial<
      Pick<Conversation, "title" | "contextPolicy" | "updatedAt">
    >,
  ): Promise<Conversation | null>;

  // Message operations
  saveMessage(message: ChatMessage): Promise<ChatMessage>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
  updateMessageStatus(
    messageId: string,
    status: ChatMessage["status"],
  ): Promise<void>;
}
