import { Service, Inject } from "typedi";
import { UserGoal } from "../../domain/entities/user-goal.js";
import { GoalRepository } from "../../domain/ports/outbound/goal-repository.js";
import { GOAL_REPOSITORY } from "../../infrastructure/constants.js";

@Service()
export class GetUserGoalUseCase {
  constructor(
    @Inject(GOAL_REPOSITORY) private goalRepository: GoalRepository,
  ) {}

  async execute(userId: string): Promise<UserGoal | null> {
    const goal = await this.goalRepository.findByUserId(userId);

    if (goal && goal.status === "active") {
      return goal;
    }

    return null;
  }
}
