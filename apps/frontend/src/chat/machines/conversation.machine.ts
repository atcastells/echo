/**
 * Conversation State Machine
 *
 * XState machine for managing conversation and chat streaming state.
 */

import { setup, assign } from "xstate";
import type { Conversation, ChatMessage, SSEEvent } from "../types/chat.types";

// ============================================================================
// Types
// ============================================================================

export interface ConversationContext {
  /** All conversations for the current agent */
  conversations: Conversation[];
  /** Currently active conversation ID */
  activeConversationId: string | null;
  /** Messages in the active conversation */
  messages: ChatMessage[];
  /** ID of the message currently being streamed */
  streamingMessageId: string | null;
  /** Partial content of the streaming message */
  streamingContent: string;
  /** Current error message */
  error: string | null;
  /** Whether data is being loaded */
  isLoading: boolean;
  /** Current agent ID */
  agentId: string | null;
}

export type ConversationEvent =
  | { type: "SET_AGENT"; agentId: string }
  | { type: "LOAD_CONVERSATIONS" }
  | { type: "CONVERSATIONS_LOADED"; conversations: Conversation[] }
  | { type: "SELECT_CONVERSATION"; conversationId: string }
  | { type: "MESSAGES_LOADED"; messages: ChatMessage[] }
  | { type: "SEND_MESSAGE"; content: string }
  | { type: "MESSAGE_SENT"; message: ChatMessage }
  | { type: "SSE_EVENT"; event: SSEEvent }
  | { type: "STREAM_DELTA"; delta: string }
  | { type: "STREAM_STARTED"; messageId: string }
  | { type: "STREAM_COMPLETE"; message?: ChatMessage }
  | { type: "ERROR"; error: string }
  | { type: "CLEAR_ERROR" }
  | { type: "INTERRUPT" }
  | { type: "NEW_CONVERSATION" }
  | { type: "CONVERSATION_CREATED"; conversation: Conversation };

// ============================================================================
// Initial Context
// ============================================================================

const initialContext: ConversationContext = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  streamingMessageId: null,
  streamingContent: "",
  error: null,
  isLoading: false,
  agentId: null,
};

// ============================================================================
// Machine Definition
// ============================================================================

export const conversationMachine = setup({
  types: {
    context: {} as ConversationContext,
    events: {} as ConversationEvent,
  },
  actions: {
    setAgentId: assign({
      agentId: (_, params: { agentId: string }) => params.agentId,
    }),
    setLoading: assign({
      isLoading: (_, params: { isLoading: boolean }) => params.isLoading,
    }),
    setConversations: assign({
      conversations: (_, params: { conversations: Conversation[] }) =>
        params.conversations,
      isLoading: false,
    }),
    setActiveConversation: assign({
      activeConversationId: (_, params: { conversationId: string }) =>
        params.conversationId,
      messages: [], // Clear messages when switching conversations
      streamingContent: "",
      streamingMessageId: null,
    }),
    setMessages: assign({
      messages: (_, params: { messages: ChatMessage[] }) => params.messages,
      isLoading: false,
    }),
    addUserMessage: assign({
      messages: ({ context }, params: { content: string }) => [
        ...context.messages,
        {
          id: `temp-${Date.now()}`,
          conversationId: context.activeConversationId || "",
          role: "user" as const,
          content: [{ type: "text" as const, value: params.content }],
          status: "complete" as const,
          createdAt: new Date().toISOString(),
        },
      ],
    }),
    setStreamingStarted: assign({
      streamingMessageId: (_, params: { messageId: string }) => params.messageId,
      streamingContent: "",
    }),
    appendStreamingContent: assign({
      streamingContent: ({ context }, params: { delta: string }) =>
        context.streamingContent + params.delta,
    }),
    finalizeStreamingMessage: assign(({ context }, params: { message?: ChatMessage }) => ({
      messages: params.message
        ? [...context.messages, params.message]
        : context.messages,
      streamingMessageId: null,
      streamingContent: "",
    })),
    clearStreaming: assign({
      streamingMessageId: null,
      streamingContent: "",
    }),
    setError: assign({
      error: (_, params: { error: string }) => params.error,
      isLoading: false,
    }),
    clearError: assign({
      error: null,
    }),
    addConversation: assign({
      conversations: ({ context }, params: { conversation: Conversation }) => [
        params.conversation,
        ...context.conversations,
      ],
      activeConversationId: (_, params: { conversation: Conversation }) =>
        params.conversation.id,
      messages: [],
    }),
  },
  guards: {
    hasActiveConversation: ({ context }) => !!context.activeConversationId,
    hasAgentId: ({ context }) => !!context.agentId,
  },
}).createMachine({
  id: "conversation",
  initial: "idle",
  context: initialContext,
  states: {
    idle: {
      on: {
        SET_AGENT: {
          actions: [
            { type: "setAgentId", params: ({ event }) => ({ agentId: event.agentId }) },
          ],
        },
        LOAD_CONVERSATIONS: {
          target: "loadingConversations",
          guard: "hasAgentId",
          actions: [{ type: "setLoading", params: { isLoading: true } }],
        },
        SELECT_CONVERSATION: {
          target: "loadingMessages",
          actions: [
            {
              type: "setActiveConversation",
              params: ({ event }) => ({ conversationId: event.conversationId }),
            },
            { type: "setLoading", params: { isLoading: true } },
          ],
        },
      },
    },

    loadingConversations: {
      on: {
        CONVERSATIONS_LOADED: {
          target: "ready",
          actions: [
            {
              type: "setConversations",
              params: ({ event }) => ({ conversations: event.conversations }),
            },
          ],
        },
        ERROR: {
          target: "error",
          actions: [
            { type: "setError", params: ({ event }) => ({ error: event.error }) },
          ],
        },
      },
    },

    loadingMessages: {
      on: {
        MESSAGES_LOADED: {
          target: "ready",
          actions: [
            {
              type: "setMessages",
              params: ({ event }) => ({ messages: event.messages }),
            },
          ],
        },
        ERROR: {
          target: "error",
          actions: [
            { type: "setError", params: ({ event }) => ({ error: event.error }) },
          ],
        },
      },
    },

    ready: {
      on: {
        SELECT_CONVERSATION: {
          target: "loadingMessages",
          actions: [
            {
              type: "setActiveConversation",
              params: ({ event }) => ({ conversationId: event.conversationId }),
            },
            { type: "setLoading", params: { isLoading: true } },
          ],
        },
        SEND_MESSAGE: {
          target: "streaming",
          guard: "hasActiveConversation",
          actions: [
            {
              type: "addUserMessage",
              params: ({ event }) => ({ content: event.content }),
            },
          ],
        },
        NEW_CONVERSATION: {
          target: "creatingConversation",
          guard: "hasAgentId",
        },
        LOAD_CONVERSATIONS: {
          target: "loadingConversations",
          guard: "hasAgentId",
          actions: [{ type: "setLoading", params: { isLoading: true } }],
        },
      },
    },

    creatingConversation: {
      on: {
        CONVERSATION_CREATED: {
          target: "ready",
          actions: [
            {
              type: "addConversation",
              params: ({ event }) => ({ conversation: event.conversation }),
            },
          ],
        },
        ERROR: {
          target: "error",
          actions: [
            { type: "setError", params: ({ event }) => ({ error: event.error }) },
          ],
        },
      },
    },

    streaming: {
      on: {
        STREAM_STARTED: {
          actions: [
            {
              type: "setStreamingStarted",
              params: ({ event }) => ({ messageId: event.messageId }),
            },
          ],
        },
        STREAM_DELTA: {
          actions: [
            {
              type: "appendStreamingContent",
              params: ({ event }) => ({ delta: event.delta }),
            },
          ],
        },
        STREAM_COMPLETE: {
          target: "ready",
          actions: [
            {
              type: "finalizeStreamingMessage",
              params: ({ event }) => ({ message: event.message }),
            },
          ],
        },
        INTERRUPT: {
          target: "ready",
          actions: ["clearStreaming"],
        },
        ERROR: {
          target: "ready",
          actions: [
            "clearStreaming",
            { type: "setError", params: ({ event }) => ({ error: event.error }) },
          ],
        },
      },
    },

    error: {
      on: {
        CLEAR_ERROR: {
          target: "ready",
          actions: ["clearError"],
        },
        LOAD_CONVERSATIONS: {
          target: "loadingConversations",
          guard: "hasAgentId",
          actions: [
            "clearError",
            { type: "setLoading", params: { isLoading: true } },
          ],
        },
      },
    },
  },
});

export type ConversationMachine = typeof conversationMachine;
