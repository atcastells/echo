import { Service, Container, Inject } from "typedi";
import { UserGoal } from "../../../../domain/entities/user-goal.js";
import { GoalRepository } from "../../../../domain/ports/outbound/goal-repository.js";
import { MongoDBAdapter } from "./mongo-database-adapter.js";
import {
  GoalSchema,
  userGoalSchema,
} from "./schemas/goal.schema.js";

@Service()
export class MongoGoalRepository implements GoalRepository {
  constructor(
    @Inject("DatabaseConnection") private databaseConnection: MongoDBAdapter
  ) {}

  private get collection() {
    return this.databaseConnection.getDb().collection<GoalSchema>("goals");
  }

  async save(goal: UserGoal): Promise<UserGoal> {
    const { id, ...goalData } = goal;

    // Validate with Zod
    const validatedData = userGoalSchema.parse(goal);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mongoData: any = { ...validatedData };
    delete mongoData._id;

    await this.collection.updateOne(
        { userId: goal.userId },
        { $set: mongoData },
        { upsert: true }
    );
    
    return goal;
  }

  async findByUserId(userId: string): Promise<UserGoal | undefined> {
    const goal = await this.collection.findOne({ userId });

    if (!goal) return undefined;

    const { _id, ...rest } = goal;
    return rest as UserGoal;
  }
}
