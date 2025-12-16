import { useState } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Tooltip } from '../../atoms/Tooltip';

export interface ConversationData {
  /** Unique identifier */
  id: string;
  /** Conversation title */
  title: string;
  /** Preview of last message */
  lastMessagePreview?: string;
  /** Timestamp of last activity */
  timestamp: Date | string;
  /** Whether the conversation has unread messages */
  hasUnread?: boolean;
  /** Number of messages in the conversation */
  messageCount?: number;
}

export interface ConversationListItemProps {
  /** Conversation data to display */
  conversation: ConversationData;
  /** Whether this item is currently selected */
  isActive?: boolean;
  /** Callback when the item is clicked */
  onClick?: (conversationId: string) => void;
  /** Callback when delete is clicked */
  onDelete?: (conversationId: string) => void;
  /** Whether to show delete on hover */
  showDeleteOnHover?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats a timestamp as a relative string.
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * ConversationListItem component for sidebar conversation lists.
 *
 * Displays conversation title, last message preview, timestamp,
 * and provides delete functionality.
 */
export const ConversationListItem = ({
  conversation,
  isActive = false,
  onClick,
  onDelete,
  showDeleteOnHover = true,
  className,
}: ConversationListItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const timestamp =
    typeof conversation.timestamp === 'string'
      ? new Date(conversation.timestamp)
      : conversation.timestamp;

  const handleClick = () => {
    onClick?.(conversation.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(conversation.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'w-full text-left px-3 py-2.5 rounded-lg cursor-pointer',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        isActive
          ? 'bg-primary-50 border border-primary-200'
          : 'hover:bg-neutral-100 border border-transparent',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Unread indicator */}
        <div className="flex-shrink-0 mt-1.5">
          {conversation.hasUnread ? (
            <div className="w-2 h-2 rounded-full bg-primary-500" />
          ) : (
            <div className="w-2 h-2" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <h3
              className={clsx(
                'text-sm font-medium truncate',
                isActive ? 'text-primary-800' : 'text-neutral-800',
                conversation.hasUnread && 'font-semibold'
              )}
            >
              {conversation.title}
            </h3>

            {/* Timestamp or delete button */}
            <div className="flex-shrink-0 flex items-center">
              {showDeleteOnHover && isHovered && onDelete ? (
                <Tooltip content="Delete conversation" position="left">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={clsx(
                      'p-1 rounded-md transition-colors',
                      'text-neutral-400 hover:text-error-600 hover:bg-error-50',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-error-500'
                    )}
                    aria-label="Delete conversation"
                  >
                    <Icon name="trash" size="sm" />
                  </button>
                </Tooltip>
              ) : (
                <time
                  dateTime={timestamp.toISOString()}
                  className="text-xs text-neutral-500 tabular-nums"
                >
                  {formatRelativeTime(timestamp)}
                </time>
              )}
            </div>
          </div>

          {/* Preview */}
          {conversation.lastMessagePreview && (
            <p
              className={clsx(
                'text-sm truncate mt-0.5',
                isActive ? 'text-primary-600' : 'text-neutral-500'
              )}
            >
              {conversation.lastMessagePreview}
            </p>
          )}

          {/* Message count */}
          {conversation.messageCount !== undefined && (
            <p className="text-xs text-neutral-400 mt-1">
              {conversation.messageCount} message
              {conversation.messageCount === 1 ? '' : 's'}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
