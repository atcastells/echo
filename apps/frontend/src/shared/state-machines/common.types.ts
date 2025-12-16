/**
 * Common state type definitions for state machines.
 *
 * These types ensure state language consistency across all machines.
 */

/** Standard async operation states */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';

/** Streaming-specific states for AI responses */
export type StreamingState = 'idle' | 'thinking' | 'streaming' | 'interrupted';

/** Composer-specific states */
export type ComposerState =
    | 'idle'
    | 'typing'
    | 'submitting'
    | 'error'
    | 'disabled'
    | 'blocked';

/** Message item states */
export type MessageItemState =
    | 'idle'
    | 'streaming'
    | 'failed'
    | 'regenerating'
    | 'interrupted';

/** Action surface states */
export type ActionSurfaceState =
    | 'idle'
    | 'proposed'
    | 'confirming'
    | 'executing'
    | 'success'
    | 'failure';

/** Agent prompt states */
export type AgentPromptState = 'visible' | 'accepted' | 'rejected' | 'dismissed';
