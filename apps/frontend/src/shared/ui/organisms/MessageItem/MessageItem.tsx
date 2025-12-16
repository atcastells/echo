import { clsx } from 'clsx';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import {
  MessageBubble,
  type MessageBubbleCitation,
} from '../../molecules/MessageBubble';
import { MessageMeta, type MessageStatus } from '../../molecules/MessageMeta';
import { MessageActions } from '../../molecules/MessageActions';
import { StreamingIndicator } from '../../molecules/StreamingIndicator';

export interface Message {
  /** Unique message identifier */
  id: string;
  /** Message content */
  content: string;
  /** Message sender type */
  role: 'user' | 'agent' | 'system';
  /** Timestamp of the message */
  timestamp: Date | string;
  /** Whether the content is in Markdown format */
  isMarkdown?: boolean;
  /** Citations/references for agent messages */
  citations?: MessageBubbleCitation[];
  /** Message delivery status */
  status?: MessageStatus;
  /** Error message if failed */
  error?: string;
  /** Cost of the AI response */
  cost?: string;
  /** Latency of the response in milliseconds */
  latencyMs?: number;
}

export interface MessageItemProps {
  /** The message data to display */
  message: Message;
  /** Whether the message is currently streaming */
  isStreaming?: boolean;
  /** Partial content for streaming messages */
  streamingContent?: string;
  /** Current feedback state */
  feedback?: 'positive' | 'negative' | null;
  /** Agent display name (for agent messages) */
  agentName?: string;
  /** Agent avatar URL */
  agentAvatarUrl?: string;
  /** User display name */
  userName?: string;
  /** User avatar URL */
  userAvatarUrl?: string;
  /** Whether to show message actions */
  showActions?: boolean;
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
  /** Callback when retry is clicked (for failed messages) */
  onRetry?: (messageId: string) => void;
  /** Callback when stop streaming is clicked */
  onStopStreaming?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MessageItem organism component.
 *
 * A complete message display that composes MessageBubble, MessageMeta,
 * and MessageActions with proper layout for user, agent, and system messages.
 */
export const MessageItem = ({
  message,
  isStreaming = false,
  streamingContent,
  feedback,
  agentName = 'Echo',
  agentAvatarUrl,
  userName = 'You',
  userAvatarUrl,
  showActions = true,
  onCopy,
  onRegenerate,
  onEdit,
  onThumbsUp,
  onThumbsDown,
  onRetry,
  onStopStreaming,
  className,
}: MessageItemProps) => {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';
  const hasError = !!message.error;

  // System messages have a simpler layout
  if (isSystem) {
    return (
      <div className={clsx('flex justify-center py-2', className)}>
        <MessageBubble
          content={message.content}
          variant="system"
          isMarkdown={message.isMarkdown}
          className="max-w-lg"
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          name={isUser ? userName : agentName}
          src={isUser ? userAvatarUrl : agentAvatarUrl}
          size="sm"
        />
      </div>

      {/* Message content */}
      <div
        className={clsx(
          'flex flex-col gap-1 max-w-[75%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender name */}
        <span className="text-xs font-medium text-neutral-500 px-1">
          {isUser ? userName : agentName}
        </span>

        {/* Message bubble */}
        {isStreaming && isAgent ? (
          <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-prose">
            <StreamingIndicator
              partialContent={streamingContent}
              showTyping={true}
              showStopButton={!!onStopStreaming}
              onStop={onStopStreaming}
              label={`${agentName} is typing`}
            />
          </div>
        ) : (
          <MessageBubble
            content={message.content}
            variant={isUser ? 'user' : 'agent'}
            isMarkdown={message.isMarkdown}
            citations={message.citations}
          />
        )}

        {/* Error state with retry */}
        {hasError && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-error-600 flex items-center gap-1">
              <Icon name="exclamation-circle" size="sm" />
              {message.error}
            </span>
            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRetry(message.id)}
                className="text-error-600"
              >
                Retry
              </Button>
            )}
          </div>
        )}

        {/* Meta and actions row */}
        {!isStreaming && (
          <div
            className={clsx(
              'flex items-center gap-2',
              isUser ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <MessageMeta
              timestamp={message.timestamp}
              status={message.status}
              cost={isAgent ? message.cost : undefined}
              latencyMs={isAgent ? message.latencyMs : undefined}
            />

            {showActions && !hasError && (
              <MessageActions
                messageType={isUser ? 'user' : 'agent'}
                showOnHover={true}
                feedback={feedback}
                isStreaming={isStreaming}
                onCopy={onCopy ? () => onCopy(message.id) : undefined}
                onRegenerate={
                  onRegenerate && isAgent
                    ? () => onRegenerate(message.id)
                    : undefined
                }
                onEdit={onEdit && isUser ? () => onEdit(message.id) : undefined}
                onThumbsUp={
                  onThumbsUp && isAgent
                    ? () => onThumbsUp(message.id)
                    : undefined
                }
                onThumbsDown={
                  onThumbsDown && isAgent
                    ? () => onThumbsDown(message.id)
                    : undefined
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
