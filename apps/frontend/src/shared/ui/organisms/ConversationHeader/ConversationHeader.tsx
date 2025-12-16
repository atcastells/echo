import { useState } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Tooltip } from '../../atoms/Tooltip';
import { AgentIdentity, type AgentStatus } from '../../molecules/AgentIdentity';
import { ContextIndicator } from '../../molecules/ContextIndicator';

export interface ConversationHeaderProps {
  /** Agent display name */
  agentName?: string;
  /** Agent role description */
  agentRole?: string;
  /** Agent avatar URL */
  agentAvatarUrl?: string;
  /** Agent status */
  agentStatus?: AgentStatus;
  /** Conversation title */
  conversationTitle?: string;
  /** Whether context memory is enabled */
  memoryEnabled?: boolean;
  /** Context usage percentage */
  contextUsagePercent?: number;
  /** Whether to show the sidebar toggle */
  showSidebarToggle?: boolean;
  /** Whether the sidebar is open */
  sidebarOpen?: boolean;
  /** Callback when sidebar toggle is clicked */
  onToggleSidebar?: () => void;
  /** Callback when memory is toggled */
  onToggleMemory?: () => void;
  /** Callback when context is reset */
  onResetContext?: () => void;
  /** Callback when share is clicked */
  onShare?: () => void;
  /** Callback when export is clicked */
  onExport?: () => void;
  /** Callback when clear is clicked */
  onClear?: () => void;
  /** Callback when rename is clicked */
  onRename?: () => void;
  /** Callback when agent identity is clicked */
  onAgentClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ConversationHeader organism component.
 *
 * Displays agent identity, context indicator, and conversation actions
 * in a header bar for the chat interface.
 */
export const ConversationHeader = ({
  agentName = 'Echo',
  agentRole = 'AI Career Agent',
  agentAvatarUrl,
  agentStatus = 'available',
  conversationTitle,
  memoryEnabled = true,
  contextUsagePercent = 0,
  showSidebarToggle = true,
  sidebarOpen = true,
  onToggleSidebar,
  onToggleMemory,
  onResetContext,
  onShare,
  onExport,
  onClear,
  onRename,
  onAgentClick,
  className,
}: ConversationHeaderProps) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <header
      className={clsx(
        'flex items-center justify-between',
        'px-4 py-3',
        'bg-white border-b border-neutral-200',
        className
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        {showSidebarToggle && (
          <Tooltip
            content={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            position="bottom"
          >
            <button
              type="button"
              onClick={onToggleSidebar}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
              )}
              aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <Icon name="bars-3" size="md" />
            </button>
          </Tooltip>
        )}

        {/* Agent identity */}
        <AgentIdentity
          name={agentName}
          role={conversationTitle || agentRole}
          avatarUrl={agentAvatarUrl}
          status={agentStatus}
          size="sm"
          clickable={!!onAgentClick}
          onClick={onAgentClick}
          showChevron={false}
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Context indicator */}
        <ContextIndicator
          isEnabled={memoryEnabled}
          usagePercent={contextUsagePercent}
          showResetButton={contextUsagePercent > 0}
          onToggle={onToggleMemory}
          onReset={onResetContext}
          size="sm"
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1 ml-2">
          {onShare && (
            <Tooltip content="Share conversation" position="bottom">
              <button
                type="button"
                onClick={onShare}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                )}
                aria-label="Share conversation"
              >
                <Icon name="share" size="md" />
              </button>
            </Tooltip>
          )}

          {/* More menu */}
          <div className="relative">
            <Tooltip content="More options" position="bottom">
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  showMoreMenu && 'bg-neutral-100 text-neutral-700'
                )}
                aria-label="More options"
                aria-expanded={showMoreMenu}
              >
                <Icon name="ellipsis-vertical" size="md" />
              </button>
            </Tooltip>

            {/* Dropdown menu */}
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div
                  className={clsx(
                    'absolute right-0 top-full mt-1 z-20',
                    'w-48 py-1',
                    'bg-white rounded-lg shadow-lg border border-neutral-200',
                    'animate-in fade-in slide-in-from-top-1 duration-150'
                  )}
                >
                  {onRename && (
                    <MenuButton
                      icon="pencil"
                      label="Rename"
                      onClick={() => {
                        onRename();
                        setShowMoreMenu(false);
                      }}
                    />
                  )}
                  {onExport && (
                    <MenuButton
                      icon="arrow-up-tray"
                      label="Export"
                      onClick={() => {
                        onExport();
                        setShowMoreMenu(false);
                      }}
                    />
                  )}
                  {onClear && (
                    <>
                      <div className="h-px bg-neutral-100 my-1" />
                      <MenuButton
                        icon="trash"
                        label="Clear conversation"
                        onClick={() => {
                          onClear();
                          setShowMoreMenu(false);
                        }}
                        variant="danger"
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

interface MenuButtonProps {
  icon: 'pencil' | 'arrow-up-tray' | 'trash';
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

const MenuButton = ({
  icon,
  label,
  onClick,
  variant = 'default',
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-2 px-3 py-2 text-sm',
      'transition-colors duration-150',
      variant === 'default' && 'text-neutral-700 hover:bg-neutral-100',
      variant === 'danger' && 'text-error-600 hover:bg-error-50'
    )}
  >
    <Icon name={icon} size="sm" />
    {label}
  </button>
);
