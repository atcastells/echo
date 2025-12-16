import { Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { SignUpUseCase } from "../../../../application/auth/sign-up.use-case.js";
import { SignInUseCase } from "../../../../application/auth/sign-in.use-case.js";

interface AuthenticatedRequest extends Request {
  user?: unknown;
}

export class AuthController {

  private readonly signUpUseCase: SignUpUseCase = Container.get(SignUpUseCase);
  private readonly signInUseCase: SignInUseCase = Container.get(SignInUseCase);
  
  signup = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = request.body;
      const user = await this.signUpUseCase.execute(email, password);
      response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  signin = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = request.body;
      const result = await this.signInUseCase.execute(email, password);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      // User is attached by middleware
      const user = (request as AuthenticatedRequest).user;
      if (!user) {
        response.status(401).json({ message: "Unauthorized" });
        return;
      }
      response.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
