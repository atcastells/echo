import { type ReactNode, useState } from "react";
import { clsx } from "clsx";
import { Icon } from "../../atoms/Icon";
import { MarkdownViewer } from "../../MarkdownViewer";

export type MessageBubbleVariant = "user" | "agent" | "system";

export interface MessageBubbleCitation {
  /** Unique identifier for the citation */
  id: string;
  /** Display text for the citation */
  text: string;
  /** URL or reference link */
  url?: string;
}

export interface MessageBubbleProps {
  /** The content to display in the bubble */
  content: string;
  /** The variant/sender type of the message */
  variant?: MessageBubbleVariant;
  /** Whether the content is in Markdown format */
  isMarkdown?: boolean;
  /** Whether to show the message in a code block style */
  isCode?: boolean;
  /** Programming language for code syntax highlighting */
  codeLanguage?: string;
  /** Citations/references for the message */
  citations?: MessageBubbleCitation[];
  /** Maximum lines before showing expand/collapse */
  maxLines?: number;
  /** Additional CSS classes */
  className?: string;
  /** Child nodes to render instead of content */
  children?: ReactNode;
}

const variantStyles: Record<MessageBubbleVariant, string> = {
  user: clsx("bg-primary-600 text-white", "rounded-2xl rounded-br-md"),
  agent: clsx("bg-neutral-100 text-neutral-800", "rounded-2xl rounded-bl-md"),
  system: clsx(
    "bg-warning-50 text-warning-800 border border-warning-200",
    "rounded-xl",
  ),
};

const codeBlockStyles = clsx(
  "bg-neutral-900 text-neutral-100",
  "font-mono text-sm",
  "rounded-lg overflow-x-auto",
);

/**
 * MessageBubble component for displaying chat messages.
 *
 * Supports user, agent, and system message variants with
 * Markdown rendering, code blocks, and citations.
 */
export const MessageBubble = ({
  content,
  variant = "agent",
  isMarkdown = false,
  isCode = false,
  codeLanguage,
  citations,
  maxLines = 20,
  className,
  children,
}: MessageBubbleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if content is long enough to need expand/collapse
  const lineCount = content.split("\n").length;
  const isLongContent = lineCount > maxLines;
  const shouldTruncate = isLongContent && !isExpanded;

  // Truncate content if needed
  const displayContent = shouldTruncate
    ? content.split("\n").slice(0, maxLines).join("\n") + "\n..."
    : content;

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (isCode) {
      return (
        <div className={codeBlockStyles}>
          {codeLanguage && (
            <div className="px-4 py-2 bg-neutral-800 text-neutral-400 text-xs border-b border-neutral-700">
              {codeLanguage}
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code>{displayContent}</code>
          </pre>
        </div>
      );
    }

    if (isMarkdown) {
      return (
        <div className={variant === "user" ? "prose-invert" : ""}>
          <MarkdownViewer content={displayContent} />
        </div>
      );
    }

    return <p className="whitespace-pre-wrap break-words">{displayContent}</p>;
  };

  return (
    <div
      className={clsx(
        "px-4 py-3 max-w-prose",
        !isCode && variantStyles[variant],
        isCode && "p-0",
        className,
      )}
    >
      {renderContent()}

      {/* Expand/Collapse button */}
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            "mt-2 flex items-center gap-1 text-sm font-medium",
            "transition-colors duration-150",
            variant === "user"
              ? "text-primary-200 hover:text-white"
              : "text-primary-600 hover:text-primary-700",
          )}
        >
          <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size="sm" />
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}

      {/* Citations */}
      {citations && citations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <div className="flex flex-wrap gap-2">
            {citations.map((citation) => (
              <CitationBadge key={citation.id} citation={citation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CitationBadgeProps {
  citation: MessageBubbleCitation;
}

const CitationBadge = ({ citation }: CitationBadgeProps) => {
  const content = (
    <span
      className={clsx(
        "inline-flex items-center gap-1",
        "px-2 py-0.5 rounded-full",
        "bg-primary-100 text-primary-700",
        "text-xs font-medium",
        citation.url && "hover:bg-primary-200 cursor-pointer",
      )}
    >
      <Icon name="document" size="sm" />
      {citation.text}
    </span>
  );

  if (citation.url) {
    return (
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        {content}
      </a>
    );
  }

  return content;
};
