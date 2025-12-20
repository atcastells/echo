import { Service, Container } from "typedi";
import { UserGoal } from "../../domain/entities/user-goal.js";
import { GoalRepository } from "../../domain/ports/outbound/goal-repository.js";
import { GOAL_REPOSITORY } from "../../infrastructure/constants.js";

@Service()
export class GetUserGoalUseCase {
  private readonly goalRepository: GoalRepository =
    Container.get(GOAL_REPOSITORY);

  async execute(userId: string): Promise<UserGoal | null> {
    const goal = await this.goalRepository.findByUserId(userId);

    if (goal && goal.status === "active") {
      return goal;
    }

    return null;
  }
}
