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

## Phase 3: Molecules

**Goal**: Compose atoms into functional component groups.

### Task 3.1: MessageBubble

- [ ] Create `MessageBubble` component
- [ ] Implement variants: user, agent, system
- [ ] Support plain text rendering
- [ ] Support Markdown rendering
- [ ] Support code blocks with syntax highlighting
- [ ] Add expand/collapse for long content
- [ ] Add citation/reference support
- [ ] Write stories for all content types

### Task 3.2: MessageMeta

- [ ] Create `MessageMeta` component
- [ ] Display timestamp (relative/absolute)
- [ ] Display status: sending, sent, failed, streaming
- [ ] Add optional cost/latency display
- [ ] Write stories for all states

### Task 3.3: MessageActions

- [ ] Create `MessageActions` component
- [ ] Add Copy action
- [ ] Add Regenerate action
- [ ] Add Edit action (user messages)
- [ ] Add Feedback (👍/👎) actions
- [ ] Add Report action
- [ ] Implement hover reveal behavior
- [ ] Write stories for user vs agent actions

### Task 3.4: AgentIdentity

- [ ] Create `AgentIdentity` component
- [ ] Compose Avatar + Name + Role
- [ ] Add status indicator (available, busy, restricted)
- [ ] Add clickable variant for agent info
- [ ] Write stories for all states

### Task 3.5: StreamingIndicator

- [ ] Create `StreamingIndicator` component
- [ ] Implement typing animation (dots)
- [ ] Add partial content state
- [ ] Add interrupt/stop affordance
- [ ] Write stories for streaming states

### Task 3.6: ThinkingIndicator

- [ ] Create `ThinkingIndicator` component
- [ ] Show "reasoning" state distinct from streaming
- [ ] Add tool usage indication
- [ ] Write stories

### Task 3.7: AttachmentPreview

- [ ] Create `AttachmentPreview` component
- [ ] Show file type icon
- [ ] Display file name and size
- [ ] Add remove action
- [ ] Show upload progress state
- [ ] Write stories for file types and states

### Task 3.8: ContextIndicator

- [ ] Create `ContextIndicator` component
- [ ] Show memory on/off state
- [ ] Display context usage level (progress)
- [ ] Add privacy tooltip
- [ ] Add context reset trigger
- [ ] Write stories

### Task 3.9: ConversationListItem

- [ ] Create `ConversationListItem` component
- [ ] Display conversation title
- [ ] Show last message preview
- [ ] Show timestamp
- [ ] Implement active/selected state
- [ ] Add delete action
- [ ] Write stories for all states

---

## Phase 4: Organisms

**Goal**: Build complex, self-contained UI sections.

### Task 4.1: MessageItem

- [ ] Create `MessageItem` component
- [ ] Compose MessageBubble + MessageMeta + MessageActions
- [ ] Implement user variant layout
- [ ] Implement agent variant layout
- [ ] Implement system variant layout
- [ ] Handle streaming state
- [ ] Handle error state with retry
- [ ] Write stories for all variants and states

### Task 4.2: MessageList

- [ ] Create `MessageList` component
- [ ] Render ordered messages
- [ ] Handle message grouping (consecutive same sender)
- [ ] Support streaming message insertion
- [ ] Add date separators
- [ ] Write stories with various message combinations

### Task 4.3: Composer

- [ ] Create `Composer` component
- [ ] Integrate TextInput (multiline)
- [ ] Add SendButton with loading state
- [ ] Add AttachmentInput trigger
- [ ] Add AttachmentPreview list
- [ ] Add VoiceInput trigger (optional)
- [ ] Implement keyboard shortcuts (Cmd+Enter)
- [ ] Add character limit indicator
- [ ] Handle disabled state (while streaming)
- [ ] Write stories for all states

### Task 4.4: ComposerToolbar

- [ ] Create `ComposerToolbar` component
- [ ] Add persona/mode selector
- [ ] Add context scope selector
- [ ] Show keyboard shortcut hints
- [ ] Write stories

### Task 4.5: ConversationHeader

- [ ] Create `ConversationHeader` component
- [ ] Integrate AgentIdentity
- [ ] Integrate ContextIndicator
- [ ] Add ConversationActions (share, export, clear, rename)
- [ ] Write stories

### Task 4.6: Sidebar

- [ ] Create `Sidebar` component
- [ ] Add search input
- [ ] Add NewConversationButton
- [ ] Integrate ConversationList
- [ ] Handle collapsed/expanded states
- [ ] Write stories for states

### Task 4.7: ConversationList

- [ ] Create `ConversationList` component
- [ ] Render ConversationListItem components
- [ ] Handle empty state
- [ ] Handle loading state
- [ ] Support keyboard navigation
- [ ] Write stories

### Task 4.8: AgentPrompt

- [ ] Create `AgentPrompt` component
- [ ] Implement variants: clarifying question, suggestion, confirmation, warning
- [ ] Add PromptContent area
- [ ] Add PromptActions (accept, reject, modify)
- [ ] Visually distinguish from regular messages
- [ ] Write stories for all variants

### Task 4.9: ActionSurface

- [ ] Create `ActionSurface` component
- [ ] Render actionable UI from agent
- [ ] Add ActionButton, ActionConfirm, ActionCancel
- [ ] Add ActionUndo, ActionRetry
- [ ] Implement confirmation flows
- [ ] Track action state (pending, executing, done, failed)
- [ ] Write stories

### Task 4.10: ErrorState

- [ ] Create `ErrorState` component
- [ ] Implement variants: inline, global, permission denied, tool failure
- [ ] Show error explanation
- [ ] Provide recovery actions
- [ ] Write stories for all variants

### Task 4.11: FeedbackControls

- [ ] Create `FeedbackControls` component
- [ ] Add thumbs up/down buttons
- [ ] Add freeform feedback input
- [ ] Add regenerate action
- [ ] Write stories

### Task 4.12: TransparencyPanel

- [ ] Create `TransparencyPanel` component
- [ ] Show "why this response" explanation
- [ ] Display context used
- [ ] List tools invoked
- [ ] Show memory impact
- [ ] Write stories

### Task 4.13: Modal

- [ ] Create `Modal` component
- [ ] Add header, body, footer sections
- [ ] Implement close behavior (X, escape, backdrop)
- [ ] Add focus trap
- [ ] Create confirmation modal variant
- [ ] Write stories

---

## Phase 5: Templates

**Goal**: Create page-level layouts without data.

### Task 5.1: ConversationViewport

- [ ] Create `ConversationViewport` component
- [ ] Implement scroll container
- [ ] Add auto-scroll to bottom behavior
- [ ] Add scroll-to-message functionality
- [ ] Add "new messages" indicator
- [ ] Handle ConversationEmptyState
- [ ] Write stories with mock content

### Task 5.2: ConversationEmptyState

- [ ] Create `ConversationEmptyState` component
- [ ] Show welcome message
- [ ] Display suggested prompts
- [ ] Write stories

### Task 5.3: FirstRunExperience

- [ ] Create `FirstRunExperience` component
- [ ] Explain product capabilities
- [ ] Show example prompts
- [ ] Add quick-start actions
- [ ] Write stories

### Task 5.4: MainPanel

- [ ] Create `MainPanel` component
- [ ] Layout: ConversationHeader + ConversationViewport + Composer
- [ ] Handle safe areas (mobile)
- [ ] Handle resize behavior
- [ ] Write stories

---

## Phase 6: Pages

**Goal**: Assemble final views with state management.

### Task 6.1: ConversationApp

- [ ] Create `ConversationApp` shell component
- [ ] Integrate Sidebar + MainPanel
- [ ] Set up theme provider
- [ ] Set up toast provider
- [ ] Handle responsive layout (mobile: drawer sidebar)
- [ ] Write stories showing full app

### Task 6.2: Global States

- [ ] Implement offline state handling
- [ ] Implement rate limit state handling
- [ ] Add global error boundary
- [ ] Write stories for global states

---

## Phase 7: Integration & Polish

**Goal**: Final integration, testing, and documentation.

### Task 7.1: Accessibility Audit

- [ ] Run axe accessibility checks on all components
- [ ] Fix any accessibility violations
- [ ] Test keyboard navigation flow
- [ ] Test screen reader experience

### Task 7.2: Dark Mode

- [ ] Verify all components in dark mode
- [ ] Fix any contrast issues
- [ ] Test theme switching

### Task 7.3: Responsive Testing

- [ ] Test all components at mobile breakpoint
- [ ] Test all components at tablet breakpoint
- [ ] Fix any responsive issues

### Task 7.4: Documentation

- [ ] Complete component documentation
- [ ] Add usage guidelines
- [ ] Document component API (props)
- [ ] Add do's and don'ts

### Task 7.5: Performance

- [ ] Profile component render performance
- [ ] Optimize heavy components (MessageList virtualization)
- [ ] Lazy load where appropriate

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

| Phase               | Status         | Progress   |
| ------------------- | -------------- | ---------- |
| Phase 1: Foundation | � Completed    | 3/3 tasks  |
| Phase 2: Atoms      | 🔴 Not Started | 0/8 tasks  |
| Phase 3: Molecules  | 🔴 Not Started | 0/9 tasks  |
| Phase 4: Organisms  | 🔴 Not Started | 0/13 tasks |
| Phase 5: Templates  | 🔴 Not Started | 0/4 tasks  |
| Phase 6: Pages      | 🔴 Not Started | 0/2 tasks  |
| Phase 7: Polish     | 🔴 Not Started | 0/5 tasks  |

**Total: 3/44 tasks completed**

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
