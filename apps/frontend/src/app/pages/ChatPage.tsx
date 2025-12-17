/**
 * ChatPage
 *
 * Main chat interface integrating Storybook's ConversationApp component
 * with the Chat API and state management.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConversationApp } from "@echo/storybook";
import type { Message, ConversationData, SuggestedPrompt } from "@echo/storybook";
import { useAuth } from "@/auth";
import {
  useConversations,
  useConversationMessages,
  useCreateConversation,
  useInvalidateMessages,
  useChat,
} from "@/chat";
import type { ChatMessage } from "@/chat";

// Default agent ID - can be made configurable via env or user selection
const DEFAULT_AGENT_ID = import.meta.env.VITE_DEFAULT_AGENT_ID || "default";

// Suggested prompts for empty state
const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: "1",
    icon: "💬",
    title: "Start a conversation",
    description: "Ask me anything to get started",
  },
  {
    id: "2",
    icon: "📝",
    title: "Help me write",
    description: "Draft emails, documents, or creative content",
  },
  {
    id: "3",
    icon: "💡",
    title: "Brainstorm ideas",
    description: "Explore new concepts and possibilities",
  },
  {
    id: "4",
    icon: "🔍",
    title: "Analyze something",
    description: "Break down complex topics or data",
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

  // Query hooks
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch: refetchConversations,
  } = useConversations(DEFAULT_AGENT_ID);

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationMessages(conversationId || "");

  const createConversation = useCreateConversation();
  const invalidateMessages = useInvalidateMessages();

  // Chat streaming hook
  const {
    sendMessage,
    interrupt,
    isStreaming,
    streamingContent,
    streamingMessageId,
    isThinking,
  } = useChat({
    conversationId: conversationId || "",
    onMessage: () => {
      // Refetch messages when a complete message is received
      if (conversationId) {
        invalidateMessages(conversationId);
        refetchMessages();
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      // TODO: Show toast notification
    },
  });

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!conversationId && conversations.length > 0 && !isLoadingConversations) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, isLoadingConversations, navigate]);

  // Transform backend messages to Storybook format
  const transformedMessages: Message[] = useMemo(() => {
    return messages.map((msg: ChatMessage) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content.map((block) => block.value).join("\n"),
      timestamp: new Date(msg.createdAt),
      status: msg.status === "failed" ? ("error" as const) : ("sent" as const),
    }));
  }, [messages]);

  // Transform conversations to Storybook format
  const transformedConversations: ConversationData[] = useMemo(() => {
    return conversations.map((conv) => ({
      id: conv.id,
      title: conv.title || "New Conversation",
      lastMessage: "",
      timestamp: new Date(conv.updatedAt),
      unread: false,
    }));
  }, [conversations]);

  // Handlers
  const handleSelectConversation = useCallback(
    (id: string) => {
      navigate(`/chat/${id}`);
    },
    [navigate],
  );

  const handleDeleteConversation = useCallback((id: string) => {
    // TODO: Implement delete conversation API call
    console.log("Delete conversation:", id);
  }, []);

  const handleNewConversation = useCallback(async () => {
    try {
      const newConv = await createConversation.mutateAsync({
        agent_id: DEFAULT_AGENT_ID,
      });
      navigate(`/chat/${newConv.id}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  }, [createConversation, navigate]);

  const handleRetryLoadConversations = useCallback(() => {
    refetchConversations();
  }, [refetchConversations]);

  const handleComposerSubmit = useCallback(
    (message: string) => {
      if (!conversationId || !message.trim()) return;
      sendMessage(message);
      setComposerValue("");
    },
    [conversationId, sendMessage],
  );

  const handlePromptClick = useCallback(
    (prompt: SuggestedPrompt) => {
      if (!conversationId) {
        // Create new conversation first
        handleNewConversation().then(() => {
          setComposerValue(prompt.description || prompt.title);
        });
      } else {
        setComposerValue(prompt.description || prompt.title);
      }
    },
    [conversationId, handleNewConversation],
  );

  const handleCopy = useCallback((messageId: string) => {
    const message = messages.find((m: ChatMessage) => m.id === messageId);
    if (message) {
      const content = message.content.map((block) => block.value).join("\n");
      navigator.clipboard.writeText(content);
    }
  }, [messages]);

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
      const messageIndex = messages.findIndex(
        (m: ChatMessage) => m.id === messageId,
      );
      if (messageIndex > 0) {
        const prevMessage = messages[messageIndex - 1];
        if (prevMessage.role === "user") {
          const content = prevMessage.content.map((b) => b.value).join("\n");
          sendMessage(content);
        }
      }
    },
    [messages, sendMessage],
  );

  // Determine agent status
  const agentStatus = isThinking
    ? ("thinking" as const)
    : isStreaming
      ? ("typing" as const)
      : ("available" as const);

  return (
    <ConversationApp
      // Conversation data
      conversations={transformedConversations}
      activeConversationId={conversationId}
      messages={transformedMessages}
      // Loading states
      isLoadingConversations={isLoadingConversations || isLoadingMessages}
      conversationsError={conversationsError?.message}
      // Streaming state
      streamingMessageId={streamingMessageId || undefined}
      streamingContent={streamingContent}
      feedbackByMessageId={feedbackByMessageId}
      // Agent info
      agentName="Echo"
      agentRole="AI Assistant"
      agentStatus={agentStatus}
      // User info
      userName={user?.email || "You"}
      // Composer state
      composerValue={composerValue}
      suggestedPrompts={SUGGESTED_PROMPTS}
      // Conversation callbacks
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
      onNewConversation={handleNewConversation}
      onRetryLoadConversations={handleRetryLoadConversations}
      // Composer callbacks
      onComposerChange={setComposerValue}
      onComposerSubmit={handleComposerSubmit}
      onStopStreaming={interrupt}
      onPromptClick={handlePromptClick}
      // Message callbacks
      onCopy={handleCopy}
      onRegenerate={handleRegenerate}
      onThumbsUp={handleThumbsUp}
      onThumbsDown={handleThumbsDown}
    />
  );
};
