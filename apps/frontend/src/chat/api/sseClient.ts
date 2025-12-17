/**
 * SSE (Server-Sent Events) Client for Chat Streaming
 *
 * Handles POST requests that return SSE streams for real-time chat updates.
 */

import type { SSEEvent, SSEEventType } from "../types/chat.types";

export interface SSEClientOptions {
  onEvent: (event: SSEEvent) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

/**
 * Creates an SSE stream connection via POST request.
 *
 * Unlike standard EventSource which only supports GET,
 * this uses fetch with ReadableStream to handle POST SSE responses.
 *
 * @returns AbortController to cancel the stream
 */
export const createSSEStream = async (
  url: string,
  body: object,
  token: string | null,
  options: SSEClientOptions,
): Promise<AbortController> => {
  const controller = new AbortController();

  const startStream = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody.message || `HTTP Error: ${response.status}`,
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body available for streaming");
      }

      // Parse SSE stream
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          options.onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEventType = "";
        let currentEventData = "";

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEventType = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            currentEventData = line.slice(5).trim();
          } else if (line === "" && currentEventType && currentEventData) {
            // Empty line signals end of event
            try {
              const parsed = JSON.parse(currentEventData) as Omit<
                SSEEvent,
                "event"
              >;
              const event: SSEEvent = {
                ...parsed,
                event: currentEventType as SSEEventType,
              };
              options.onEvent(event);
            } catch (parseError) {
              console.error("Failed to parse SSE event data:", parseError);
            }
            currentEventType = "";
            currentEventData = "";
          }
        }
      }
    } catch (error) {
      // Don't report abort errors as real errors
      if (error instanceof Error && error.name === "AbortError") {
        options.onComplete();
        return;
      }
      options.onError(error as Error);
    }
  };

  // Start the stream processing (non-blocking)
  startStream();

  return controller;
};
