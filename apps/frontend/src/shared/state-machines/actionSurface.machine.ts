import { setup, assign } from 'xstate';

/**
 * ActionSurface State Machine
 *
 * States:
 * - idle: No action proposed
 * - proposed: Action is being shown to user, awaiting confirmation
 * - confirming: User is going through confirmation flow
 * - executing: Action is being executed
 * - success: Action completed successfully
 * - failure: Action failed
 *
 * Invalid Transitions:
 * - execute while already executing
 * - confirm without being in proposed state
 */

export interface ActionSurfaceContext {
    /** ID of the current action */
    actionId?: string;
    /** Error message if failed */
    errorMessage?: string;
    /** Success message */
    successMessage?: string;
    /** Number of retry attempts */
    retryCount: number;
}

export type ActionSurfaceEvent =
    | { type: 'PROPOSE'; actionId: string }
    | { type: 'CONFIRM' }
    | { type: 'CANCEL' }
    | { type: 'EXECUTE_SUCCESS'; message?: string }
    | { type: 'EXECUTE_ERROR'; error: string }
    | { type: 'RETRY' }
    | { type: 'UNDO' }
    | { type: 'DISMISS' }
    | { type: 'RESET' };

export const actionSurfaceMachine = setup({
    types: {
        context: {} as ActionSurfaceContext,
        events: {} as ActionSurfaceEvent,
    },
    actions: {
        setActionId: assign({
            actionId: (_, params: { actionId: string }) => params.actionId,
        }),
        setError: assign({
            errorMessage: (_, params: { error: string }) => params.error,
        }),
        setSuccess: assign({
            successMessage: (_, params: { message?: string }) =>
                params.message ?? 'Action completed successfully',
        }),
        clearError: assign({
            errorMessage: () => undefined,
        }),
        incrementRetry: assign({
            retryCount: ({ context }) => context.retryCount + 1,
        }),
        resetContext: assign({
            actionId: () => undefined,
            errorMessage: () => undefined,
            successMessage: () => undefined,
            retryCount: () => 0,
        }),
    },
}).createMachine({
    id: 'actionSurface',
    initial: 'idle',
    context: {
        actionId: undefined,
        errorMessage: undefined,
        successMessage: undefined,
        retryCount: 0,
    },
    states: {
        idle: {
            on: {
                PROPOSE: {
                    target: 'proposed',
                    actions: {
                        type: 'setActionId',
                        params: ({ event }) => ({ actionId: event.actionId }),
                    },
                },
            },
        },
        proposed: {
            on: {
                CONFIRM: 'confirming',
                CANCEL: {
                    target: 'idle',
                    actions: 'resetContext',
                },
                DISMISS: {
                    target: 'idle',
                    actions: 'resetContext',
                },
            },
        },
        confirming: {
            on: {
                CONFIRM: 'executing',
                CANCEL: 'proposed',
            },
        },
        executing: {
            on: {
                EXECUTE_SUCCESS: {
                    target: 'success',
                    actions: {
                        type: 'setSuccess',
                        params: ({ event }) => ({ message: event.message }),
                    },
                },
                EXECUTE_ERROR: {
                    target: 'failure',
                    actions: {
                        type: 'setError',
                        params: ({ event }) => ({ error: event.error }),
                    },
                },
            },
        },
        success: {
            on: {
                UNDO: {
                    target: 'executing',
                    actions: 'clearError',
                },
                DISMISS: {
                    target: 'idle',
                    actions: 'resetContext',
                },
                RESET: {
                    target: 'idle',
                    actions: 'resetContext',
                },
            },
        },
        failure: {
            on: {
                RETRY: {
                    target: 'executing',
                    actions: ['clearError', 'incrementRetry'],
                },
                CANCEL: {
                    target: 'idle',
                    actions: 'resetContext',
                },
                RESET: {
                    target: 'idle',
                    actions: 'resetContext',
                },
            },
        },
    },
});
