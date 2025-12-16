import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  signupSchema,
  signinSchema,
} from "../middlewares/validation-schemas.js";

export const createAuthRouter = (): Router => {
  const router: Router = Router();
  const authController = new AuthController();

  router.post("/signup", validateRequest(signupSchema), authController.signup);
  router.post("/signin", validateRequest(signinSchema), authController.signin);
  router.get("/me", authMiddleware.authenticate(), authController.me);

  return router;
};
