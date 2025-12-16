import { useState, useCallback, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Sidebar } from '../../organisms/Sidebar';
import { MainPanel } from '../../templates/MainPanel';
import type { Message } from '../../organisms/MessageItem';
import type { ConversationData } from '../../molecules/ConversationListItem';
import type { SuggestedPrompt } from '../../templates/ConversationEmptyState';
import type { AttachmentFile } from '../../molecules/AttachmentPreview';
import type { AgentStatus } from '../../molecules/AgentIdentity';

export interface ConversationAppProps {
  /** All conversations */
  conversations: ConversationData[];
  /** Active conversation ID */
  activeConversationId?: string;
  /** Messages for the active conversation */
  messages: Message[];
  /** Whether conversations are loading */
  isLoadingConversations?: boolean;
  /** Error loading conversations */
  conversationsError?: string;
  /** ID of message currently streaming */
  streamingMessageId?: string;
  /** Streaming message content */
  streamingContent?: string;
  /** Feedback by message ID */
  feedbackByMessageId?: Record<string, 'positive' | 'negative' | null>;
  /** Agent name */
  agentName?: string;
  /** Agent role */
  agentRole?: string;
  /** Agent avatar URL */
  agentAvatarUrl?: string;
  /** Agent status */
  agentStatus?: AgentStatus;
  /** User name */
  userName?: string;
  /** User avatar URL */
  userAvatarUrl?: string;
  /** Whether memory is enabled */
  memoryEnabled?: boolean;
  /** Context usage percentage */
  contextUsagePercent?: number;
  /** Composer value */
  composerValue?: string;
  /** Attachments */
  attachments?: AttachmentFile[];
  /** Suggested prompts */
  suggestedPrompts?: SuggestedPrompt[];
  /** Whether the app is in mobile mode */
  isMobile?: boolean;
  /** Toast container for notifications */
  toastContainer?: ReactNode;
  /** Callbacks */
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onNewConversation?: () => void;
  onRetryLoadConversations?: () => void;
  onSearch?: (query: string) => void;
  onToggleMemory?: () => void;
  onResetContext?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  onRename?: () => void;
  onComposerChange?: (value: string) => void;
  onComposerSubmit?: (message: string, attachments?: AttachmentFile[]) => void;
  onAttach?: (files: FileList) => void;
  onRemoveAttachment?: (fileId: string) => void;
  onStopStreaming?: () => void;
  onPromptClick?: (prompt: SuggestedPrompt) => void;
  onCopy?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onThumbsUp?: (messageId: string) => void;
  onThumbsDown?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ConversationApp page component.
 *
 * The complete application shell integrating Sidebar and MainPanel
 * with responsive layout support for mobile devices.
 */
export const ConversationApp = ({
  conversations,
  activeConversationId,
  messages,
  isLoadingConversations = false,
  conversationsError,
  streamingMessageId,
  streamingContent,
  feedbackByMessageId,
  agentName = 'Echo',
  agentRole = 'AI Career Agent',
  agentAvatarUrl,
  agentStatus = 'available',
  userName = 'You',
  userAvatarUrl,
  memoryEnabled = true,
  contextUsagePercent = 0,
  composerValue = '',
  attachments = [],
  suggestedPrompts,
  isMobile = false,
  toastContainer,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onRetryLoadConversations,
  onSearch,
  onToggleMemory,
  onResetContext,
  onShare,
  onExport,
  onClear,
  onRename,
  onComposerChange,
  onComposerSubmit,
  onAttach,
  onRemoveAttachment,
  onStopStreaming,
  onPromptClick,
  onCopy,
  onRegenerate,
  onEdit,
  onThumbsUp,
  onThumbsDown,
  onRetry,
  className,
}: ConversationAppProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      onSelectConversation?.(id);
      if (isMobile) {
        setSidebarOpen(false);
      }
    },
    [isMobile, onSelectConversation]
  );

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  return (
    <div className={clsx('flex h-screen bg-neutral-50', className)}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          isMobile
            ? clsx(
                'fixed inset-y-0 left-0 z-50 transition-transform duration-300',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              )
            : 'relative flex-shrink-0'
        )}
      >
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={isLoadingConversations}
          error={conversationsError}
          isCollapsed={!isMobile && sidebarCollapsed}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onNewConversation={onNewConversation}
          onRetry={onRetryLoadConversations}
          onSearch={onSearch}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0">
        <MainPanel
          messages={messages}
          streamingMessageId={streamingMessageId}
          streamingContent={streamingContent}
          feedbackByMessageId={feedbackByMessageId}
          agentName={agentName}
          agentRole={agentRole}
          agentAvatarUrl={agentAvatarUrl}
          agentStatus={agentStatus}
          userName={userName}
          userAvatarUrl={userAvatarUrl}
          conversationTitle={activeConversation?.title}
          memoryEnabled={memoryEnabled}
          contextUsagePercent={contextUsagePercent}
          composerValue={composerValue}
          attachments={attachments}
          suggestedPrompts={suggestedPrompts}
          showSidebarToggle={true}
          sidebarOpen={isMobile ? sidebarOpen : !sidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          onToggleMemory={onToggleMemory}
          onResetContext={onResetContext}
          onShare={onShare}
          onExport={onExport}
          onClear={onClear}
          onRename={onRename}
          onComposerChange={onComposerChange}
          onComposerSubmit={onComposerSubmit}
          onAttach={onAttach}
          onRemoveAttachment={onRemoveAttachment}
          onStopStreaming={onStopStreaming}
          onPromptClick={onPromptClick}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onThumbsUp={onThumbsUp}
          onThumbsDown={onThumbsDown}
          onRetry={onRetry}
        />
      </div>

      {/* Toast container */}
      {toastContainer}
    </div>
  );
};
