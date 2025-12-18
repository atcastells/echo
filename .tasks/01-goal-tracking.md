# Goal Tracking Implementation

Build goal-aware agent behavior without over-engineering.

---

## Step 1 — Lock the Mental Model (No Code)

**Status:** 🔲 Not Started

**Goal = desired outcome + progressable dimensions**

Decide and document (1 page, max):

- A goal has:
  - One **objective**
  - A small set of **strategy axes** (3–5)
- Progress is **inferred**, never manually tracked
- One active goal per user

### Output

Create `docs/goals.md` with:

- Definition
- Non-goals (not a task manager, not habits)
- Example goal (job search)

**Do not write schemas yet.**

---

## Step 2 — Define the Minimal Domain Types

**Status:** 🔲 Not Started

Create **only what is required for v1 reasoning**.

### `UserGoal` (v1)

```ts
interface UserGoal {
  id: string
  userId: string
  objective: string
  status: "active" | "completed"
  startedAt: Date
}
```

### `GoalAxis` (hardcoded initially)

```ts
interface GoalAxis {
  id: string
  label: string
}
```

Start with **one goal type only** (job search).

Hardcode axes in code, not DB:

- `positioning`
- `readiness`
- `opportunity-flow`
- `performance`

This avoids premature generalization.

### Output

- `apps/backend/src/domain/entities/user-goal.ts`
- `apps/backend/src/domain/entities/goal-axis.ts`

---

## Step 3 — Persist Active Goal per User

**Status:** 🔲 Not Started

Implement:

- `POST /users/:id/goal` — Set active goal
- `GET /users/:id/goal` — Get active goal

Rules:

- Only one active goal
- New goal replaces old one
- No inference yet

This unlocks **end-to-end flow**.

### Output

- Use case: `apps/backend/src/application/goals/set-user-goal.use-case.ts`
- Use case: `apps/backend/src/application/goals/get-user-goal.use-case.ts`
- Controller routes

---

## Step 4 — Inject Goal into Every LLM Call ⭐

**Status:** 🔲 Not Started

This is the **highest leverage step**.

Add a mandatory preamble to system prompt:

```text
USER CURRENT GOAL
Objective: Secure a frontend role aligned with React
```

If none exists:

```text
USER CURRENT GOAL
None set. If appropriate, help clarify one.
```

Do this **before** adding chat history or RAG.

### Output

- Modify LangChain adapter to inject goal context
- `apps/backend/src/infrastructure/langchain/`

**You now have a goal-aware agent immediately.**

---

## Step 5 — Add Axis Awareness (Static)

**Status:** 🔲 Not Started

Without scoring yet, inject axes into system prompt:

```text
STRATEGY AXES
- Positioning
- Market Readiness
- Opportunity Flow
- Performance

Instruction:
Frame advice in terms of these axes when relevant.
```

The agent can now:

- Structure answers
- Reference progress conceptually
- Explain *why* advice matters

**Still zero inference logic.**

---

## Step 6 — Capture Evidence (Silent)

**Status:** 🔲 Not Started

Start collecting **signals**, but do nothing with them yet.

Examples:

- CV uploaded → `evidence: positioning`
- Mock interview → `evidence: performance`
- Applying to roles → `evidence: opportunity-flow`

Store as append-only:

```ts
interface GoalEvidence {
  id: string
  userId: string
  axisId: string
  source: "conversation" | "document"
  timestamp: Date
}
```

**No scoring. No UI. No decisions. Just collect.**

### Output

- `apps/backend/src/domain/entities/goal-evidence.ts`
- Evidence recording in relevant use cases

---

## Step 7 — Add Naive Progress Estimation

**Status:** 🔲 Not Started

Add the **first measurable behavior**.

For each axis:

```
progress = min(1, evidenceCount × weight)
```

Example:

- 5 positioning signals → 0.8
- 1 opportunity-flow signal → 0.2

This can be embarrassingly simple.

**Expose internally only.**

### Output

- `apps/backend/src/domain/services/goal-progress.service.ts`

---

## Step 8 — Use Progress to Drive Responses

**Status:** 🔲 Not Started

Modify the LLM injection:

```text
GOAL PROGRESS (ESTIMATED)
- Positioning: high
- Opportunity Flow: low

Instruction:
Prioritize advice that increases low-progress axes.
Avoid repeating high-progress advice.
```

**This is the moment the feature becomes real.**

---

## Step 9 — Let the Agent Declare Near-Completion

**Status:** 🔲 Not Started

Add one rule:

If all axes ≥ threshold (e.g. 0.75), the agent may say:

> "You're close to completing this goal. The remaining risk is X."

**Do not auto-complete. User must confirm.**

---

## Step 10 — Stop

**Status:** 🔲 Not Started

Do **not** build:

- ❌ Dashboards
- ❌ Editable progress
- ❌ Multiple simultaneous goals
- ❌ Generic goal builders

Those are v2 problems.

---

## Why This Order Works

| Step | What Exists | Agent Capability |
|------|-------------|------------------|
| 1-3 | Goal persisted | Knows user intent |
| 4 | Goal in prompt | Contextual responses |
| 5 | Axes in prompt | Structured reasoning |
| 6 | Evidence logged | Future progress data |
| 7 | Progress calculated | Measurable state |
| 8 | Progress in prompt | Strategic guidance |
| 9 | Completion rule | Goal lifecycle |

**Ship after Step 4 and already win.**
