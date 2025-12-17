import { useState } from "react";
import { clsx } from "clsx";
import { Icon, type IconName } from "../../atoms/Icon";
import { Badge } from "../../atoms/Badge";

export interface ContextItem {
  /** Unique identifier */
  id: string;
  /** Item type */
  type: "document" | "conversation" | "memory" | "web";
  /** Display name */
  name: string;
  /** Relevance score (0-100) */
  relevance?: number;
}

export interface ToolInvocation {
  /** Unique identifier */
  id: string;
  /** Tool name */
  name: string;
  /** Tool status */
  status: "success" | "failed" | "skipped";
  /** Execution time in ms */
  durationMs?: number;
}

export interface TransparencyPanelProps {
  /** Explanation of why this response was generated */
  explanation?: string;
  /** Context items used */
  contextItems?: ContextItem[];
  /** Tools invoked */
  toolsInvoked?: ToolInvocation[];
  /** Memory impact description */
  memoryImpact?: string;
  /** Whether to show expanded by default */
  defaultExpanded?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const typeIcons: Record<ContextItem["type"], IconName> = {
  document: "document",
  conversation: "chat-bubble-left-right",
  memory: "sparkles",
  web: "globe-alt",
};

const typeLabels: Record<ContextItem["type"], string> = {
  document: "Document",
  conversation: "Conversation",
  memory: "Memory",
  web: "Web",
};

/**
 * TransparencyPanel organism component.
 *
 * Shows "why this response" explanation, context used,
 * tools invoked, and memory impact.
 */
export const TransparencyPanel = ({
  explanation,
  contextItems = [],
  toolsInvoked = [],
  memoryImpact,
  defaultExpanded = false,
  className,
}: TransparencyPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasContent =
    explanation ||
    contextItems.length > 0 ||
    toolsInvoked.length > 0 ||
    memoryImpact;

  if (!hasContent) return null;

  return (
    <div
      className={clsx(
        "border border-neutral-200 rounded-lg overflow-hidden",
        "bg-neutral-50",
        className,
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "w-full flex items-center gap-2 px-4 py-3",
          "hover:bg-neutral-100 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500",
        )}
      >
        <Icon name="eye" size="sm" className="text-neutral-500" />
        <span className="text-sm font-medium text-neutral-700">
          Response Details
        </span>
        <Icon
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size="sm"
          className="ml-auto text-neutral-400"
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-neutral-200">
          {/* Explanation */}
          {explanation && (
            <Section title="Why this response">
              <p className="text-sm text-neutral-600">{explanation}</p>
            </Section>
          )}

          {/* Context used */}
          {contextItems.length > 0 && (
            <Section title="Context used">
              <div className="space-y-2">
                {contextItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Icon
                      name={typeIcons[item.type]}
                      size="sm"
                      className="text-neutral-500"
                    />
                    <span className="text-neutral-700 flex-1">{item.name}</span>
                    <Badge variant="default" size="sm">
                      {typeLabels[item.type]}
                    </Badge>
                    {item.relevance !== undefined && (
                      <span className="text-xs text-neutral-500">
                        {item.relevance}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Tools invoked */}
          {toolsInvoked.length > 0 && (
            <Section title="Tools used">
              <div className="space-y-2">
                {toolsInvoked.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Icon
                      name={
                        tool.status === "success"
                          ? "check-circle"
                          : tool.status === "failed"
                            ? "x-circle"
                            : "minus-circle"
                      }
                      size="sm"
                      className={
                        tool.status === "success"
                          ? "text-success-500"
                          : tool.status === "failed"
                            ? "text-error-500"
                            : "text-neutral-400"
                      }
                    />
                    <span className="text-neutral-700 flex-1">{tool.name}</span>
                    {tool.durationMs !== undefined && (
                      <span className="text-xs text-neutral-500">
                        {tool.durationMs}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Memory impact */}
          {memoryImpact && (
            <Section title="Memory impact">
              <p className="text-sm text-neutral-600">{memoryImpact}</p>
            </Section>
          )}
        </div>
      )}
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="pt-3">
    <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
      {title}
    </h4>
    {children}
  </div>
);
