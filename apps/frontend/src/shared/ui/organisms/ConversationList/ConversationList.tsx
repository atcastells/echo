import { useCallback, useState, type KeyboardEvent } from "react";
import { clsx } from "clsx";
import { Spinner } from "../../atoms/Spinner";
import { Icon } from "../../atoms/Icon";
import {
  ConversationListItem,
  type ConversationData,
} from "../../molecules/ConversationListItem";

export interface ConversationListProps {
  /** Array of conversations to display */
  conversations: ConversationData[];
  /** Currently active conversation ID */
  activeConversationId?: string;
  /** Whether conversations are loading */
  isLoading?: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Callback when a conversation is selected */
  onSelect?: (conversationId: string) => void;
  /** Callback when a conversation is deleted */
  onDelete?: (conversationId: string) => void;
  /** Callback when retry is clicked (after error) */
  onRetry?: () => void;
  /** Whether to enable keyboard navigation */
  enableKeyboardNav?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ConversationList organism component.
 *
 * Displays a list of conversations with loading, empty,
 * and error states, plus keyboard navigation support.
 */
export const ConversationList = ({
  conversations,
  activeConversationId,
  isLoading = false,
  error,
  onSelect,
  onDelete,
  onRetry,
  enableKeyboardNav = true,
  className,
}: ConversationListProps) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!enableKeyboardNav || conversations.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < conversations.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : conversations.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < conversations.length) {
            onSelect?.(conversations[focusedIndex].id);
          }
          break;
        case "Delete":
        case "Backspace":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < conversations.length) {
              onDelete?.(conversations[focusedIndex].id);
            }
          }
          break;
      }
    },
    [enableKeyboardNav, conversations, focusedIndex, onSelect, onDelete],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={clsx("flex flex-col items-center py-8", className)}>
        <Spinner size="md" variant="primary" />
        <p className="mt-3 text-sm text-neutral-500">
          Loading conversations...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center py-8 text-center",
          className,
        )}
      >
        <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mb-3">
          <Icon
            name="exclamation-circle"
            size="lg"
            className="text-error-500"
          />
        </div>
        <p className="text-sm font-medium text-neutral-800 mb-1">
          Failed to load conversations
        </p>
        <p className="text-sm text-neutral-500 mb-4">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-lg",
              "text-primary-600 hover:bg-primary-50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            )}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <div
        className={clsx(
          "flex flex-col items-center py-8 text-center",
          className,
        )}
      >
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
          <Icon
            name="chat-bubble-left-right"
            size="lg"
            className="text-neutral-400"
          />
        </div>
        <p className="text-sm font-medium text-neutral-800 mb-1">
          No conversations yet
        </p>
        <p className="text-sm text-neutral-500">
          Start a new conversation to get started
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx("space-y-1", className)}
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Conversation list"
      aria-activedescendant={
        focusedIndex >= 0
          ? `conversation-${conversations[focusedIndex].id}`
          : undefined
      }
    >
      {conversations.map((conversation, index) => (
        <div
          key={conversation.id}
          id={`conversation-${conversation.id}`}
          role="option"
          aria-selected={conversation.id === activeConversationId}
          className={clsx(
            focusedIndex === index &&
              "ring-2 ring-primary-500 ring-inset rounded-lg",
          )}
        >
          <ConversationListItem
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onClick={onSelect}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};
