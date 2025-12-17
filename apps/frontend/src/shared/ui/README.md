# Echo UI Component Library

A comprehensive component library for the Echo AI Career Agent, built following Atomic Design methodology.

## Architecture

```
atoms → molecules → organisms → templates → pages
```

| Level         | Description             | Examples                      |
| ------------- | ----------------------- | ----------------------------- |
| **Atoms**     | Basic building blocks   | Button, Icon, Badge, Avatar   |
| **Molecules** | Simple component groups | MessageBubble, AgentIdentity  |
| **Organisms** | Complex UI sections     | Composer, Sidebar, Modal      |
| **Templates** | Page layouts            | MainPanel, FirstRunExperience |
| **Pages**     | Final views             | ConversationApp               |

## Quick Start

```tsx
import { Button, Icon, Avatar } from "@/shared/ui/atoms";
import { MessageBubble, AgentIdentity } from "@/shared/ui/molecules";
import { Composer, Sidebar, Modal } from "@/shared/ui/organisms";
import { MainPanel } from "@/shared/ui/templates";
import { ConversationApp } from "@/shared/ui/pages";
```

## Component Categories

### Core Atoms

| Component     | Purpose             | Key Props                      |
| ------------- | ------------------- | ------------------------------ |
| `Button`      | Actions and CTAs    | `variant`, `size`, `isLoading` |
| `Icon`        | Iconography         | `name`, `size`                 |
| `Badge`       | Labels and counts   | `variant`, `dot`               |
| `Avatar`      | User/agent identity | `src`, `fallback`, `status`    |
| `Spinner`     | Loading states      | `size`, `variant`              |
| `TextInput`   | Text entry          | `error`, `leadingIcon`         |
| `Tooltip`     | Contextual help     | `content`, `position`          |
| `ProgressBar` | Progress indication | `value`, `variant`             |

### Message Molecules

| Component            | Purpose                               |
| -------------------- | ------------------------------------- |
| `MessageBubble`      | Message content display with Markdown |
| `MessageMeta`        | Timestamp, status, cost/latency       |
| `MessageActions`     | Copy, regenerate, edit, feedback      |
| `StreamingIndicator` | Typing animation during streaming     |
| `ThinkingIndicator`  | Shows reasoning/tool steps            |

### Conversation Organisms

| Component            | Purpose                               |
| -------------------- | ------------------------------------- |
| `MessageItem`        | Complete message with all features    |
| `MessageList`        | Ordered messages with date separators |
| `Composer`           | Message input with attachments        |
| `ConversationHeader` | Agent info, context, actions          |
| `Sidebar`            | Conversation navigation               |

### Agent Interaction

| Component           | Purpose                              |
| ------------------- | ------------------------------------ |
| `AgentPrompt`       | Clarifying questions, suggestions    |
| `ActionSurface`     | Actionable cards with state tracking |
| `FeedbackControls`  | Thumbs up/down, regenerate           |
| `TransparencyPanel` | Response explanation                 |

### Layout & Utilities

| Component      | Purpose                               |
| -------------- | ------------------------------------- |
| `Modal`        | Dialog overlays with focus trap       |
| `ErrorState`   | Error displays (inline/card/fullPage) |
| `GlobalStates` | Offline, rate limit, error boundary   |

---

## Usage Guidelines

### ✅ Do's

- Use semantic variants (`primary`, `success`, `error`)
- Provide meaningful `aria-label` for icon-only buttons
- Use `disabled` state appropriately
- Compose organisms from molecules/atoms

### ❌ Don'ts

- Don't bypass the component hierarchy
- Don't hardcode colors - use design tokens
- Don't skip loading states
- Don't forget error handling

### Accessibility

- All interactive elements are keyboard accessible
- Focus indicators are visible
- Color contrast meets WCAG AA
- ARIA attributes are properly set

### Responsive Design

- Components adapt from mobile to desktop
- Touch targets are 44px minimum
- Text remains readable at all sizes

---

## Running Storybook

```bash
cd apps/frontend
pnpm storybook
```

Visit `http://localhost:6006`
