import { z } from "zod";
import { ObjectId } from "mongodb";

export const userGoalSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  id: z.string(),
  userId: z.string(),
  objective: z.string(),
  status: z.enum(["active", "completed"]),
  startedAt: z.date(),
});

export type GoalSchema = z.infer<typeof userGoalSchema>;
