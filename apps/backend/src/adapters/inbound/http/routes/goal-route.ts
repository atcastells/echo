import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { GoalsController } from "../controllers/goals-controller.js";

export const createGoalRouter = (): Router => {
  const router = Router();
  const goalsController = new GoalsController();

  router.use(authMiddleware.authenticate());

  router.post("/:userId/goal", goalsController.setGoal);

  router.get("/:userId/goal", goalsController.getGoal);
  return router;
};
