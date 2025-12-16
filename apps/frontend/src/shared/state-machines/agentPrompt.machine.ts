import { setup } from 'xstate';

/**
 * AgentPrompt State Machine
 *
 * States:
 * - visible: Prompt is displayed to the user
 * - accepted: User accepted the prompt
 * - rejected: User rejected the prompt
 * - dismissed: Prompt was dismissed without action
 *
 * Note: This is a one-shot interaction machine.
 * Once in accepted/rejected/dismissed, the prompt is considered complete.
 */

export interface AgentPromptContext {
    /** ID of the prompt */
    promptId?: string;
    /** Variant of the prompt */
    variant?: 'clarifying' | 'suggestion' | 'confirmation' | 'warning';
}

export type AgentPromptEvent =
    | { type: 'SHOW'; promptId: string; variant?: AgentPromptContext['variant'] }
    | { type: 'ACCEPT' }
    | { type: 'REJECT' }
    | { type: 'MODIFY' }
    | { type: 'DISMISS' }
    | { type: 'RESET' };

export const agentPromptMachine = setup({
    types: {
        context: {} as AgentPromptContext,
        events: {} as AgentPromptEvent,
    },
}).createMachine({
    id: 'agentPrompt',
    initial: 'hidden',
    context: {
        promptId: undefined,
        variant: undefined,
    },
    states: {
        hidden: {
            on: {
                SHOW: {
                    target: 'visible',
                    actions: ({ context, event }) => {
                        context.promptId = event.promptId;
                        context.variant = event.variant;
                    },
                },
            },
        },
        visible: {
            on: {
                ACCEPT: 'accepted',
                REJECT: 'rejected',
                MODIFY: 'modifying',
                DISMISS: 'dismissed',
            },
        },
        modifying: {
            on: {
                ACCEPT: 'accepted',
                REJECT: 'rejected',
                DISMISS: 'dismissed',
            },
        },
        accepted: {
            type: 'final',
            on: {
                RESET: {
                    target: 'hidden',
                    actions: ({ context }) => {
                        context.promptId = undefined;
                        context.variant = undefined;
                    },
                },
            },
        },
        rejected: {
            type: 'final',
            on: {
                RESET: {
                    target: 'hidden',
                    actions: ({ context }) => {
                        context.promptId = undefined;
                        context.variant = undefined;
                    },
                },
            },
        },
        dismissed: {
            type: 'final',
            on: {
                RESET: {
                    target: 'hidden',
                    actions: ({ context }) => {
                        context.promptId = undefined;
                        context.variant = undefined;
                    },
                },
            },
        },
    },
});
