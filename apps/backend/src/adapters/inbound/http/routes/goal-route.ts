import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { GoalsController } from "../controllers/goals-controller.js";

export const createGoalRouter = (): Router => {
  const router = Router();
  const goalsController = new GoalsController();

  router.use(authMiddleware.authenticate());

  router.post("/:userId/goal", (req, res, next) =>
    goalsController.setGoal(req, res, next)
  );

  router.get("/:userId/goal", (req, res, next) =>
    goalsController.getGoal(req, res, next)
  );

  return router;
};
