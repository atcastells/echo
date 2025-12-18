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

  let currentEventType: string | null = null;
  const currentDataLines: string[] = [];

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
        throw new Error(errorBody.message || `HTTP Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body available for streaming");
      }

      // Parse SSE stream
      // Supports:
      // - Standard SSE: `event: <type>` + `data: <json>` + blank line
      // - Data-only SSE (backend-embedded event): `data: {"event":"...", ...}` + blank line
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

        for (const line of lines) {
          if (line.startsWith("event:")) {
            currentEventType = line.slice(6).trim();
            continue;
          }

          if (line.startsWith("data:")) {
            currentDataLines.push(line.slice(5).trim());
            continue;
          }

          // Empty line signals end of event
          if (line === "" && currentDataLines.length > 0) {
            const json = currentDataLines.join("\n");
            try {
              const parsed = JSON.parse(json) as Partial<SSEEvent> & {
                event?: string;
              };

              const embeddedEvent = parsed.event;
              const eventType = (currentEventType || embeddedEvent) as
                | SSEEventType
                | undefined;

              if (!eventType) {
                // If no event type, ignore.
                currentEventType = null;
                currentDataLines.length = 0;
                continue;
              }

              const event: SSEEvent = {
                ...(parsed as Omit<SSEEvent, "event">),
                event: eventType,
              };

              options.onEvent(event);
            } catch (parseError) {
              console.error("Failed to parse SSE event data:", parseError);
            }

            currentEventType = null;
            currentDataLines.length = 0;
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
