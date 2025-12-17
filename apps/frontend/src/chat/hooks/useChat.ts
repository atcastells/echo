/**
 * useChat Hook
 *
 * Manages chat streaming state and provides methods for sending messages
 * and controlling the chat session.
 */

import { useState, useCallback, useRef } from "react";
import { chatApi } from "../api/chatApi";
import type {
  ChatMessage,
  ContentBlock,
  SSEEvent,
  MessageDeltaPayload,
  MessageCompletedPayload,
  ChatFailedPayload,
  ChatStartedPayload,
  AgentActionProposedPayload,
} from "../types/chat.types";

export interface UseChatOptions {
  /** Conversation ID to send messages to */
  conversationId: string;
  /** Callback when a complete message is received */
  onMessage?: (message: ChatMessage) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when streaming starts */
  onStreamStart?: (messageId: string) => void;
  /** Callback when streaming completes */
  onStreamComplete?: () => void;
  /** Callback when an action is proposed */
  onActionProposed?: (action: AgentActionProposedPayload) => void;
}

export interface UseChatReturn {
  /** Send a text message */
  sendMessage: (content: string) => Promise<void>;
  /** Send a message with content blocks */
  sendMessageBlocks: (content: ContentBlock[]) => Promise<void>;
  /** Interrupt the current streaming response */
  interrupt: () => Promise<void>;
  /** Confirm a proposed action */
  confirmAction: (
    actionId: string,
    parameters?: Record<string, unknown>,
  ) => Promise<void>;
  /** Cancel a proposed action */
  cancelAction: (actionId: string) => Promise<void>;
  /** Whether a message is currently streaming */
  isStreaming: boolean;
  /** Current streaming content (partial response) */
  streamingContent: string;
  /** ID of the message currently being streamed */
  streamingMessageId: string | null;
  /** Whether the agent is thinking/processing */
  isThinking: boolean;
  /** Currently pending action requiring confirmation */
  pendingAction: AgentActionProposedPayload | null;
}

export const useChat = ({
  conversationId,
  onMessage,
  onError,
  onStreamStart,
  onStreamComplete,
  onActionProposed,
}: UseChatOptions): UseChatReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [pendingAction, setPendingAction] =
    useState<AgentActionProposedPayload | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSSEEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.event) {
        case "chat.started": {
          const startPayload = event.payload as unknown as ChatStartedPayload;
          setStreamingMessageId(
            startPayload.message_id || event.message_id || null,
          );
          setIsThinking(false);
          onStreamStart?.(startPayload.message_id || event.message_id || "");
          break;
        }

        case "agent.thinking":
          setIsThinking(true);
          break;

        case "message.delta": {
          const deltaPayload = event.payload as unknown as MessageDeltaPayload;
          setIsThinking(false);
          setStreamingContent((prev) => prev + (deltaPayload.delta || ""));
          break;
        }

        case "message.completed": {
          const completedPayload =
            event.payload as unknown as MessageCompletedPayload;
          setIsThinking(false);
          onMessage?.(completedPayload.message);
          break;
        }

        case "chat.completed":
          setIsStreaming(false);
          setStreamingContent("");
          setStreamingMessageId(null);
          setIsThinking(false);
          onStreamComplete?.();
          break;

        case "chat.failed": {
          const failedPayload = event.payload as unknown as ChatFailedPayload;
          setIsStreaming(false);
          setStreamingContent("");
          setStreamingMessageId(null);
          setIsThinking(false);
          onError?.(new Error(failedPayload.error || "Chat failed"));
          break;
        }

        case "chat.interrupted":
          setIsStreaming(false);
          setStreamingContent("");
          setStreamingMessageId(null);
          setIsThinking(false);
          setPendingAction(null);
          break;

        case "agent.action.proposed": {
          const actionPayload =
            event.payload as unknown as AgentActionProposedPayload;
          setIsThinking(false);
          setPendingAction(actionPayload);
          onActionProposed?.(actionPayload);
          break;
        }

        default:
          // Log unhandled events for debugging
          console.debug("Unhandled SSE event:", event.event, event.payload);
      }
    },
    [onMessage, onError, onStreamStart, onStreamComplete, onActionProposed],
  );

  const sendMessageBlocks = useCallback(
    async (content: ContentBlock[]) => {
      if (!conversationId) {
        onError?.(new Error("No conversation ID provided"));
        return;
      }

      // Reset state
      setIsStreaming(true);
      setIsThinking(true);
      setStreamingContent("");
      setStreamingMessageId(null);
      setPendingAction(null);

      try {
        abortControllerRef.current = await chatApi.chatStream(
          {
            conversation_id: conversationId,
            message: { role: "user", content },
          },
          {
            onEvent: handleSSEEvent,
            onError: (error) => {
              setIsStreaming(false);
              setIsThinking(false);
              setStreamingContent("");
              setStreamingMessageId(null);
              setPendingAction(null);
              onError?.(error);
            },
            onComplete: () => {
              setIsStreaming(false);
              setIsThinking(false);
              setStreamingContent("");
              setStreamingMessageId(null);
              onStreamComplete?.();
            },
          },
        );
      } catch (error) {
        setIsStreaming(false);
        setIsThinking(false);
        onError?.(error as Error);
      }
    },
    [conversationId, handleSSEEvent, onError, onStreamComplete],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const contentBlocks: ContentBlock[] = [{ type: "text", value: content }];
      return sendMessageBlocks(contentBlocks);
    },
    [sendMessageBlocks],
  );

  const interrupt = useCallback(async () => {
    // Abort the fetch request
    abortControllerRef.current?.abort();

    // Send interrupt command to backend
    if (conversationId) {
      try {
        await chatApi.interrupt(
          conversationId,
          streamingMessageId || undefined,
        );
      } catch (error) {
        console.error("Failed to send interrupt command:", error);
      }
    }

    // Reset state
    setIsStreaming(false);
    setIsThinking(false);
    setStreamingContent("");
    setStreamingMessageId(null);
    setPendingAction(null);
  }, [conversationId, streamingMessageId]);

  const confirmAction = useCallback(
    async (actionId: string, parameters?: Record<string, unknown>) => {
      if (!conversationId) return;

      try {
        // We set isThinking to true as the agent will resume processing
        setIsThinking(true);
        setPendingAction(null);

        if (parameters && Object.keys(parameters).length > 0) {
          await chatApi.modifyAction(conversationId, actionId, parameters);
        } else {
          await chatApi.confirmAction(conversationId, actionId);
        }
      } catch (error) {
        setIsThinking(false);
        onError?.(error as Error);
      }
    },
    [conversationId, onError],
  );

  const cancelAction = useCallback(
    async (actionId: string) => {
      if (!conversationId) return;

      try {
        // We set isThinking to true as the agent will resume processing (to acknowledge cancellation)
        setIsThinking(true);
        setPendingAction(null);

        await chatApi.cancelAction(conversationId, actionId);
      } catch (error) {
        setIsThinking(false);
        onError?.(error as Error);
      }
    },
    [conversationId, onError],
  );

  return {
    sendMessage,
    sendMessageBlocks,
    interrupt,
    confirmAction,
    cancelAction,
    isStreaming,
    streamingContent,
    streamingMessageId,
    isThinking,
    pendingAction,
  };
};
