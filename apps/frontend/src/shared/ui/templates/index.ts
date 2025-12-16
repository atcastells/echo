/**
 * Templates - Page-level layouts
 *
 * Templates are page-level objects that place components into a layout.
 * They articulate the design's underlying content structure.
 */

// Conversation templates
export { ConversationEmptyState } from './ConversationEmptyState';
export type { ConversationEmptyStateProps, SuggestedPrompt } from './ConversationEmptyState';

export { ConversationViewport } from './ConversationViewport';
export type { ConversationViewportProps } from './ConversationViewport';

// Onboarding templates
export { FirstRunExperience } from './FirstRunExperience';
export type { FirstRunExperienceProps, Capability } from './FirstRunExperience';

// Layout templates
export { MainPanel } from './MainPanel';
export type { MainPanelProps } from './MainPanel';
