import "reflect-metadata";
import { MongoChatRepository } from "./mongo-chat-repository";
import { ChatRole, MessageStatus } from "../../../../domain/entities/chat-message";
import { ObjectId } from "mongodb";
import { Container } from "typedi";
import { MongoDBAdapter } from "./mongo-database-adapter";

// Mock MongoDBAdapter
const mockCollection = {
  insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    }),
  }),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  updateOne: jest.fn(),
  deleteMany: jest.fn(),
};

const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

const mockMongoDBAdapter = {
  getDb: jest.fn().mockReturnValue(mockDb),
};

describe("MongoChatRepository", () => {
  let repository: MongoChatRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    Container.set(MongoDBAdapter, mockMongoDBAdapter);
    repository = new MongoChatRepository();
  });

  describe("saveMessage", () => {
    it("should use provided ID as _id if it is a valid ObjectId", async () => {
      const validId = new ObjectId().toString();
      const message = {
        id: validId,
        conversationId: new ObjectId().toString(),
        role: ChatRole.USER,
        content: [{ type: "text" as const, value: "hello" }],
        status: MessageStatus.COMPLETE,
        createdAt: new Date(),
      };

      await repository.saveMessage(message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: new ObjectId(validId),
        })
      );
    });

    it("should use provided string ID as _id even if not a valid ObjectId", async () => {
      const stringId = "temp-12345";
      const message = {
        id: stringId,
        conversationId: new ObjectId().toString(),
        role: ChatRole.USER,
        content: [{ type: "text" as const, value: "hello" }],
        status: MessageStatus.COMPLETE,
        createdAt: new Date(),
      };

      await repository.saveMessage(message);

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: stringId,
        })
      );
    });

    it("should generate a new ObjectId if no ID is provided", async () => {
      const message = {
        id: "",
        conversationId: new ObjectId().toString(),
        role: ChatRole.USER,
        content: [{ type: "text" as const, value: "hello" }],
        status: MessageStatus.COMPLETE,
        createdAt: new Date(),
      };

      await repository.saveMessage(message);

      const capturedDoc = mockCollection.insertOne.mock.calls[0][0];
      expect(capturedDoc._id).toBeInstanceOf(ObjectId);
    });
  });
});
