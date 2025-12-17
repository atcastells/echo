import { type ReactNode } from "react";
import { clsx } from "clsx";
import { Button } from "../../atoms/Button";
import { Icon, type IconName } from "../../atoms/Icon";

export type AgentPromptVariant =
  | "clarifying"
  | "suggestion"
  | "confirmation"
  | "warning";

export interface AgentPromptProps {
  /** Prompt variant/type */
  variant?: AgentPromptVariant;
  /** Prompt content */
  content: ReactNode;
  /** Accept button label */
  acceptLabel?: string;
  /** Reject button label */
  rejectLabel?: string;
  /** Modify button label */
  modifyLabel?: string;
  /** Callback when accept is clicked */
  onAccept?: () => void;
  /** Callback when reject is clicked */
  onReject?: () => void;
  /** Callback when modify is clicked */
  onModify?: () => void;
  /** Whether actions are disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const variantConfig: Record<
  AgentPromptVariant,
  { icon: IconName; bgClass: string; borderClass: string; iconClass: string }
> = {
  clarifying: {
    icon: "chat-bubble-left-right",
    bgClass: "bg-primary-50",
    borderClass: "border-primary-200",
    iconClass: "text-primary-500",
  },
  suggestion: {
    icon: "sparkles",
    bgClass: "bg-success-50",
    borderClass: "border-success-200",
    iconClass: "text-success-500",
  },
  confirmation: {
    icon: "check-circle",
    bgClass: "bg-warning-50",
    borderClass: "border-warning-200",
    iconClass: "text-warning-500",
  },
  warning: {
    icon: "exclamation-triangle",
    bgClass: "bg-error-50",
    borderClass: "border-error-200",
    iconClass: "text-error-500",
  },
};

const defaultLabels: Record<
  AgentPromptVariant,
  { accept: string; reject: string }
> = {
  clarifying: { accept: "Answer", reject: "Skip" },
  suggestion: { accept: "Accept", reject: "Decline" },
  confirmation: { accept: "Confirm", reject: "Cancel" },
  warning: { accept: "Continue", reject: "Cancel" },
};

/**
 * AgentPrompt organism component.
 *
 * Displays agent prompts for clarifying questions, suggestions,
 * confirmations, and warnings with appropriate styling and actions.
 */
export const AgentPrompt = ({
  variant = "clarifying",
  content,
  acceptLabel,
  rejectLabel,
  modifyLabel,
  onAccept,
  onReject,
  onModify,
  disabled = false,
  className,
}: AgentPromptProps) => {
  const config = variantConfig[variant];
  const labels = defaultLabels[variant];

  return (
    <div
      className={clsx(
        "rounded-xl border p-4",
        config.bgClass,
        config.borderClass,
        className,
      )}
      role="region"
      aria-label={`Agent ${variant} prompt`}
    >
      {/* Header with icon */}
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
            config.bgClass,
          )}
        >
          <Icon name={config.icon} size="md" className={config.iconClass} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-neutral-700">{content}</div>

          {/* Actions */}
          {(onAccept || onReject || onModify) && (
            <div className="flex items-center gap-2 mt-4">
              {onAccept && (
                <Button
                  variant={variant === "warning" ? "danger" : "primary"}
                  size="sm"
                  onClick={onAccept}
                  disabled={disabled}
                >
                  {acceptLabel ?? labels.accept}
                </Button>
              )}
              {onReject && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReject}
                  disabled={disabled}
                >
                  {rejectLabel ?? labels.reject}
                </Button>
              )}
              {onModify && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onModify}
                  disabled={disabled}
                  leadingIcon={<Icon name="pencil" size="sm" />}
                >
                  {modifyLabel ?? "Modify"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
