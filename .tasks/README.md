# Echo Task Board

## Current Focus: Goal-Aware Agent

The next major feature is **goal tracking** — enabling the agent to understand and reason about the user's current professional objective.

### Why Goals First?

1. **Goal exists** → agent knows intent
2. **Axes exist** → agent reasons structurally  
3. **Evidence exists** → progress can emerge
4. **Progress exists** → guidance becomes strategic

Each step is independently useful. We can ship after Step 4 and already win.

## Implementation Plan

See [01-goal-tracking.md](01-goal-tracking.md) for the full 10-step plan.

| Step | Description | Status |
|------|-------------|--------|
| 1 | Lock the mental model (docs/goals.md) | 🔲 |
| 2 | Define minimal domain types | 🔲 |
| 3 | Persist active goal per user | 🔲 |
| 4 | Inject goal into every LLM call | 🔲 |
| 5 | Add axis awareness (static) | 🔲 |
| 6 | Capture evidence (silent) | 🔲 |
| 7 | Add naive progress estimation | 🔲 |
| 8 | Use progress to drive responses | 🔲 |
| 9 | Let agent declare near-completion | 🔲 |
| 10 | Stop (no dashboards, no v2 features) | 🔲 |

## Status Legend

- ✅ Done
- 🚧 In Progress
- 🔲 Not Started
