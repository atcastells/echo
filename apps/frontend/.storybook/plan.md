Below is a **component tree with explicit responsibilities**, written to be used **directly as a checklist** when building a reusable component library (design + engineering aligned).

---

# Conversational Agent UI — Component Tree & Responsibilities

## 1. App Shell

**`ConversationApp`**

- Owns global layout
- Provides theme, tokens, motion
- Manages global states (offline, rate limit)
- Hosts context providers

---

## 2. Layout Layer

### `Sidebar`

- Conversation navigation
- Search
- Create / delete conversations
- Active conversation highlight

**Children**

- `ConversationList`
- `ConversationListItem`
- `NewConversationButton`

---

### `MainPanel`

- Vertical stack for conversation + input
- Handles resizing / safe areas

**Children**

- `ConversationHeader`
- `ConversationViewport`
- `Composer`

---

## 3. Conversation Header

### `ConversationHeader`

**Responsibilities**

- Display agent identity
- Show context and mode
- Expose global conversation actions

**Children**

- `AgentIdentity`
- `ContextIndicator`
- `ConversationActions`

---

### `AgentIdentity`

- Avatar
- Name
- Persona / role
- Status (available, restricted)

---

### `ContextIndicator`

- Memory on/off
- Context usage level
- Privacy tooltip
- Context reset trigger

---

### `ConversationActions`

- Share
- Export
- Clear / reset
- Rename conversation

---

## 4. Conversation Viewport

### `ConversationViewport`

**Responsibilities**

- Scroll container
- Auto-scroll rules
- Jump-to-message logic
- Empty state handling

**Children**

- `ConversationEmptyState`
- `MessageList`

---

### `MessageList`

- Render ordered messages
- Handle streaming inserts
- Manage message grouping

**Children**

- `MessageItem`

---

## 5. Message System

### `MessageItem`

**Responsibilities**

- Message layout
- State rendering
- Action anchoring

**Variants**

- User
- Agent
- System

**Children**

- `MessageBubble`
- `MessageMeta`
- `MessageActions`

---

### `MessageBubble`

- Text rendering
- Markdown / rich content
- Code blocks
- Citations
- Expand / collapse

---

### `MessageMeta`

- Timestamp
- Status (streaming, failed)
- Cost / latency (optional)

---

### `MessageActions`

- Regenerate
- Edit
- Copy
- Report
- Feedback

---

## 6. Streaming & Loading

### `StreamingIndicator`

- Typing animation
- Partial content state
- Interrupt affordance

---

### `ThinkingIndicator`

- Agent reasoning / tool usage
- Distinct from streaming

---

## 7. Agent-Initiated Interaction Layer

### `AgentPrompt`

**Responsibilities**

- Non-user-initiated turns
- Visually distinct from messages

**Variants**

- Clarifying question
- Suggested next step
- Confirmation request
- Warning / constraint
- Summary offer

**Children**

- `PromptContent`
- `PromptActions`

---

### `PromptActions`

- Accept
- Reject
- Modify
- Ask follow-up

---

## 8. Action System (Critical)

### `ActionSurface`

**Responsibilities**

- Render actionable UI
- Enforce confirmation flows
- Track action state

**Children**

- `ActionButton`
- `ActionConfirm`
- `ActionCancel`
- `ActionUndo`
- `ActionRetry`

---

### `ActionButton`

**Variants**

- Primary
- Secondary
- Destructive
- Disabled
- Loading

---

## 9. Composer (Input)

### `Composer`

**Responsibilities**

- Draft management
- Submission lifecycle
- Input validation

**Children**

- `TextInput`
- `SendButton`
- `AttachmentInput`
- `AttachmentPreview`
- `VoiceInput`
- `ComposerToolbar`

---

### `TextInput`

- Multiline
- Keyboard shortcuts
- IME handling
- Command triggers

---

### `ComposerToolbar`

- Persona / mode selector
- Context scope selector
- Shortcut hints

---

## 10. Attachments

### `AttachmentInput`

- File picker
- Drag & drop
- Validation

---

### `AttachmentPreview`

- File type icon
- Remove action
- Upload state

---

## 11. Global Feedback & Meta

### `FeedbackControls`

- 👍 / 👎
- Freeform feedback
- Regenerate

---

### `TransparencyPanel`

- Why this response?
- Context used
- Tools invoked
- Memory impact

---

## 12. Error & Recovery

### `ErrorState`

**Responsibilities**

- Explain failure
- Offer recovery paths

**Variants**

- Inline message error
- Global error
- Permission denied
- Tool failure

---

### `RetryControl`

- Retry last action
- Retry with changes

---

## 13. Empty & First-Run

### `FirstRunExperience`

- Product explanation
- Example prompts
- Quick-start actions

---

### `ConversationEmptyState`

- No messages
- Suggested prompts

---

## 14. Cross-Cutting Components (Library Rules)

### `Tooltip`

- Contextual explanations
- Privacy disclosures

---

### `Modal`

- Destructive confirmations
- Tool approvals

---

### `Toast`

- Non-blocking feedback

---

## 15. Required Component States (Checklist Rule)

Every component must define:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error

---

## 16. Component Ownership Model (Checklist Rule)

Each component must declare:

- Owned state vs controlled props
- Async boundaries
- Error responsibility
- Accessibility contract

---

### Mental Model for the Library

> **Chat is just the rendering layer. Actions and state machines are the real product.**

If you want next:

- A **state machine diagram per component**
- A **React folder structure matching this tree**
- A **design-token → component mapping**
- A **checklist to validate AI-agent-specific UX quality**
