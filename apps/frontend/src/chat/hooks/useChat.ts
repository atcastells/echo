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
}

export interface UseChatReturn {
  /** Send a text message */
  sendMessage: (content: string) => Promise<void>;
  /** Send a message with content blocks */
  sendMessageBlocks: (content: ContentBlock[]) => Promise<void>;
  /** Interrupt the current streaming response */
  interrupt: () => Promise<void>;
  /** Whether a message is currently streaming */
  isStreaming: boolean;
  /** Current streaming content (partial response) */
  streamingContent: string;
  /** ID of the message currently being streamed */
  streamingMessageId: string | null;
  /** Whether the agent is thinking/processing */
  isThinking: boolean;
}

export const useChat = ({
  conversationId,
  onMessage,
  onError,
  onStreamStart,
  onStreamComplete,
}: UseChatOptions): UseChatReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSSEEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.event) {
        case "chat.started": {
          const startPayload = event.payload as unknown as ChatStartedPayload;
          setStreamingMessageId(startPayload.message_id || event.message_id || null);
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
          break;

        case "agent.action.proposed":
          // TODO: Handle action confirmation flow
          console.log("Action proposed:", event.payload);
          break;

        default:
          // Log unhandled events for debugging
          console.debug("Unhandled SSE event:", event.event, event.payload);
      }
    },
    [onMessage, onError, onStreamStart, onStreamComplete],
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
        await chatApi.interrupt(conversationId, streamingMessageId || undefined);
      } catch (error) {
        console.error("Failed to send interrupt command:", error);
      }
    }

    // Reset state
    setIsStreaming(false);
    setIsThinking(false);
    setStreamingContent("");
    setStreamingMessageId(null);
  }, [conversationId, streamingMessageId]);

  return {
    sendMessage,
    sendMessageBlocks,
    interrupt,
    isStreaming,
    streamingContent,
    streamingMessageId,
    isThinking,
  };
};
