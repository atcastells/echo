import { clsx } from "clsx";
import { ConversationHeader } from "../../organisms/ConversationHeader";
import { Composer } from "../../organisms/Composer";
import { ConversationViewport } from "../ConversationViewport";
import type { Message } from "../../organisms/MessageItem";
import type { SuggestedPrompt } from "../ConversationEmptyState";
import type { AttachmentFile } from "../../molecules/AttachmentPreview";
import type { AgentStatus } from "../../molecules/AgentIdentity";

export interface MainPanelProps {
  /** Messages to display */
  messages: Message[];
  /** ID of message currently streaming */
  streamingMessageId?: string;
  /** Partial content for streaming message */
  streamingContent?: string;
  /** Whether the agent is currently thinking */
  isThinking?: boolean;
  /** Whether to show streaming response placeholder when message not yet in list */
  showStreamingPlaceholder?: boolean;
  /** Feedback by message ID */
  feedbackByMessageId?: Record<string, "positive" | "negative" | null>;
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
  /** Conversation title */
  conversationTitle?: string;
  /** Whether memory is enabled */
  memoryEnabled?: boolean;
  /** Context usage percentage */
  contextUsagePercent?: number;
  /** Whether composer is disabled */
  composerDisabled?: boolean;
  /** Current composer value */
  composerValue?: string;
  /** Composer attachments */
  attachments?: AttachmentFile[];
  /** Suggested prompts for empty state */
  suggestedPrompts?: SuggestedPrompt[];
  /** Whether to show sidebar toggle */
  showSidebarToggle?: boolean;
  /** Whether sidebar is open */
  sidebarOpen?: boolean;
  /** Callbacks */
  onToggleSidebar?: () => void;
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
 * MainPanel template component.
 *
 * The main chat interface layout composing ConversationHeader,
 * ConversationViewport, and Composer.
 */
export const MainPanel = ({
  messages,
  streamingMessageId,
  streamingContent,
  isThinking = false,
  showStreamingPlaceholder = true,
  feedbackByMessageId,
  agentName = "Echo",
  agentRole = "AI Career Agent",
  agentAvatarUrl,
  agentStatus = "available",
  userName = "You",
  userAvatarUrl,
  conversationTitle,
  memoryEnabled = true,
  contextUsagePercent = 0,
  composerDisabled = false,
  composerValue = "",
  attachments = [],
  suggestedPrompts,
  showSidebarToggle = true,
  sidebarOpen = true,
  onToggleSidebar,
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
}: MainPanelProps) => {
  const isStreaming = !!streamingMessageId || isThinking;

  return (
    <div className={clsx("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <ConversationHeader
        agentName={agentName}
        agentRole={agentRole}
        agentAvatarUrl={agentAvatarUrl}
        agentStatus={agentStatus}
        conversationTitle={conversationTitle}
        memoryEnabled={memoryEnabled}
        contextUsagePercent={contextUsagePercent}
        showSidebarToggle={showSidebarToggle}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={onToggleSidebar}
        onToggleMemory={onToggleMemory}
        onResetContext={onResetContext}
        onShare={onShare}
        onExport={onExport}
        onClear={onClear}
        onRename={onRename}
      />

      {/* Viewport */}
      <div className="flex-1 overflow-hidden">
        <ConversationViewport
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
          suggestedPrompts={suggestedPrompts}
          onPromptClick={onPromptClick}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onEdit={onEdit}
          onThumbsUp={onThumbsUp}
          onThumbsDown={onThumbsDown}
          onRetry={onRetry}
          onStopStreaming={onStopStreaming}
        />
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto">
          <Composer
            value={composerValue}
            onChange={onComposerChange}
            onSubmit={onComposerSubmit}
            onAttach={onAttach}
            onRemoveAttachment={onRemoveAttachment}
            attachments={attachments}
            disabled={composerDisabled || isStreaming}
            placeholder={
              isStreaming
                ? `${agentName} is responding...`
                : "Type your message..."
            }
          />
        </div>
      </div>
    </div>
  );
};
