import { Router } from "express";
import { ChatController } from "../controllers/chat-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

export const createChatRouter = (): Router => {
  const router = Router();
  const controller = new ChatController();

  // All chat routes require authentication
  router.use(authMiddleware.authenticate());

  // Conversation management
  router.post("/conversations", (request, response, next) =>
    controller.createConversation(request, response, next),
  );
  router.get("/conversations", (request, response, next) =>
    controller.listConversations(request, response, next),
  );
  router.get("/conversations/:id/messages", (request, response, next) =>
    controller.getConversationHistory(request, response, next),
  );
  router.delete("/conversations/:id/messages", (request, response, next) =>
    controller.deleteHistory(request, response, next),
  );

  // Chat endpoints
  router.post("/chat", (request, response, next) =>
    controller.chat(request, response, next),
  );
  router.post("/chat/stream", (request, response, next) =>
    controller.streamChat(request, response, next),
  );
  router.post("/chat/control", (request, response, next) =>
    controller.control(request, response, next),
  );

  return router;
};
