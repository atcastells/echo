/**
 * useChat Hook
 *
 * Manages chat streaming state and provides methods for sending messages
 * and controlling the chat session.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { chatApi } from "../api/chatApi";
import { chatStream, type ChatStreamEvent } from "../api/chatStream";
import type {
  ChatMessage,
  ContentBlock,
  AgentActionProposedPayload,
} from "../types/chat.types";

/**
 * Delay in milliseconds before transitioning from "completed" to "idle" state.
 * This grace period allows downstream components to process the completion event
 * before state transitions.
 */
const COMPLETION_TRANSITION_DELAY_MS = 50;

/**
 * Streaming status transitions:
 * idle -> connecting -> streaming -> completed
 * idle -> connecting -> streaming -> error
 * idle -> connecting -> error
 */
export type StreamingStatus =
  | "idle"
  | "connecting"
  | "streaming"
  | "completed"
  | "error";

export interface UseChatOptions {
  /** Conversation ID to send messages to */
  conversationId: string;
  /** Callback when a complete message is received */
  onMessage?: (message: ChatMessage) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when streaming starts */
  onStreamStart?: (messageId: string) => void;
  /** Callback for each streaming delta */
  onStreamDelta?: (delta: string) => void;
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
  interrupt: (messageId?: string) => Promise<void>;
  /** Confirm a proposed action */
  confirmAction: (
    actionId: string,
    parameters?: Record<string, unknown>,
  ) => Promise<void>;
  /** Cancel a proposed action */
  cancelAction: (actionId: string) => Promise<void>;
  /** Clear conversation history */
  clearConversation: () => Promise<void>;
  /** Whether a message is currently streaming (connecting or streaming) */
  isStreaming: boolean;
  /** Explicit streaming status */
  status: StreamingStatus;
  /** Whether the agent is thinking/processing */
  isThinking: boolean;
  /** Currently pending action requiring confirmation */
  pendingAction: AgentActionProposedPayload | null;
}

export const useChat = ({
  conversationId,
  onMessage: _onMessage,
  onError,
  onStreamStart,
  onStreamDelta,
  onStreamComplete,
  onActionProposed: _onActionProposed,
}: UseChatOptions): UseChatReturn => {
  const [status, setStatus] = useState<StreamingStatus>("idle");
  const [isThinking, setIsThinking] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<AgentActionProposedPayload | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleStreamEvent = useCallback(
    (event: ChatStreamEvent) => {
      switch (event.type) {
        case "assistant.start":
          setStatus("streaming");
          setIsThinking(false);
          onStreamStart?.(event.messageId);
          break;

        case "assistant.delta":
          setStatus("streaming");
          setIsThinking(false);
          onStreamDelta?.(event.delta);
          break;

        case "assistant.end":
          setStatus("completed");
          setIsThinking(false);
          onStreamComplete?.();
          // Return to idle shortly after completion.
          setTimeout(() => {
            setStatus("idle");
          }, COMPLETION_TRANSITION_DELAY_MS);
          break;

        case "error":
          setStatus("error");
          setIsThinking(false);
          onError?.(new Error(event.message));
          break;
      }
    },
    [onStreamStart, onStreamDelta, onStreamComplete, onError],
  );

  const sendMessageBlocks = useCallback(
    async (content: ContentBlock[]) => {
      if (!conversationId) {
        onError?.(new Error("No conversation ID provided"));
        return;
      }

      // Abort previous stream if any
      abortControllerRef.current?.abort();

      // Reset state for new stream
      setStatus("connecting");
      setIsThinking(true);
      setPendingAction(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // chatStream is fire-and-forget
        chatStream({
          conversationId,
          agentId: "default", // Can be dynamic
          message: content.map((b) => b.value).join("\n"),
          onEvent: handleStreamEvent,
          signal: controller.signal,
        });
      } catch (error) {
        setStatus("error");
        setIsThinking(false);
        onError?.(error as Error);
      }
    },
    [conversationId, handleStreamEvent, onError],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const contentBlocks: ContentBlock[] = [{ type: "text", value: content }];
      return sendMessageBlocks(contentBlocks);
    },
    [sendMessageBlocks],
  );

  const interrupt = useCallback(
    async (messageId?: string) => {
      // Abort the fetch request locally
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;

      // Send interrupt command to backend
      if (conversationId) {
        try {
          await chatApi.interrupt(conversationId, messageId);
        } catch (error) {
          console.error("Failed to send interrupt command:", error);
        }
      }

      // Explicitly transition to idle (or completed/interrupted if we had that state)
      // SPARK says "Abort transitions message to streaming: false"
      setStatus("idle");
      setIsThinking(false);
      // Note: streamingContent is preserved as per SPARK ("Abort does NOT remove partial content")
    },
    [conversationId],
  );

  const confirmAction = useCallback(
    async (actionId: string, parameters?: Record<string, unknown>) => {
      if (!conversationId) return;

      try {
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

  const clearConversation = useCallback(async () => {
    if (!conversationId) return;
    try {
      await chatApi.clearConversation(conversationId);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [conversationId, onError]);

  return {
    sendMessage,
    sendMessageBlocks,
    interrupt,
    confirmAction,
    cancelAction,
    clearConversation,
    isStreaming: status === "connecting" || status === "streaming",
    status,
    isThinking,
    pendingAction,
  };
};
