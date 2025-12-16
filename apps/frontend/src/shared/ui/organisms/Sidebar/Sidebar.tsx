import { useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { TextInput } from '../../atoms/TextInput';
import { ConversationList } from '../ConversationList';
import type { ConversationData } from '../../molecules/ConversationListItem';

export interface SidebarProps {
  /** Array of conversations to display */
  conversations: ConversationData[];
  /** Currently active conversation ID */
  activeConversationId?: string;
  /** Whether conversations are loading */
  isLoading?: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Whether the sidebar is collapsed */
  isCollapsed?: boolean;
  /** Callback when a conversation is selected */
  onSelectConversation?: (conversationId: string) => void;
  /** Callback when a conversation is deleted */
  onDeleteConversation?: (conversationId: string) => void;
  /** Callback when new conversation is clicked */
  onNewConversation?: () => void;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Callback when search query changes */
  onSearch?: (query: string) => void;
  /** Callback when collapse state changes */
  onToggleCollapse?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Sidebar organism component.
 *
 * A complete sidebar with search, new conversation button,
 * and conversation list with collapsed/expanded states.
 */
export const Sidebar = ({
  conversations,
  activeConversationId,
  isLoading = false,
  error,
  isCollapsed = false,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onRetry,
  onSearch,
  onToggleCollapse,
  className,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Filter conversations based on search
  const filteredConversations = searchQuery
    ? conversations.filter((conv) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Collapsed state
  if (isCollapsed) {
    return (
      <aside
        className={clsx(
          'flex flex-col items-center py-4 gap-4',
          'bg-neutral-50 border-r border-neutral-200',
          'w-16',
          className
        )}
      >
        {/* Expand button */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="Expand sidebar"
          >
            <Icon name="chevron-right" size="md" />
          </button>
        )}

        {/* New conversation button (icon only) */}
        {onNewConversation && (
          <button
            type="button"
            onClick={onNewConversation}
            className={clsx(
              'p-3 rounded-xl transition-colors',
              'bg-primary-600 text-white hover:bg-primary-700',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
            aria-label="New conversation"
          >
            <Icon name="plus" size="md" />
          </button>
        )}
      </aside>
    );
  }

  return (
    <aside
      className={clsx(
        'flex flex-col',
        'bg-neutral-50 border-r border-neutral-200',
        'w-72',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Chats</h2>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
              aria-label="Collapse sidebar"
            >
              <Icon name="chevron-left" size="sm" />
            </button>
          )}
        </div>

        {/* New conversation button */}
        {onNewConversation && (
          <Button
            variant="primary"
            size="md"
            leadingIcon={<Icon name="plus" size="sm" />}
            onClick={onNewConversation}
            className="w-full justify-center mb-4"
          >
            New Conversation
          </Button>
        )}

        {/* Search input */}
        <TextInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search conversations..."
          leadingIcon={<Icon name="magnifying-glass" size="sm" />}
          className="w-full"
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-3">
        {searchQuery && filteredConversations.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">
              No conversations matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <ConversationList
            conversations={filteredConversations}
            activeConversationId={activeConversationId}
            isLoading={isLoading}
            error={error}
            onSelect={onSelectConversation}
            onDelete={onDeleteConversation}
            onRetry={onRetry}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <p className="text-xs text-neutral-400 text-center">
          {conversations.length} conversation{conversations.length === 1 ? '' : 's'}
        </p>
      </div>
    </aside>
  );
};
