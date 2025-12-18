/**
 * Chat Streaming Abstraction
 * 
 * Provides a normalized interface for streaming chat events.
 * Fire-and-forget: Caller provides callbacks and an AbortSignal.
 */

import { createSSEStream } from "./sseClient";
import type { SSEEvent } from "../types/chat.types";

export type ChatStreamEvent =
  | { type: "assistant.start"; messageId: string }
  | { type: "assistant.delta"; delta: string }
  | { type: "assistant.end" }
  | { type: "error"; code: string; message: string };

export interface ChatStreamParams {
  conversationId: string;
  agentId: string; // Used by backend to route/configure
  message: string;
  onEvent: (event: ChatStreamEvent) => void;
  signal: AbortSignal;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Initiates a chat stream.
 * 
 * Normalizes backend SSE events into ChatStreamEvents.
 * Handles cleanup via the provided AbortSignal.
 */
export const chatStream = (params: ChatStreamParams): void => {
  const { conversationId, message, onEvent, signal } = params;
  const token = localStorage.getItem("auth_token");

  const body = {
    conversation_id: conversationId,
    message: {
      role: "user",
      content: [{ type: "text", value: message }],
    },
  };

  createSSEStream(`${API_BASE}/v1/chat/stream`, body, token, {
    onEvent: (sseEvent: SSEEvent) => {
      // If signal is aborted, stop emitting events
      if (signal.aborted) return;

      switch (sseEvent.event) {
        case "chat.started":
          {
            const payload =
              sseEvent.payload && typeof sseEvent.payload === "object"
                ? (sseEvent.payload as Record<string, unknown>)
                : undefined;

            const messageIdFromPayload = payload?.message_id;

            onEvent({
              type: "assistant.start",
              messageId:
                sseEvent.message_id ||
                (typeof messageIdFromPayload === "string"
                  ? messageIdFromPayload
                  : ""),
            });
          }
          break;

        case "message.delta":
          {
            // Backend SSE contract: message chunks may be sent as either
            // { delta: string } (preferred, standardized field) or
            // { value: string } (kept for compatibility with legacy emitters).
            // Example observed from legacy backend: payload: { type: "text", value: "¡" }
            // Once all backends emit `delta`, the `value` fallback can be removed.
            const payload =
              sseEvent.payload && typeof sseEvent.payload === "object"
                ? (sseEvent.payload as Record<string, unknown>)
                : undefined;

            const maybeDelta = payload?.delta;
            const maybeValue = payload?.value;

            const delta =
              typeof maybeDelta === "string"
                ? maybeDelta
                : typeof maybeValue === "string"
                  ? maybeValue
                  : "";

            onEvent({
              type: "assistant.delta",
              delta,
            });
          }
          break;

        case "message.completed":
        case "chat.completed":
          // Avoid double ending if both events fire
          onEvent({ type: "assistant.end" });
          break;

        case "chat.failed":
          {
            const payload =
              sseEvent.payload && typeof sseEvent.payload === "object"
                ? (sseEvent.payload as Record<string, unknown>)
                : undefined;

            const code = payload?.code;
            const errorMessage = payload?.error;

            onEvent({
              type: "error",
              code: typeof code === "string" ? code : "STREAM_ERROR",
              message:
                typeof errorMessage === "string"
                  ? errorMessage
                  : "Unknown stream error",
            });
          }
          break;

        default:
          // Ignore control events like agent.thinking for this minimal abstraction
          // or handle them if needed for higher fidelity.
          break;
      }
    },
    onError: (error) => {
      if (signal.aborted) return;
      onEvent({
        type: "error",
        code: "NETWORK_ERROR",
        message: error.message,
      });
    },
    onComplete: () => {
      if (signal.aborted) return;
      onEvent({ type: "assistant.end" });
    },
  });
};
