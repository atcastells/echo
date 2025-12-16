import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ChatWithAgentUseCase } from "../../../../application/agents/chat-with-agent.use-case.js";
import { CreateAgentUseCase } from "../../../../application/agents/create-agent.use-case.js";
import { ListAgentsUseCase } from "../../../../application/agents/list-agents.use-case.js";
import { GetAgentUseCase } from "../../../../application/agents/get-agent.use-case.js";
import { z } from "zod";
import { AgentType } from "../../../../domain/entities/agent.js";
import { AuthenticatedRequest } from "../middlewares/auth-middleware.js";
import { HttpError } from "../errors/http-error.js";

import { CreateConversationUseCase } from "../../../../application/chat/create-conversation.use-case.js";
import { ListConversationsUseCase } from "../../../../application/chat/list-conversations.use-case.js";
import { GetConversationHistoryUseCase } from "../../../../application/chat/get-conversation-history.use-case.js";

const createAgentSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(AgentType),
  instructions: z.string(),
  tone: z.string(),
  enableThreads: z.boolean().optional().default(false),
});

const chatSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
});

const createConversationSchema = z.object({
  title: z.string().optional(),
});

export class AgentController {
  private readonly createAgentUseCase: CreateAgentUseCase =
    Container.get(CreateAgentUseCase);
  private readonly listAgentsUseCase: ListAgentsUseCase =
    Container.get(ListAgentsUseCase);
  private readonly getAgentUseCase: GetAgentUseCase =
    Container.get(GetAgentUseCase);
  private readonly chatWithAgentUseCase: ChatWithAgentUseCase =
    Container.get(ChatWithAgentUseCase);
  private readonly createConversationUseCase: CreateConversationUseCase =
    Container.get(CreateConversationUseCase);
  private readonly listConversationsUseCase: ListConversationsUseCase =
    Container.get(ListConversationsUseCase);
  private readonly getConversationHistoryUseCase: GetConversationHistoryUseCase =
    Container.get(GetConversationHistoryUseCase);

  async createAgent(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const input = createAgentSchema.parse(request.body);
      // Map input to AgentConfiguration structure expected by use case
      const useCaseInput = {
        name: input.name,
        type: input.type,
        configuration: {
          systemPrompt: input.instructions,
          tone: input.tone,
          enableThreads: input.enableThreads,
        },
      };

      const agent = await this.createAgentUseCase.execute(
        authRequest.user.id,
        useCaseInput,
      );
      response.status(201).json(agent);
    } catch (error) {
      next(error);
    }
  }

  async listAgents(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const agents = await this.listAgentsUseCase.execute(authRequest.user.id);
      response.json(agents);
    } catch (error) {
      next(error);
    }
  }

  async getAgent(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const agentId = request.params.id;
      const agent = await this.getAgentUseCase.execute(agentId);

      if (!agent) {
        throw new HttpError(404, "Agent not found");
      }

      // Optional: Add authorization check here if relevant

      response.json(agent);
    } catch (error) {
      next(error);
    }
  }

  async chatWithAgent(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const agentId = request.params.id;
      const { message, conversationId } = chatSchema.parse(request.body);
      const reply = await this.chatWithAgentUseCase.execute({
        agentId,
        userId: authRequest.user.id,
        message,
        conversationId,
      });

      response.json({ message: reply });
    } catch (error) {
      next(error);
    }
  }

  async createConversation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }
      const agentId = request.params.id;
      const { title } = createConversationSchema.parse(request.body);
      const conversation = await this.createConversationUseCase.execute(
        authRequest.user.id,
        agentId,
        title,
      );
      response.status(201).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  async listConversations(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }
      const agentId = request.params.id;
      const conversations = await this.listConversationsUseCase.execute(
        authRequest.user.id,
        agentId,
      );
      response.json(conversations);
    } catch (error) {
      next(error);
    }
  }

  async getConversationHistory(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }
      const conversationId = request.params.conversationId;
      const history = await this.getConversationHistoryUseCase.execute(
        authRequest.user.id,
        conversationId,
      );
      response.json(history);
    } catch (error) {
      next(error);
    }
  }
}
