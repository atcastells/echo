/**
 * ChatPage
 *
 * Main chat interface built from Storybook components
 * wired to the Chat API and app state.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { ConfirmModal, Sidebar, MainPanel } from "@echo/storybook";
import type {
  Message,
  ConversationData,
  SuggestedPrompt,
} from "@echo/storybook";
import { useAuth } from "@/auth";
import { useDefaultAgent } from "@/agents";
import {
  useConversations,
  useConversationMessages,
  useCreateConversation,
  useInvalidateMessages,
  useChat,
  type ContentBlockType,
  type MessageStatus,
} from "@/chat";
import type { ChatMessage } from "@/chat";

// Suggested prompts for empty state
const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "1",
    icon: "chat-bubble-left-right",
    text: "Start a conversation",
    category: "General",
  },
  {
    id: "2",
    icon: "document",
    text: "Help me write",
    category: "Writing",
  },
  {
    id: "3",
    icon: "sparkles",
    text: "Brainstorm ideas",
    category: "Creative",
  },
  {
    id: "4",
    icon: "pencil",
    text: "Analyze something",
    category: "Analysis",
  },
];

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Local state
  const [composerValue, setComposerValue] = useState("");
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, "positive" | "negative" | null>
  >({});
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch default agent
  const {
    data: defaultAgent,
    isLoading: isLoadingAgent,
    error: agentError,
  } = useDefaultAgent();

  const agentId = defaultAgent?.id;

  // Query hooks
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations(agentId || "");

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationMessages(conversationId || "");

  const createConversation = useCreateConversation();
  const invalidateMessages = useInvalidateMessages();

  const refreshMessages = useCallback(async () => {
    if (conversationId) {
      invalidateMessages(conversationId);
      await refetchMessages();
    }
  }, [conversationId, invalidateMessages, refetchMessages]);

  // Track the currently streaming assistant message id.
  // We create a local placeholder immediately, then rename it to the server id
  // once we receive chat.started.
  const activeStreamTempIdRef = useRef<string | null>(null);
  const activeStreamMessageIdRef = useRef<string | null>(null);

  // Chat streaming hook
  const {
    sendMessage,
    interrupt,
    confirmAction,
    cancelAction,
    isThinking,
    pendingAction,
    clearConversation,
    isStreaming,
  } = useChat({
    conversationId: conversationId || "",
    onStreamStart: (serverMessageId) => {
      const tempId = activeStreamTempIdRef.current;
      if (!tempId) {
        // No optimistic placeholder was created beforehand; create one now
        // so that streaming deltas can append content to this assistant message.
        setOptimisticMessages((prev) => [
          ...prev,
          {
            id: serverMessageId,
            conversationId: conversationId || "",
            role: "assistant",
            content: [{ type: "text" as ContentBlockType, value: "" }],
            status: "streaming" as MessageStatus,
            createdAt: new Date().toISOString(),
          } as ChatMessage,
        ]);
        activeStreamMessageIdRef.current = serverMessageId;
        return;
      }

      // Rename local placeholder to server id so it matches persisted messages.
      setOptimisticMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                id: serverMessageId,
              }
            : msg,
        ),
      );

      activeStreamMessageIdRef.current = serverMessageId;
      activeStreamTempIdRef.current = null;
    },
    onStreamDelta: (delta) => {
      const targetId =
        activeStreamMessageIdRef.current || activeStreamTempIdRef.current;
      if (!targetId) return;

      setOptimisticMessages((prev) => {
        let found = false;

        const updatedMessages = prev.map((msg) => {
          if (msg.id !== targetId) return msg;
          if (msg.role !== "assistant") return msg;

          // Robustly access message content, handling potential missing or malformed data
          const existingText =
            typeof msg.content?.[0]?.value === "string"
              ? msg.content[0].value
              : (msg.content ?? [])
                  .map((part: { value?: unknown }) =>
                    typeof part.value === "string" ? part.value : "",
                  )
                  .join("");

          found = true;
          return {
            ...msg,
            content: [
              { type: "text" as ContentBlockType, value: existingText + delta },
            ],
            status: "streaming" as MessageStatus,
          };
        });

        // If the message doesn't exist yet, create it
        if (!found) {
          const newMessage: ChatMessage = {
            id: targetId,
            conversationId: conversationId || "",
            role: "assistant",
            content: [{ type: "text" as ContentBlockType, value: delta }],
            status: "streaming" as MessageStatus,
            createdAt: new Date().toISOString(),
          };

          return [...updatedMessages, newMessage];
        }

        return updatedMessages;
      });
    },
    onStreamComplete: () => {
      const targetId =
        activeStreamMessageIdRef.current || activeStreamTempIdRef.current;

      if (targetId) {
        setOptimisticMessages((prev) =>
          prev.map((msg) =>
            msg.id === targetId
              ? {
                  ...msg,
                  status: "complete" as MessageStatus,
                }
              : msg,
          ),
        );
      }

      activeStreamMessageIdRef.current = null;
      activeStreamTempIdRef.current = null;

      void refreshMessages();
    },
    onError: (error) => {
      console.error("Chat error:", error);
      // TODO: Show toast notification

      const targetId =
        activeStreamMessageIdRef.current || activeStreamTempIdRef.current;
      if (targetId) {
        setOptimisticMessages((prev) =>
          prev.map((msg) =>
            msg.id === targetId
              ? {
                  ...msg,
                  status: "failed" as MessageStatus,
                }
              : msg,
          ),
        );
      }
    },
  });

  // Responsive layout: collapse sidebar on small screens
  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.("(max-width: 1024px)");
    if (!mediaQuery) return;

    const syncLayout = () => {
      const matches = mediaQuery.matches;
      setIsMobile(matches);
      setSidebarOpen(!matches);
      setSidebarCollapsed(false);
    };

    syncLayout();

    const listener = () => syncLayout();
    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (
      !conversationId &&
      conversations.length > 0 &&
      !isLoadingConversations
    ) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, isLoadingConversations, navigate]);

  // Filter optimistic messages that are already persisted (prevents duplicates).
  const persistedMessageIds = useMemo(
    () => new Set(messages.map((m: ChatMessage) => m.id)),
    [messages],
  );

  const visibleOptimisticMessages = useMemo(
    () => optimisticMessages.filter((m) => !persistedMessageIds.has(m.id)),
    [optimisticMessages, persistedMessageIds],
  );

  // Transform backend messages to Storybook format (canonical: streaming is a message)
  const transformedMessages: Message[] = useMemo(() => {
    const combined = [...messages, ...visibleOptimisticMessages];

    const mapped = combined.map((msg: ChatMessage) => {
      let status: Message["status"] = "sent";
      if (msg.status === "streaming") status = "streaming";
      if (msg.status === "failed") status = "failed";

      return {
        id: msg.id,
        role:
          msg.role === "assistant"
            ? "agent"
            : (msg.role as "user" | "system" | "agent"),
        content: msg.content.map((block) => block.value).join("\n"),
        timestamp: new Date(msg.createdAt),
        status,
      };
    });

    return mapped;
  }, [messages, visibleOptimisticMessages]);

  // Prune optimistic messages that are now persisted (keeps memory bounded)
  useEffect(() => {
    queueMicrotask(() => {
      setOptimisticMessages((prev) => {
        if (prev.length === 0) return prev;
        if (persistedMessageIds.size === 0) return prev;

        return prev.filter(
          (m) => m.status === "streaming" || !persistedMessageIds.has(m.id),
        );
      });
    });
  }, [persistedMessageIds]);

  // Transform conversations to Storybook format
  const transformedConversations: ConversationData[] = useMemo(() => {
    return conversations.map((conv) => ({
      id: conv.id,
      title: conv.title || "New Conversation",
      lastMessagePreview: "",
      timestamp: new Date(conv.updatedAt),
      hasUnread: false,
    }));
  }, [conversations]);

  const activeConversation = useMemo(
    () => transformedConversations.find((conv) => conv.id === conversationId),
    [conversationId, transformedConversations],
  );

  const toErrorMessage = (error: unknown): string | undefined => {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "Something went wrong";
  };

  const agentErrorMessage = toErrorMessage(agentError);
  const sidebarError = toErrorMessage(conversationsError) || agentErrorMessage;

  // Handlers
  const handleSelectConversation = useCallback(
    (id: string) => {
      navigate(`/chat/${id}`);
      if (isMobile) {
        setSidebarOpen(false);
      }
    },
    [navigate, isMobile],
  );

  const handleDeleteConversation = useCallback((id: string) => {
    // TODO: Implement delete conversation API call
    console.log("Delete conversation:", id);
  }, []);

  const handleNewConversation = useCallback(async () => {
    if (!agentId) {
      console.error("No agent available to create conversation");
      return;
    }
    try {
      const newConv = await createConversation.mutateAsync({
        agent_id: agentId,
      });
      navigate(`/chat/${newConv.id}`);
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  }, [createConversation, navigate, agentId, isMobile]);

  const handleRetryLoadConversations = useCallback(() => {
    refetchConversations();
  }, [refetchConversations]);

  // Async function to properly await interrupt before starting new stream,
  // preventing race conditions when user sends messages in quick succession
  const handleComposerSubmit = useCallback(
    async (message: string) => {
      if (!conversationId || !message.trim()) return;

      // If something is currently streaming, finalize partial content and abort.
      const activeId = activeStreamMessageIdRef.current;
      if (activeId) {
        setOptimisticMessages((prev) =>
          prev.map((m) =>
            m.id === activeId && m.status === "streaming"
              ? { ...m, status: "complete" as MessageStatus }
              : m,
          ),
        );
        // Wait for interrupt to complete before starting new stream
        await interrupt(activeId);
        activeStreamMessageIdRef.current = null;
        activeStreamTempIdRef.current = null;
      }

      const now = new Date().toISOString();
      const optimisticMessage: ChatMessage = {
        id: `temp-${now}`,
        conversationId,
        role: "user",
        content: [{ type: "text" as ContentBlockType, value: message }],
        status: "complete" as MessageStatus,
        createdAt: now,
      };

      // Pre-create empty assistant message for streaming to provide UI layout stability
      // and ensure a placeholder exists before first delta arrives
      const assistantTempId = `temp-assistant-${now}`;
      const optimisticAssistant: ChatMessage = {
        id: assistantTempId,
        conversationId,
        role: "assistant",
        content: [{ type: "text" as ContentBlockType, value: "" }],
        status: "streaming" as MessageStatus,
        createdAt: now,
      };

      // Only set temp ID ref; messageIdRef will be set when server confirms ID
      activeStreamTempIdRef.current = assistantTempId;

      setOptimisticMessages((prev) => [
        ...prev,
        optimisticMessage,
        optimisticAssistant,
      ]);
      setComposerValue("");

      sendMessage(message).catch((error) => {
        console.error("Failed to send message:", error);
        setOptimisticMessages((prev) =>
          prev.filter(
            (msg) =>
              msg.id !== optimisticMessage.id && msg.id !== assistantTempId,
          ),
        );
      });
    },
    [conversationId, sendMessage, interrupt],
  );

  const handlePromptClick = useCallback(
    (prompt: SuggestedPrompt) => {
      if (!conversationId) {
        // Create new conversation first
        handleNewConversation().then(() => {
          setComposerValue(prompt.text);
        });
      } else {
        setComposerValue(prompt.text);
      }
    },
    [conversationId, handleNewConversation],
  );

  const handleCopy = useCallback(
    (messageId: string) => {
      const message = [...messages, ...visibleOptimisticMessages].find(
        (m: ChatMessage) => m.id === messageId,
      );
      if (message) {
        const content = message.content.map((block) => block.value).join("\n");
        navigator.clipboard.writeText(content);
      }
    },
    [messages, visibleOptimisticMessages],
  );

  const handleThumbsUp = useCallback((messageId: string) => {
    setFeedbackByMessageId((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === "positive" ? null : "positive",
    }));
    // TODO: Send feedback to backend
  }, []);

  const handleThumbsDown = useCallback((messageId: string) => {
    setFeedbackByMessageId((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === "negative" ? null : "negative",
    }));
    // TODO: Send feedback to backend
  }, []);

  const handleRegenerate = useCallback(
    (messageId: string) => {
      // Find the user message before this assistant message and resend
      const combined = [...messages, ...visibleOptimisticMessages];
      const messageIndex = combined.findIndex(
        (m: ChatMessage) => m.id === messageId,
      );
      if (messageIndex > 0) {
        const prevMessage = combined[messageIndex - 1];
        if (prevMessage.role === "user") {
          const content = prevMessage.content.map((b) => b.value).join("\n");
          sendMessage(content);
        }
      }
    },
    [messages, visibleOptimisticMessages, sendMessage],
  );

  const handleConfirmAction = useCallback(() => {
    if (pendingAction) {
      confirmAction(pendingAction.action_id);
    }
  }, [pendingAction, confirmAction]);

  const handleCancelAction = useCallback(() => {
    if (pendingAction) {
      cancelAction(pendingAction.action_id);
    }
  }, [pendingAction, cancelAction]);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  // Determine agent status and UI state
  const hasStreamingMessage = useMemo(
    () =>
      [...messages, ...visibleOptimisticMessages].some(
        (m: ChatMessage) => m.status === "streaming",
      ),
    [messages, visibleOptimisticMessages],
  );

  const agentStatus = isThinking || hasStreamingMessage ? "busy" : "available";

  const isComposerDisabled = hasStreamingMessage || isThinking || !agentId;

  // Combine loading states
  const isLoading =
    isLoadingAgent || isLoadingConversations || isLoadingMessages;

  // Clear Conversation Logic
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleClearClick = useCallback(() => {
    setIsClearModalOpen(true);
  }, []);

  const handleConfirmClear = useCallback(async () => {
    if (!conversationId) return;
    try {
      if (isStreaming) {
        // Guardrail: abort stream before clearing
        await interrupt();
        activeStreamMessageIdRef.current = null;
        activeStreamTempIdRef.current = null;
      }

      await clearConversation();
      invalidateMessages(conversationId);
      setIsClearModalOpen(false);
    } catch (error) {
      console.error("Failed to clear conversation", error);
      // TODO: Show toast
      setIsClearModalOpen(false);
    }
  }, [
    conversationId,
    clearConversation,
    invalidateMessages,
    isStreaming,
    interrupt,
  ]);

  return (
    <div className="relative flex h-screen bg-neutral-50">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={clsx(
          isMobile
            ? "fixed inset-y-0 left-0 z-50 transition-transform duration-300"
            : "relative shrink-0",
          isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full"),
        )}
      >
        <Sidebar
          conversations={transformedConversations}
          activeConversationId={conversationId}
          isLoading={isLoading}
          error={sidebarError}
          isCollapsed={!isMobile && sidebarCollapsed}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewConversation={handleNewConversation}
          onRetry={handleRetryLoadConversations}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      <div className="flex-1 min-w-0">
        <MainPanel
          messages={transformedMessages}
          isThinking={isThinking}
          feedbackByMessageId={feedbackByMessageId}
          agentName={defaultAgent?.name || "Echo"}
          agentRole="AI Assistant"
          agentStatus={agentStatus}
          userName={user?.email || "You"}
          conversationTitle={activeConversation?.title}
          isComposerDisabled={isComposerDisabled}
          composerValue={composerValue}
          suggestedPrompts={SUGGESTED_PROMPTS}
          showSidebarToggle={true}
          sidebarOpen={isMobile ? sidebarOpen : !sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          onComposerChange={setComposerValue}
          onComposerSubmit={handleComposerSubmit}
          onStopStreaming={() => {
            // Find the streaming message directly from state for better reliability
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.status === "streaming"
                  ? { ...m, status: "complete" as MessageStatus }
                  : m,
              ),
            );

            const activeId = activeStreamMessageIdRef.current;
            void interrupt(activeId || undefined);
            activeStreamMessageIdRef.current = null;
            activeStreamTempIdRef.current = null;
          }}
          onPromptClick={handlePromptClick}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          onThumbsUp={handleThumbsUp}
          onThumbsDown={handleThumbsDown}
          onClear={handleClearClick}
        />
      </div>

      {pendingAction && (
        <ConfirmModal
          isOpen={true}
          onClose={handleCancelAction}
          onConfirm={handleConfirmAction}
          title="Confirm Action"
          message={pendingAction.description}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          variant="default"
        />
      )}

      {isClearModalOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
          title="Clear conversation?"
          message={
            isStreaming
              ? "This will stop the current response and clear the conversation."
              : "This will remove all messages and reset the agent’s context. This action can’t be undone."
          }
          confirmLabel="Clear"
          cancelLabel="Cancel"
          variant="danger"
        />
      )}
    </div>
  );
};
