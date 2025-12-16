import { setup, assign } from 'xstate';

/**
 * MessageItem State Machine
 *
 * States:
 * - idle: Default rendered state
 * - streaming: Message is being streamed from the agent
 * - failed: Message delivery/generation failed
 * - regenerating: Message is being regenerated
 * - interrupted: Streaming was manually stopped
 *
 * Invalid Transitions:
 * - regenerate while streaming
 * - stream while regenerating
 */

export interface MessageItemContext {
    /** Partial content during streaming */
    streamingContent: string;
    /** Error message if failed */
    errorMessage?: string;
    /** Number of regeneration attempts */
    regenerateCount: number;
}

export type MessageItemEvent =
    | { type: 'STREAM_START' }
    | { type: 'STREAM_CHUNK'; content: string }
    | { type: 'STREAM_END' }
    | { type: 'FAIL'; error: string }
    | { type: 'RETRY' }
    | { type: 'REGENERATE' }
    | { type: 'REGENERATE_SUCCESS' }
    | { type: 'REGENERATE_ERROR'; error: string }
    | { type: 'INTERRUPT' }
    | { type: 'RESET' };

export const messageItemMachine = setup({
    types: {
        context: {} as MessageItemContext,
        events: {} as MessageItemEvent,
    },
    actions: {
        appendContent: assign({
            streamingContent: ({ context, event }) =>
                event.type === 'STREAM_CHUNK'
                    ? context.streamingContent + event.content
                    : context.streamingContent,
        }),
        clearContent: assign({
            streamingContent: () => '',
        }),
        setError: assign({
            errorMessage: (_, params: { error: string }) => params.error,
        }),
        clearError: assign({
            errorMessage: () => undefined,
        }),
        incrementRegenerate: assign({
            regenerateCount: ({ context }) => context.regenerateCount + 1,
        }),
        resetContext: assign({
            streamingContent: () => '',
            errorMessage: () => undefined,
            regenerateCount: () => 0,
        }),
    },
}).createMachine({
    id: 'messageItem',
    initial: 'idle',
    context: {
        streamingContent: '',
        errorMessage: undefined,
        regenerateCount: 0,
    },
    states: {
        idle: {
            on: {
                STREAM_START: {
                    target: 'streaming',
                    actions: 'clearContent',
                },
                FAIL: {
                    target: 'failed',
                    actions: {
                        type: 'setError',
                        params: ({ event }) => ({ error: event.error }),
                    },
                },
                REGENERATE: 'regenerating',
            },
        },
        streaming: {
            on: {
                STREAM_CHUNK: {
                    actions: 'appendContent',
                },
                STREAM_END: {
                    target: 'idle',
                    actions: 'clearContent',
                },
                FAIL: {
                    target: 'failed',
                    actions: {
                        type: 'setError',
                        params: ({ event }) => ({ error: event.error }),
                    },
                },
                INTERRUPT: {
                    target: 'interrupted',
                },
            },
        },
        failed: {
            on: {
                RETRY: {
                    target: 'streaming',
                    actions: ['clearError', 'clearContent'],
                },
                RESET: {
                    target: 'idle',
                    actions: 'resetContext',
                },
            },
        },
        regenerating: {
            entry: 'incrementRegenerate',
            on: {
                STREAM_START: {
                    target: 'streaming',
                    actions: 'clearContent',
                },
                REGENERATE_SUCCESS: {
                    target: 'idle',
                },
                REGENERATE_ERROR: {
                    target: 'failed',
                    actions: {
                        type: 'setError',
                        params: ({ event }) => ({ error: event.error }),
                    },
                },
            },
        },
        interrupted: {
            on: {
                RETRY: {
                    target: 'streaming',
                    actions: 'clearContent',
                },
                RESET: {
                    target: 'idle',
                    actions: 'resetContext',
                },
            },
        },
    },
});
