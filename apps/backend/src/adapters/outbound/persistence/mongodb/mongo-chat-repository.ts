import { Service, Container } from "typedi";
import { MongoDBAdapter } from "./mongo-database-adapter.js";
import { ChatRepository } from "../../../../domain/ports/outbound/chat-repository.js";
import { Conversation } from "../../../../domain/entities/conversation.js";
import { ChatMessage } from "../../../../domain/entities/chat-message.js";
import {
  ConversationSchema,
  ChatMessageSchema,
  conversationSchema,
  chatMessageSchema,
} from "./schemas/chat.schema.js";
import { ObjectId, WithId, Filter } from "mongodb";

@Service()
export class MongoChatRepository implements ChatRepository {
  private readonly databaseConnection: MongoDBAdapter =
    Container.get(MongoDBAdapter);

  private get conversationCollection() {
    return this.databaseConnection
      .getDb()
      .collection<ConversationSchema>("conversations");
  }

  private get messageCollection() {
    return this.databaseConnection
      .getDb()
      .collection<ChatMessageSchema>("chat_messages");
  }

  // ===========================================================================
  // Conversation Operations
  // ===========================================================================

  async createConversation(conversation: Conversation): Promise<Conversation> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...conversationData } = conversation;

    // Validate with Zod
    const validatedData = conversationSchema.parse(conversationData);

    const result = await this.conversationCollection.insertOne(validatedData);

    return {
      ...validatedData,
      id: result.insertedId.toString(),
    };
  }

  async getConversations(
    userId: string,
    agentId: string,
  ): Promise<Conversation[]> {
    const conversations = await this.conversationCollection
      .find({ userId, agentId })
      // eslint-disable-next-line unicorn/no-array-sort
      .sort({ updatedAt: -1 })
      .toArray();
    return conversations.map((conversation) =>
      this.mapConversation(conversation),
    );
  }

  async getConversationById(id: string): Promise<Conversation | null> {
    // eslint-disable-next-line unicorn/no-null
    if (!ObjectId.isValid(id)) return null;

    const conversation = await this.conversationCollection.findOne({
      _id: new ObjectId(id),
    } as Filter<ConversationSchema>);

    // eslint-disable-next-line unicorn/no-null
    if (!conversation) return null;

    return this.mapConversation(conversation);
  }

  async updateConversation(
    id: string,
    updates: Partial<
      Pick<Conversation, "title" | "contextPolicy" | "updatedAt">
    >,
  ): Promise<Conversation | null> {
    // eslint-disable-next-line unicorn/no-null
    if (!ObjectId.isValid(id)) return null;

    const result = await this.conversationCollection.findOneAndUpdate(
      { _id: new ObjectId(id) } as Filter<ConversationSchema>,
      { $set: { ...updates, updatedAt: updates.updatedAt ?? new Date() } },
      { returnDocument: "after" },
    );

    // eslint-disable-next-line unicorn/no-null
    if (!result) return null;

    return this.mapConversation(result);
  }

  // ===========================================================================
  // Message Operations
  // ===========================================================================

  async saveMessage(message: ChatMessage): Promise<ChatMessage> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...messageData } = message;

    // Validate with Zod
    const validatedData = chatMessageSchema.parse(messageData);

    const result = await this.messageCollection.insertOne(validatedData);

    // Update conversation updatedAt
    if (ObjectId.isValid(message.conversationId)) {
      await this.conversationCollection.updateOne(
        {
          _id: new ObjectId(message.conversationId),
        } as Filter<ConversationSchema>,
        { $set: { updatedAt: new Date() } },
      );
    }

    return {
      ...validatedData,
      id: result.insertedId.toString(),
    };
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const messages = await this.messageCollection
      .find({ conversationId })
      // eslint-disable-next-line unicorn/no-array-sort
      .sort({ createdAt: 1 }) // Oldest first for chat context
      .toArray();
    return messages.map((message) => this.mapMessage(message));
  }

  async updateMessageStatus(
    messageId: string,
    status: ChatMessage["status"],
  ): Promise<void> {
    if (!ObjectId.isValid(messageId)) return;

    await this.messageCollection.updateOne(
      { _id: new ObjectId(messageId) } as Filter<ChatMessageSchema>,
      { $set: { status } },
    );
  }

  async deleteMessages(conversationId: string): Promise<void> {
    if (!ObjectId.isValid(conversationId)) return;
    await this.messageCollection.deleteMany({ conversationId });
  }

  // ===========================================================================
  // Mappers
  // ===========================================================================

  private mapConversation(
    conversation: WithId<ConversationSchema>,
  ): Conversation {
    const { _id, ...rest } = conversation;
    return {
      id: _id.toString(),
      ...rest,
    };
  }

  private mapMessage(message: WithId<ChatMessageSchema>): ChatMessage {
    const { _id, ...rest } = message;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
