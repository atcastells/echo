import { describe, it, expect, vi, beforeEach } from "vitest";
import { chatStream } from "./chatStream";
import * as sseClient from "./sseClient";

vi.mock("./sseClient", () => ({
  createSSEStream: vi.fn(),
}));

describe("chatStream", () => {
  const mockOnEvent = vi.fn();
  const controller = new AbortController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should normalize chat.started event", async () => {
    const mockCreateStream = vi.mocked(sseClient.createSSEStream);

    chatStream({
      conversationId: "conv-1",
      agentId: "agent-1",
      message: "hello",
      onEvent: mockOnEvent,
      signal: controller.signal,
    });

    const handlers = mockCreateStream.mock.calls[0][3];

    handlers.onEvent({
      event: "chat.started",
      conversation_id: "conv-1",
      message_id: "msg-123",
      payload: {},
    });

    expect(mockOnEvent).toHaveBeenCalledWith({
      type: "assistant.start",
      messageId: "msg-123",
    });
  });

  it("should normalize message.delta event", () => {
    const mockCreateStream = vi.mocked(sseClient.createSSEStream);

    chatStream({
      conversationId: "conv-1",
      agentId: "agent-1",
      message: "hello",
      onEvent: mockOnEvent,
      signal: controller.signal,
    });

    const handlers = mockCreateStream.mock.calls[0][3];

    handlers.onEvent({
      event: "message.delta",
      conversation_id: "conv-1",
      payload: { delta: " world" },
    });

    expect(mockOnEvent).toHaveBeenCalledWith({
      type: "assistant.delta",
      delta: " world",
    });
  });

  it("should handle reach assistant.end via onComplete", () => {
    const mockCreateStream = vi.mocked(sseClient.createSSEStream);

    chatStream({
      conversationId: "conv-1",
      agentId: "agent-1",
      message: "hello",
      onEvent: mockOnEvent,
      signal: controller.signal,
    });

    const handlers = mockCreateStream.mock.calls[0][3];
    handlers.onComplete();

    expect(mockOnEvent).toHaveBeenCalledWith({ type: "assistant.end" });
  });

  it("should handle error event", () => {
    const mockCreateStream = vi.mocked(sseClient.createSSEStream);

    chatStream({
      conversationId: "conv-1",
      agentId: "agent-1",
      message: "hello",
      onEvent: mockOnEvent,
      signal: controller.signal,
    });

    const handlers = mockCreateStream.mock.calls[0][3];
    handlers.onEvent({
      event: "chat.failed",
      conversation_id: "conv-1",
      payload: { error: "something went wrong", code: "ERR123" },
    });

    expect(mockOnEvent).toHaveBeenCalledWith({
      type: "error",
      code: "ERR123",
      message: "something went wrong",
    });
  });

  it("should not emit events after signal is aborted", () => {
    const mockCreateStream = vi.mocked(sseClient.createSSEStream);
    const abortController = new AbortController();

    chatStream({
      conversationId: "conv-1",
      agentId: "agent-1",
      message: "hello",
      onEvent: mockOnEvent,
      signal: abortController.signal,
    });

    const handlers = mockCreateStream.mock.calls[0][3];

    abortController.abort();

    handlers.onEvent({
      event: "message.delta",
      conversation_id: "conv-1",
      payload: { delta: "skip me" },
    });

    expect(mockOnEvent).not.toHaveBeenCalled();
  });
});
