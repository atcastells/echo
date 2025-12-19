import { Service, Inject } from "typedi";
import { UserGoal } from "../../domain/entities/user-goal.js";
import { GoalRepository } from "../../domain/ports/outbound/goal-repository.js";
import { GOAL_REPOSITORY } from "../../infrastructure/constants.js";
import { v4 as uuidv4 } from "uuid";

@Service()
export class SetUserGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY) private goalRepository: GoalRepository,
  ) {}

  async execute(userId: string, objective: string): Promise<UserGoal> {
    const newGoal: UserGoal = {
      id: uuidv4(),
      userId,
      objective,
      status: "active",
      startedAt: new Date(),
    };

    await this.goalRepository.save(newGoal);
    return newGoal;
  }
}
