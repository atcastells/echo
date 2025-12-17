import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { clsx } from "clsx";
import { Button } from "../../atoms/Button";
import { Icon } from "../../atoms/Icon";
import { MessageList } from "../../organisms/MessageList";
import { ConversationEmptyState } from "../ConversationEmptyState";
import type { Message } from "../../organisms/MessageItem";
import type { SuggestedPrompt } from "../ConversationEmptyState";

export interface ConversationViewportProps {
  /** Array of messages to display */
  messages: Message[];
  /** ID of the message currently streaming */
  streamingMessageId?: string;
  /** Partial content for streaming message */
  streamingContent?: string;
  /** Whether the agent is currently thinking */
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
  /** Whether to auto-scroll to bottom */
  autoScroll?: boolean;
  /** Suggested prompts for empty state */
  suggestedPrompts?: SuggestedPrompt[];
  /** Callback when a suggested prompt is clicked */
  onPromptClick?: (prompt: SuggestedPrompt) => void;
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
  /** Custom empty state component */
  emptyState?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const SCROLL_THRESHOLD = 100; // px from bottom to consider "at bottom"

/**
 * ConversationViewport template component.
 *
 * A scroll container for the conversation with auto-scroll,
 * new messages indicator, and empty state handling.
 */
export const ConversationViewport = ({
  messages,
  streamingMessageId,
  streamingContent,
  isThinking = false,
  showStreamingPlaceholder = true,
  feedbackByMessageId,
  agentName = "Echo",
  agentAvatarUrl,
  userName = "You",
  userAvatarUrl,
  autoScroll = true,
  suggestedPrompts,
  onPromptClick,
  onCopy,
  onRegenerate,
  onEdit,
  onThumbsUp,
  onThumbsDown,
  onRetry,
  onStopStreaming,
  emptyState,
  className,
}: ConversationViewportProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const previousMessageCount = useRef(messages.length);
  const hasNewMessagesRef = useRef(false);

  // Check if user is at bottom of scroll
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setIsAtBottom(distanceFromBottom < SCROLL_THRESHOLD);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, [checkScrollPosition]);
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      hasNewMessagesRef.current = false;
      setHasNewMessages(false);
    }
  }, []);
  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > previousMessageCount.current) {
      if (isAtBottom && autoScroll) {
        queueMicrotask(() => {
          scrollToBottom();
        });
      } else {
        queueMicrotask(() => {
          hasNewMessagesRef.current = true;
          setHasNewMessages(true);
        });
      }
    }
    previousMessageCount.current = messages.length;
  }, [messages.length, isAtBottom, autoScroll, scrollToBottom]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (streamingContent && isAtBottom && autoScroll) {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [streamingContent, isAtBottom, autoScroll]);

  // Auto-scroll when thinking starts
  useEffect(() => {
    if (isThinking && isAtBottom && autoScroll) {
      queueMicrotask(() => {
        scrollToBottom();
      });
    }
  }, [isThinking, isAtBottom, autoScroll, scrollToBottom]);

  const isEmpty = messages.length === 0 && !isThinking;

  return (
    <div className={clsx("relative flex flex-col h-full", className)}>
      {/* Scrollable content */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
        {isEmpty ? (
          (emptyState ?? (
            <ConversationEmptyState
              agentName={agentName}
              suggestedPrompts={suggestedPrompts}
              onPromptClick={onPromptClick}
            />
          ))
        ) : (
          <div className="max-w-3xl mx-auto">
            <MessageList
              messages={messages}
              streamingMessageId={streamingMessageId}
              streamingContent={streamingContent}
              isThinking={isThinking}
              showStreamingPlaceholder={showStreamingPlaceholder}
              feedbackByMessageId={feedbackByMessageId}
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
              onStopStreaming={onStopStreaming}
              autoScroll={false} // We handle scrolling at the viewport level
            />
          </div>
        )}
      </div>

      {/* New messages indicator */}
      {hasNewMessages && !isAtBottom && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <Button
            variant="primary"
            size="sm"
            onClick={scrollToBottom}
            leadingIcon={<Icon name="chevron-down" size="sm" />}
            className="shadow-lg"
          >
            New messages
          </Button>
        </div>
      )}
    </div>
  );
};
