/**
 * Organisms - Complex UI sections
 *
 * Organisms are relatively complex UI components composed of molecules and/or atoms.
 * They form distinct sections of an interface with their own business logic.
 */

// Message-related organisms
export { MessageItem } from './MessageItem';
export type { MessageItemProps, Message } from './MessageItem';

export { MessageList } from './MessageList';
export type { MessageListProps } from './MessageList';

// Composer organisms
export { Composer } from './Composer';
export type { ComposerProps } from './Composer';

export { ComposerToolbar } from './ComposerToolbar';
export type { ComposerToolbarProps, PersonaOption, ContextScope } from './ComposerToolbar';

// Layout organisms
export { ConversationHeader } from './ConversationHeader';
export type { ConversationHeaderProps } from './ConversationHeader';

export { Sidebar } from './Sidebar';
export type { SidebarProps } from './Sidebar';

export { ConversationList } from './ConversationList';
export type { ConversationListProps } from './ConversationList';

// Agent interaction organisms
export { AgentPrompt } from './AgentPrompt';
export type { AgentPromptProps, AgentPromptVariant } from './AgentPrompt';

export { ActionSurface } from './ActionSurface';
export type { ActionSurfaceProps, ActionState } from './ActionSurface';

// Feedback and transparency organisms
export { FeedbackControls } from './FeedbackControls';
export type { FeedbackControlsProps, FeedbackState } from './FeedbackControls';

export { TransparencyPanel } from './TransparencyPanel';
export type { TransparencyPanelProps, ContextItem, ToolInvocation } from './TransparencyPanel';

// Error handling organisms
export { ErrorState } from './ErrorState';
export type { ErrorStateProps, ErrorStateVariant } from './ErrorState';

// Modal organisms
export { Modal, ConfirmModal } from './Modal';
export type { ModalProps } from './Modal';
