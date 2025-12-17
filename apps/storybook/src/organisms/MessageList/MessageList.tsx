import { useRef, useEffect } from "react";
import { clsx } from "clsx";
import { MessageItem, type Message } from "../MessageItem";
import { ThinkingIndicator } from "../../molecules/ThinkingIndicator";
import { Avatar } from "../../atoms/Avatar";

export interface MessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** ID of the message currently streaming (if any) */
  streamingMessageId?: string;
  /** Partial content for the streaming message */
  streamingContent?: string;
  /** Whether the agent is currently thinking/processing */
  isThinking?: boolean;
  /** Whether to show streaming response placeholder when message not yet in list */
  showStreamingPlaceholder?: boolean;
  /** Feedback state per message ID */
  feedbackByMessageId?: Record<string, "positive" | "negative" | null>;
  /** Agent display name */
  agentName?: string;
  /** Agent avatar URL */
  agentAvatarUrl?: string;
  /** User display name */
  userName?: string;
  /** User avatar URL */
  userAvatarUrl?: string;
  /** Whether to auto-scroll to the bottom on new messages */
  autoScroll?: boolean;
  /** Whether to show date separators */
  showDateSeparators?: boolean;
  /** Whether to group consecutive messages from the same sender */
  groupConsecutive?: boolean;
  /** Callback when copy is clicked */
  onCopy?: (messageId: string) => void;
  /** Callback when regenerate is clicked */
  onRegenerate?: (messageId: string) => void;
  /** Callback when edit is clicked */
  onEdit?: (messageId: string) => void;
  /** Callback when thumbs up is clicked */
  onThumbsUp?: (messageId: string) => void;
  /** Callback when thumbs down is clicked */
  onThumbsDown?: (messageId: string) => void;
  /** Callback when retry is clicked */
  onRetry?: (messageId: string) => void;
  /** Callback when stop streaming is clicked */
  onStopStreaming?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats a date for display as a separator.
 */
const formatDateSeparator = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

/**
 * Checks if two dates are on different days.
 */
const isDifferentDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() !== date2.toDateString();
};

/**
 * MessageList organism component.
 *
 * Displays a list of messages with optional date separators,
 * message grouping, and auto-scroll functionality.
 */
export const MessageList = ({
  messages,
  streamingMessageId,
  streamingContent,
  isThinking = false,
  showStreamingPlaceholder = true,
  feedbackByMessageId = {},
  agentName = "Echo",
  agentAvatarUrl,
  userName = "You",
  userAvatarUrl,
  autoScroll = true,
  showDateSeparators = true,
  groupConsecutive = true,
  onCopy,
  onRegenerate,
  onEdit,
  onThumbsUp,
  onThumbsDown,
  onRetry,
  onStopStreaming,
  className,
}: MessageListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages, streaming content, or thinking state
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, streamingContent, isThinking, autoScroll]);

  const renderMessages = () => {
    const elements: React.ReactNode[] = [];
    let lastDate: Date | null = null;
    let lastSender: string | null = null;

    // Check if streaming message exists in the messages list
    const streamingMessageExists =
      streamingMessageId &&
      messages.some((msg) => msg.id === streamingMessageId);

    messages.forEach((message, index) => {
      const messageDate =
        typeof message.timestamp === "string"
          ? new Date(message.timestamp)
          : message.timestamp;

      // Date separator
      if (
        showDateSeparators &&
        (!lastDate || isDifferentDay(lastDate, messageDate))
      ) {
        elements.push(
          <DateSeparator key={`date-${message.id}`} date={messageDate} />
        );
      }

      // Check if this is a consecutive message from the same sender
      const isConsecutive =
        groupConsecutive &&
        lastSender === message.role &&
        lastDate &&
        !isDifferentDay(lastDate, messageDate);

      elements.push(
        <MessageItem
          key={message.id}
          message={message}
          isStreaming={message.id === streamingMessageId}
          streamingContent={
            message.id === streamingMessageId ? streamingContent : undefined
          }
          feedback={feedbackByMessageId[message.id]}
          agentName={agentName}
          agentAvatarUrl={agentAvatarUrl}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onThumbsUp={onThumbsUp}
          onThumbsDown={onThumbsDown}
          onRetry={onRetry}
          onStopStreaming={
            message.id === streamingMessageId ? onStopStreaming : undefined
          }
          className={clsx(
            isConsecutive && "mt-1", // Tighter spacing for consecutive messages
            !isConsecutive && index > 0 && "mt-4" // Normal spacing
          )}
        />
      );

      lastDate = messageDate;
      lastSender = message.role;
    });

    // Add streaming message placeholder if streaming but message not in list yet
    if (
      showStreamingPlaceholder &&
      streamingMessageId &&
      !streamingMessageExists
    ) {
      const streamingMessage: Message = {
        id: streamingMessageId,
        role: "agent",
        content: streamingContent || "",
        timestamp: new Date(),
        status: "sent",
      };

      elements.push(
        <MessageItem
          key={`streaming-${streamingMessageId}`}
          message={streamingMessage}
          isStreaming={true}
          streamingContent={streamingContent}
          agentName={agentName}
          agentAvatarUrl={agentAvatarUrl}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          onStopStreaming={onStopStreaming}
          className={messages.length > 0 ? "mt-4" : undefined}
        />
      );
    }

    // Add thinking indicator if agent is thinking but no streaming yet
    if (isThinking && !streamingMessageId && !streamingContent) {
      elements.push(
        <div
          key="thinking-indicator"
          className={clsx("flex gap-3", messages.length > 0 && "mt-4")}
        >
          <div className="flex-shrink-0">
            <Avatar name={agentName} src={agentAvatarUrl} size="sm" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-xs font-medium text-neutral-500 px-1">
              {agentName}
            </span>
            <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
              <ThinkingIndicator label={`${agentName} is thinking`} />
            </div>
          </div>
        </div>
      );
    }

    return elements;
  };

  // Show empty state only if there are no messages and not thinking/streaming
  const showEmptyState =
    messages.length === 0 && !isThinking && !streamingMessageId;

  return (
    <div ref={listRef} className={clsx("flex flex-col", className)}>
      {showEmptyState ? <EmptyState /> : renderMessages()}
      <div ref={bottomRef} />
    </div>
  );
};

/**
 * Date separator between messages.
 */
const DateSeparator = ({ date }: { date: Date }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 h-px bg-neutral-200" />
    <span className="text-xs font-medium text-neutral-500">
      {formatDateSeparator(date)}
    </span>
    <div className="flex-1 h-px bg-neutral-200" />
  </div>
);

/**
 * Empty state when no messages.
 */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
      <span className="text-3xl">💬</span>
    </div>
    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
      Start a conversation
    </h3>
    <p className="text-sm text-neutral-500 max-w-sm">
      Ask me anything about your career, resume, or job search. I'm here to
      help!
    </p>
  </div>
);
