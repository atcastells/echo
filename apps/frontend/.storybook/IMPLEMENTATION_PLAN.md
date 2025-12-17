# Conversational Agent UI — Implementation Plan

> **Atomic Design Implementation for Storybook Component Library**

---

## Overview

This plan follows **Atomic Design** methodology to build a complete conversational AI interface component library.

| Level         | Description                                  | Examples                        |
| ------------- | -------------------------------------------- | ------------------------------- |
| **Atoms**     | Basic building blocks, single responsibility | Button, Input, Avatar, Icon     |
| **Molecules** | Groups of atoms working together             | MessageBubble, AgentIdentity    |
| **Organisms** | Complex UI sections with business logic      | Composer, MessageItem, Sidebar  |
| **Templates** | Page layouts without real data               | MainPanel, ConversationViewport |
| **Pages**     | Final assembled views with data              | ConversationApp                 |

---

## Phase 1: Foundation

**Goal**: Set up project structure and design system foundation.

### Task 1.1: Atomic Design Folder Structure ✅

- [x] Create `src/shared/ui/atoms/` directory
- [x] Create `src/shared/ui/molecules/` directory
- [x] Create `src/shared/ui/organisms/` directory
- [x] Create `src/shared/ui/templates/` directory
- [x] Create `src/shared/ui/pages/` directory
- [x] Create barrel exports (`index.ts`) for each level
- [x] Remove placeholder story file

### Task 1.2: Design Tokens Documentation ✅

- [x] Document color tokens (primary, neutral, semantic)
- [x] Document typography scale (font sizes, weights, line heights)
- [x] Document spacing scale (padding, margins, gaps)
- [x] Document border radius tokens
- [x] Document shadow tokens
- [x] Document animation/motion tokens
- [x] Create Storybook docs page for design tokens

### Task 1.3: Storybook Configuration ✅

- [x] Configure story hierarchy (Atoms/Molecules/Organisms/Templates/Pages)
- [x] Set up dark mode toggle in Storybook (via backgrounds preset)
- [x] Configure viewport presets (mobile, tablet, desktop) - using default
- [x] Add accessibility addon configuration (@storybook/addon-a11y)

---

## Phase 2: Atoms ✅

**Goal**: Build foundational UI primitives with all required states.

> **State Checklist** (every atom must implement):
>
> - Default, Hover, Focus, Active, Disabled, Loading, Error

### Task 2.1: Button ✅

- [x] Create `Button` component
- [x] Implement variants: Primary, Secondary, Ghost, Destructive
- [x] Implement sizes: sm, md, lg
- [x] Implement states: default, hover, focus, active, disabled, loading
- [x] Add icon support (leading/trailing)
- [x] Write stories for all variants and states
- [x] Add accessibility (focus ring, aria-labels)

### Task 2.2: TextInput ✅

- [x] Create `TextInput` component
- [x] Implement single-line and multiline variants
- [x] Implement states: default, hover, focus, disabled, error
- [x] Add placeholder support
- [x] Add character count option
- [x] Add clear button option
- [x] Write stories for all variants and states

### Task 2.3: Avatar ✅

- [x] Create `Avatar` component
- [x] Implement sizes: xs, sm, md, lg, xl
- [x] Support image, initials, and fallback icon
- [x] Add status indicator (online, offline, busy)
- [x] Add border/ring variants
- [x] Write stories for all variants

### Task 2.4: Icon ✅

- [x] Create `Icon` component wrapper
- [x] Define icon set (Heroicons-style paths)
- [x] Implement sizes: sm, md, lg, xl
- [x] Support color inheritance
- [x] Write stories with icon gallery

### Task 2.5: Badge ✅

- [x] Create `Badge` component
- [x] Implement variants: default, success, warning, error, info
- [x] Implement sizes: sm, md
- [x] Add dot variant for notifications
- [x] Write stories for all variants

### Task 2.6: Spinner/Loading ✅

- [x] Create `Spinner` component
- [x] Implement sizes: sm, md, lg
- [x] Add color variants
- [x] Create `Skeleton` loading component
- [x] Write stories for loading states

### Task 2.7: Tooltip ✅

- [x] Create `Tooltip` component
- [x] Implement positions: top, right, bottom, left
- [x] Add delay configuration
- [x] Support rich content
- [x] Write stories for all positions

### Task 2.8: Toast ✅

- [x] Create `Toast` component
- [x] Implement variants: info, success, warning, error
- [x] Add dismiss functionality
- [x] Add action button support
- [x] Create `ToastProvider` context
- [x] Write stories for all variants

---

## Phase 3: Molecules ✅

**Goal**: Compose atoms into functional component groups.

### Task 3.1: MessageBubble ✅

- [x] Create `MessageBubble` component
- [x] Implement variants: user, agent, system
- [x] Support plain text rendering
- [x] Support Markdown rendering
- [x] Support code blocks with syntax highlighting
- [x] Add expand/collapse for long content
- [x] Add citation/reference support
- [x] Write stories for all content types

### Task 3.2: MessageMeta ✅

- [x] Create `MessageMeta` component
- [x] Display timestamp (relative/absolute)
- [x] Display status: sending, sent, failed, streaming
- [x] Add optional cost/latency display
- [x] Write stories for all states

### Task 3.3: MessageActions ✅

- [x] Create `MessageActions` component
- [x] Add Copy action
- [x] Add Regenerate action
- [x] Add Edit action (user messages)
- [x] Add Feedback (👍/👎) actions
- [x] Add Report action
- [x] Implement hover reveal behavior
- [x] Write stories for user vs agent actions

### Task 3.4: AgentIdentity ✅

- [x] Create `AgentIdentity` component
- [x] Compose Avatar + Name + Role
- [x] Add status indicator (available, busy, restricted)
- [x] Add clickable variant for agent info
- [x] Write stories for all states

### Task 3.5: StreamingIndicator ✅

- [x] Create `StreamingIndicator` component
- [x] Implement typing animation (dots)
- [x] Add partial content state
- [x] Add interrupt/stop affordance
- [x] Write stories for streaming states

### Task 3.6: ThinkingIndicator ✅

- [x] Create `ThinkingIndicator` component
- [x] Show "reasoning" state distinct from streaming
- [x] Add tool usage indication
- [x] Write stories

### Task 3.7: AttachmentPreview ✅

- [x] Create `AttachmentPreview` component
- [x] Show file type icon
- [x] Display file name and size
- [x] Add remove action
- [x] Show upload progress state
- [x] Write stories for file types and states

### Task 3.8: ContextIndicator ✅

- [x] Create `ContextIndicator` component
- [x] Show memory on/off state
- [x] Display context usage level (progress)
- [x] Add privacy tooltip
- [x] Add context reset trigger
- [x] Write stories

### Task 3.9: ConversationListItem ✅

- [x] Create `ConversationListItem` component
- [x] Display conversation title
- [x] Show last message preview
- [x] Show timestamp
- [x] Implement active/selected state
- [x] Add delete action
- [x] Write stories for all states

---

## Phase 4: Organisms ✅

**Goal**: Build complex, self-contained UI sections.

### Task 4.1: MessageItem ✅

- [x] Create `MessageItem` component
- [x] Compose MessageBubble + MessageMeta + MessageActions
- [x] Implement user variant layout
- [x] Implement agent variant layout
- [x] Implement system variant layout
- [x] Handle streaming state
- [x] Handle error state with retry
- [x] Write stories for all variants and states

### Task 4.2: MessageList ✅

- [x] Create `MessageList` component
- [x] Render ordered messages
- [x] Handle message grouping (consecutive same sender)
- [x] Support streaming message insertion
- [x] Add date separators
- [x] Write stories with various message combinations

### Task 4.3: Composer ✅

- [x] Create `Composer` component
- [x] Integrate TextInput (multiline)
- [x] Add SendButton with loading state
- [x] Add AttachmentInput trigger
- [x] Add AttachmentPreview list
- [x] Add VoiceInput trigger (optional)
- [x] Implement keyboard shortcuts (Cmd+Enter)
- [x] Add character limit indicator
- [x] Handle disabled state (while streaming)
- [x] Write stories for all states

### Task 4.4: ComposerToolbar ✅

- [x] Create `ComposerToolbar` component
- [x] Add persona/mode selector
- [x] Add context scope selector
- [x] Show keyboard shortcut hints
- [x] Write stories

### Task 4.5: ConversationHeader ✅

- [x] Create `ConversationHeader` component
- [x] Integrate AgentIdentity
- [x] Integrate ContextIndicator
- [x] Add ConversationActions (share, export, clear, rename)
- [x] Write stories

### Task 4.6: Sidebar ✅

- [x] Create `Sidebar` component
- [x] Add search input
- [x] Add NewConversationButton
- [x] Integrate ConversationList
- [x] Handle collapsed/expanded states
- [x] Write stories for states

### Task 4.7: ConversationList ✅

- [x] Create `ConversationList` component
- [x] Render ConversationListItem components
- [x] Handle empty state
- [x] Handle loading state
- [x] Support keyboard navigation
- [x] Write stories

### Task 4.8: AgentPrompt ✅

- [x] Create `AgentPrompt` component
- [x] Implement variants: clarifying question, suggestion, confirmation, warning
- [x] Add PromptContent area
- [x] Add PromptActions (accept, reject, modify)
- [x] Visually distinguish from regular messages
- [x] Write stories for all variants

### Task 4.9: ActionSurface ✅

- [x] Create `ActionSurface` component
- [x] Render actionable UI from agent
- [x] Add ActionButton, ActionConfirm, ActionCancel
- [x] Add ActionUndo, ActionRetry
- [x] Implement confirmation flows
- [x] Track action state (pending, executing, done, failed)
- [x] Write stories

### Task 4.10: ErrorState ✅

- [x] Create `ErrorState` component
- [x] Implement variants: inline, global, permission denied, tool failure
- [x] Show error explanation
- [x] Provide recovery actions
- [x] Write stories for all variants

### Task 4.11: FeedbackControls ✅

- [x] Create `FeedbackControls` component
- [x] Add thumbs up/down buttons
- [x] Add freeform feedback input
- [x] Add regenerate action
- [x] Write stories

### Task 4.12: TransparencyPanel ✅

- [x] Create `TransparencyPanel` component
- [x] Show "why this response" explanation
- [x] Display context used
- [x] List tools invoked
- [x] Show memory impact
- [x] Write stories

### Task 4.13: Modal ✅

- [x] Create `Modal` component
- [x] Add header, body, footer sections
- [x] Implement close behavior (X, escape, backdrop)
- [x] Add focus trap
- [x] Create confirmation modal variant
- [x] Write stories

---

## Phase 5: Templates ✅

**Goal**: Create page-level layouts without data.

### Task 5.1: ConversationViewport ✅

- [x] Create `ConversationViewport` component
- [x] Implement scroll container
- [x] Add auto-scroll to bottom behavior
- [x] Add scroll-to-message functionality
- [x] Add "new messages" indicator
- [x] Handle ConversationEmptyState
- [x] Write stories with mock content

### Task 5.2: ConversationEmptyState ✅

- [x] Create `ConversationEmptyState` component
- [x] Show welcome message
- [x] Display suggested prompts
- [x] Write stories

### Task 5.3: FirstRunExperience ✅

- [x] Create `FirstRunExperience` component
- [x] Explain product capabilities
- [x] Show example prompts
- [x] Add quick-start actions
- [x] Write stories

### Task 5.4: MainPanel ✅

- [x] Create `MainPanel` component
- [x] Layout: ConversationHeader + ConversationViewport + Composer
- [x] Handle safe areas (mobile)
- [x] Handle resize behavior
- [x] Write stories

---

## Phase 6: Pages ✅

**Goal**: Assemble final views with state management.

### Task 6.1: ConversationApp ✅

- [x] Create `ConversationApp` shell component
- [x] Integrate Sidebar + MainPanel
- [x] Set up theme provider
- [x] Set up toast provider
- [x] Handle responsive layout (mobile: drawer sidebar)
- [x] Write stories showing full app

### Task 6.2: Global States ✅

- [x] Implement offline state handling
- [x] Implement rate limit state handling
- [x] Add global error boundary
- [x] Write stories for global states

---

## Phase 7: Integration & Polish ✅

**Goal**: Final integration, testing, and documentation.

### Task 7.1: Accessibility Audit ✅

- [x] Run axe accessibility checks on all components
- [x] Fix any accessibility violations
- [x] Test keyboard navigation flow
- [x] Test screen reader experience

### Task 7.2: Dark Mode ✅

- [x] Verify all components in dark mode
- [x] Fix any contrast issues
- [x] Test theme switching

### Task 7.3: Responsive Testing ✅

- [x] Test all components at mobile breakpoint
- [x] Test all components at tablet breakpoint
- [x] Fix any responsive issues

### Task 7.4: Documentation ✅

- [x] Complete component documentation
- [x] Add usage guidelines
- [x] Document component API (props)
- [x] Add do's and don'ts

### Task 7.5: Performance ✅

- [x] Profile component render performance
- [x] Optimize heavy components (MessageList virtualization)
- [x] Lazy load where appropriate

---

## Component Checklist Template

Use this for each component:

```markdown
### [Component Name]

**Atoms Used**: (list atom dependencies)
**Molecules Used**: (list molecule dependencies)

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| ...  | ...  | ...     | ...         |

#### States

- [ ] Default
- [ ] Hover
- [ ] Focus
- [ ] Active
- [ ] Disabled
- [ ] Loading
- [ ] Error

#### Accessibility

- [ ] Keyboard navigable
- [ ] Screen reader labels
- [ ] Focus visible
- [ ] Color contrast

#### Stories

- [ ] Default
- [ ] All variants
- [ ] All states
- [ ] Edge cases
```

---

## Progress Tracking

| Phase               | Status       | Progress    |
| ------------------- | ------------ | ----------- |
| Phase 1: Foundation | ✅ Completed | 3/3 tasks   |
| Phase 2: Atoms      | ✅ Completed | 8/8 tasks   |
| Phase 3: Molecules  | ✅ Completed | 9/9 tasks   |
| Phase 4: Organisms  | ✅ Completed | 13/13 tasks |
| Phase 5: Templates  | ✅ Completed | 4/4 tasks   |
| Phase 6: Pages      | ✅ Completed | 2/2 tasks   |
| Phase 7: Polish     | ✅ Completed | 5/5 tasks   |

**Total: 44/44 tasks completed (100%) 🎉**

---

## Quick Reference

### File Naming Convention

```
ComponentName/
├── ComponentName.tsx        # Component implementation
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.test.tsx   # Unit tests (optional)
├── ComponentName.types.ts   # TypeScript types
└── index.ts                 # Barrel export
```

### Story Naming Convention

```typescript
export default {
  title: "Atoms/Button", // Level/ComponentName
  component: Button,
} satisfies Meta<typeof Button>;
```

### Import Paths

```typescript
// From within shared/ui
import { Button } from "@/shared/ui/atoms";
import { MessageBubble } from "@/shared/ui/molecules";
import { Composer } from "@/shared/ui/organisms";
```

---

# State Machines Implementation Plan

## Goal

Introduce **explicit, documented state machines** for critical organisms to:

- Make conversational behavior predictable
- Prevent invalid UI states
- Decouple async logic from rendering
- Improve Storybook coverage and testability

---

## Phase 1: Decide the State Machine Strategy

### Task 1.1: Choose Representation (Do this first)

You have three viable options:

| Option                        | When to use                  | Recommendation     |
| ----------------------------- | ---------------------------- | ------------------ |
| **Explicit enums + reducers** | Simple, local state          | ❌ (too weak)      |
| **XState**                    | Complex async, visualization | ✅ **Recommended** |
| **Zustand + state enums**     | Lightweight, global          | ⚠️ acceptable      |

**Decision**:
✔ Use **XState** for organisms
✔ Keep atoms/molecules stateless

---

### Task 1.2: Define the Scope

State machines are **only allowed** in:

- Organisms
- Pages

Explicitly **forbidden** in:

- Atoms
- Molecules

Add this rule to CONTRIBUTING.md.

---

## Phase 2: Define the Canonical State Model

Create a shared folder:

```
src/shared/state-machines/
```

### Task 2.1: Define Common State Concepts

Create `common.types.ts`:

```ts
export type AsyncState = "idle" | "loading" | "success" | "error";

export type StreamingState = "idle" | "thinking" | "streaming" | "interrupted";
```

These types ensure **state language consistency** across machines.

---

## Phase 3: Implement Machines Incrementally (Critical Path)

### Priority Order (Do NOT do all at once)

1. Composer
2. MessageItem
3. ActionSurface
4. AgentPrompt
5. MessageList
6. ConversationApp

---

## Phase 4: Composer State Machine (First Implementation)

### Task 4.1: Define States

```
idle
 ├─ typing
 ├─ submitting
 │   ├─ success → idle
 │   └─ error
 ├─ disabled (agent streaming)
 └─ blocked (rate limited)
```

---

### Task 4.2: Create Machine File

```
src/shared/state-machines/composer.machine.ts
```

```ts
import { createMachine } from "xstate";

export const composerMachine = createMachine({
  id: "composer",
  initial: "idle",
  states: {
    idle: {
      on: {
        TYPE: "typing",
        DISABLE: "disabled",
        BLOCK: "blocked",
      },
    },
    typing: {
      on: {
        SUBMIT: "submitting",
        CLEAR: "idle",
      },
    },
    submitting: {
      on: {
        SUCCESS: "idle",
        ERROR: "error",
      },
    },
    error: {
      on: {
        RETRY: "submitting",
        TYPE: "typing",
      },
    },
    disabled: {
      on: {
        ENABLE: "idle",
      },
    },
    blocked: {
      on: {
        UNBLOCK: "idle",
      },
    },
  },
});
```

---

### Task 4.3: Wire Machine into Composer

Inside `Composer.tsx`:

```ts
import { useMachine } from "@xstate/react";
import { composerMachine } from "@/shared/state-machines/composer.machine";

const [state, send] = useMachine(composerMachine);

const isDisabled = state.matches("disabled") || state.matches("blocked");
```

**Rule**

- Component never sets booleans directly
- Only `send(EVENT)` is allowed

---

## Phase 5: Storybook State Machine Stories

### Task 5.1: Machine-Driven Stories

Create stories that **force machine states**:

```ts
export const Submitting = {
  render: () => (
    <Composer initialState="submitting" />
  ),
};
```

Or using XState testing helpers:

```ts
composerMachine.withState("error");
```

Checklist:

- [ ] One story per state
- [ ] No mocked booleans
- [ ] Machine controls rendering

---

## Phase 6: MessageItem Machine

### States

```
idle
 ├─ streaming
 ├─ failed
 ├─ regenerating
 └─ interrupted
```

### Events

- STREAM_START
- STREAM_END
- FAIL
- RETRY
- INTERRUPT

**Rule**

- Streaming UI must never depend on props like `isStreaming`
- It must depend on `state.matches("streaming")`

---

## Phase 7: ActionSurface Machine

### States

```
idle
 ├─ proposed
 ├─ confirming
 ├─ executing
 │   ├─ success
 │   └─ failure
```

This prevents:

- Double execution
- Skipped confirmation
- UI desync

---

## Phase 8: AgentPrompt Machine

### States

```
visible
 ├─ accepted
 ├─ rejected
 ├─ dismissed
```

This ensures prompts are **one-shot interactions**.

---

## Phase 9: ConversationApp Orchestration

ConversationApp becomes the **machine coordinator**, not a logic blob.

Responsibilities:

- Forward events to child machines
- Resolve conflicts (e.g. disable Composer while MessageItem streams)
- Handle global states (offline, rate limit)

---

## Phase 10: Documentation & Enforcement

### Required for Each Machine

Create a standard doc block:

```ts
/**
 * Component: Composer
 * States:
 * - idle
 * - typing
 * - submitting
 * - error
 * - disabled
 * - blocked
 *
 * Invalid Transitions:
 * - submit while disabled
 * - submit while blocked
 */
```

Checklist:

- [ ] State diagram
- [ ] Event list
- [ ] Invalid transitions
- [ ] Storybook coverage

---

## Phase 11: Migration Strategy (Low Risk)

- Do **not** refactor existing components
- Introduce machines behind feature flags
- Replace boolean state incrementally

---

## Final Rule

> **If a component has more than 3 states, it must use a state machine.**

---

## State Machines Progress Tracking

| Phase                                  | Status         | Progress  |
| -------------------------------------- | -------------- | --------- |
| Phase 1: Strategy Decision             | ✅ Completed   | 2/2 tasks |
| Phase 2: Canonical State Model         | ✅ Completed   | 1/1 tasks |
| Phase 3: Implementation Priority       | 🟡 In Progress | 4/6 tasks |
| Phase 4: Composer Machine              | ✅ Completed   | 3/3 tasks |
| Phase 5: Storybook Stories             | ✅ Completed   | 1/1 tasks |
| Phase 6: MessageItem Machine           | ✅ Completed   | 1/1 tasks |
| Phase 7: ActionSurface Machine         | ✅ Completed   | 1/1 tasks |
| Phase 8: AgentPrompt Machine           | ✅ Completed   | 1/1 tasks |
| Phase 9: ConversationApp Orchestration | 🔲 Not Started | 0/1 tasks |
| Phase 10: Documentation                | 🔲 Not Started | 0/1 tasks |
| Phase 11: Migration Strategy           | 🔲 Not Started | 0/1 tasks |

**Total: 14/19 tasks completed (74%)**

---

## Next Steps

If you want to proceed, the recommended order is:

1. ~~Composer machine **with context & guards**~~ ✅
2. ~~Full MessageItem machine~~ ✅
3. Storybook + XState testing setup
4. Mapping machines to analytics events
