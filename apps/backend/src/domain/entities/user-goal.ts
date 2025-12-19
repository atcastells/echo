export interface UserGoal {
  id: string;
  userId: string;
  objective: string;
  /**
   * Current status of the goal.
   * Note: At this stage (v1), 'completed' is descriptive only and does not imply automated completion logic.
   */
  status: 'active' | 'completed';
  startedAt: Date;
}
