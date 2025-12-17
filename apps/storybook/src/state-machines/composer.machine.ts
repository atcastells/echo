import { setup, assign } from "xstate";

/**
 * Composer State Machine
 *
 * States:
 * - idle: Default state, ready for input
 * - typing: User is actively typing
 * - submitting: Message is being sent
 * - error: Submission failed
 * - disabled: Composer disabled (e.g., agent is streaming)
 * - blocked: Composer blocked (e.g., rate limited)
 *
 * Invalid Transitions:
 * - submit while disabled
 * - submit while blocked
 * - type while disabled or blocked
 */

export interface ComposerContext {
  /** Current input value */
  inputValue: string;
  /** Error message if in error state */
  errorMessage?: string;
  /** Number of retry attempts */
  retryCount: number;
}

export type ComposerEvent =
  | { type: "TYPE"; value: string }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string }
  | { type: "RETRY" }
  | { type: "CLEAR" }
  | { type: "DISABLE" }
  | { type: "ENABLE" }
  | { type: "BLOCK" }
  | { type: "UNBLOCK" };

export const composerMachine = setup({
  types: {
    context: {} as ComposerContext,
    events: {} as ComposerEvent,
  },
  actions: {
    updateInput: assign({
      inputValue: (_, params: { value: string }) => params.value,
    }),
    clearInput: assign({
      inputValue: () => "",
      errorMessage: () => undefined,
    }),
    setError: assign({
      errorMessage: (_, params: { error: string }) => params.error,
    }),
    clearError: assign({
      errorMessage: () => undefined,
    }),
    incrementRetry: assign({
      retryCount: ({ context }) => context.retryCount + 1,
    }),
    resetRetry: assign({
      retryCount: () => 0,
    }),
  },
  guards: {
    hasContent: ({ context }) => context.inputValue.trim().length > 0,
  },
}).createMachine({
  id: "composer",
  initial: "idle",
  context: {
    inputValue: "",
    errorMessage: undefined,
    retryCount: 0,
  },
  states: {
    idle: {
      on: {
        TYPE: {
          target: "typing",
          actions: {
            type: "updateInput",
            params: ({ event }) => ({ value: event.value }),
          },
        },
        DISABLE: "disabled",
        BLOCK: "blocked",
      },
    },
    typing: {
      on: {
        TYPE: {
          actions: {
            type: "updateInput",
            params: ({ event }) => ({ value: event.value }),
          },
        },
        SUBMIT: {
          target: "submitting",
          guard: "hasContent",
        },
        CLEAR: {
          target: "idle",
          actions: "clearInput",
        },
        DISABLE: "disabled",
        BLOCK: "blocked",
      },
    },
    submitting: {
      on: {
        SUBMIT_SUCCESS: {
          target: "idle",
          actions: ["clearInput", "resetRetry"],
        },
        SUBMIT_ERROR: {
          target: "error",
          actions: {
            type: "setError",
            params: ({ event }) => ({ error: event.error }),
          },
        },
      },
    },
    error: {
      on: {
        RETRY: {
          target: "submitting",
          actions: "incrementRetry",
        },
        TYPE: {
          target: "typing",
          actions: [
            "clearError",
            {
              type: "updateInput",
              params: ({ event }) => ({ value: event.value }),
            },
          ],
        },
        CLEAR: {
          target: "idle",
          actions: ["clearInput", "clearError"],
        },
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
