import { UserGoal } from "../../entities/user-goal.js";

export interface GoalRepository {
  save(goal: UserGoal): Promise<UserGoal>;
  findByUserId(userId: string): Promise<UserGoal | undefined>;
}
