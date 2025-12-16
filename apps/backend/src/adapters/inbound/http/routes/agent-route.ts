import { Router } from "express";
import { AgentController } from "../controllers/agent-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

export const createAgentRouter = (): Router => {
  const agentRoutes: Router = Router();
  const agentController = new AgentController();
  // All agent management routes require authentication
  agentRoutes.use(authMiddleware.authenticate());

  agentRoutes.post("/", (request, response, next) =>
    agentController.createAgent(request, response, next),
  );
  agentRoutes.get("/", (request, response, next) =>
    agentController.listAgents(request, response, next),
  );
  agentRoutes.get("/:id", (request, response, next) =>
    agentController.getAgent(request, response, next),
  );
  agentRoutes.post("/:id/chat", (request, response, next) =>
    agentController.chatWithAgent(request, response, next),
  );
  agentRoutes.post("/:id/conversations", (request, response, next) =>
    agentController.createConversation(request, response, next),
  );
  agentRoutes.get("/:id/conversations", (request, response, next) =>
    agentController.listConversations(request, response, next),
  );
  agentRoutes.get(
    "/:id/conversations/:conversationId",
    (request, response, next) =>
      agentController.getConversationHistory(request, response, next),
  );

  return agentRoutes;
};
