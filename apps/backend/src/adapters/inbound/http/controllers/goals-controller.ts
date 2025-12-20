import { Container } from "typedi";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth-middleware.js";
import { HttpError } from "../errors/http-error.js";
import { SetUserGoalUseCase } from "../../../../application/goals/set-user-goal.use-case.js";
import { GetUserGoalUseCase } from "../../../../application/goals/get-user-goal.use-case.js";
import { z } from "zod";

const setGoalSchema = z.object({
  objective: z.string().min(1),
});

export class GoalsController {
  private readonly setUserGoalUseCase: SetUserGoalUseCase =
    Container.get(SetUserGoalUseCase);
  private readonly getUserGoalUseCase: GetUserGoalUseCase =
    Container.get(GetUserGoalUseCase);

  async setGoal(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const input = setGoalSchema.parse(request.body);
      const goal = await this.setUserGoalUseCase.execute(
        authRequest.user.id,
        input.objective,
      );

      response.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  }

  async getGoal(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authRequest = request as AuthenticatedRequest;
      if (!authRequest.user) {
        throw new HttpError(401, "Unauthorized");
      }

      const goal = await this.getUserGoalUseCase.execute(authRequest.user.id);

      if (!goal) {
        response.status(404).json({ message: "No active goal found" });
        return;
      }

      response.json(goal);
    } catch (error) {
      next(error);
    }
  }
}
