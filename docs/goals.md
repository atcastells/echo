# Goal Tracking Mental Model

## Definition

A **Goal** is a specific **desired outcome** that a user is working towards. It is the north star for the agent's reasoning.

Progress toward a goal is tracked along a small set of **Strategy Axes**. These axes represent broad paths of advancement, not specific tasks.

## Non-Goals

- **Not a Task Manager:** This system does not track individual to-do items or deadlines.
- **Not Habit Tracking:** We are not tracking daily repetitions or streaks.
- **Not Permanent Traits:** Goals are transient; they have a start and (ideally) a completion.

## Mental Model Invariants

- **One Goal Per User:** A user can only have one active goal at a time to maintain agent focus.
- **Progress is Inferred:** The user does not manually update progress sliders. The agent infers status based on evidence.

## Example: Job Search

**Objective:** Secure a Senior Frontend Engineer role.

**Strategy Axes:**

1.  **Positioning:** How well the user defines and presents their value (CV, LinkedIn).
2.  **Readiness:** Technical and behavioral interview preparation.
3.  **Opportunity Flow:** Volume and quality of applications and leads.
4.  **Performance:** Actual results in screenings and interviews.
