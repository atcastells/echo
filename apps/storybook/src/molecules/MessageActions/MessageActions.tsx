import { useState } from "react";
import { clsx } from "clsx";
import { Icon, type IconName } from "../../atoms/Icon";
import { Tooltip } from "../../atoms/Tooltip";

export type MessageActionType =
  | "copy"
  | "regenerate"
  | "edit"
  | "thumbsUp"
  | "thumbsDown"
  | "report";

export interface MessageActionsProps {
  /** The type of message (affects which actions are shown) */
  messageType?: "user" | "agent";
  /** Whether to show actions on hover only */
  showOnHover?: boolean;
  /** Available actions to show */
  actions?: MessageActionType[];
  /** Current feedback state (for thumbs up/down) */
  feedback?: "positive" | "negative" | null;
  /** Callback when copy is clicked */
  onCopy?: () => void;
  /** Callback when regenerate is clicked */
  onRegenerate?: () => void;
  /** Callback when edit is clicked */
  onEdit?: () => void;
  /** Callback when thumbs up is clicked */
  onThumbsUp?: () => void;
  /** Callback when thumbs down is clicked */
  onThumbsDown?: () => void;
  /** Callback when report is clicked */
  onReport?: () => void;
  /** Whether the message is currently being streamed */
  isStreaming?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface ActionConfig {
  icon: IconName;
  label: string;
  key: MessageActionType;
}

const actionConfigs: Record<MessageActionType, ActionConfig> = {
  copy: { icon: "copy", label: "Copy", key: "copy" },
  regenerate: { icon: "refresh", label: "Regenerate", key: "regenerate" },
  edit: { icon: "pencil", label: "Edit", key: "edit" },
  thumbsUp: { icon: "hand-thumb-up", label: "Good response", key: "thumbsUp" },
  thumbsDown: {
    icon: "hand-thumb-down",
    label: "Bad response",
    key: "thumbsDown",
  },
  report: { icon: "exclamation-circle", label: "Report", key: "report" },
};

const defaultAgentActions: MessageActionType[] = [
  "copy",
  "regenerate",
  "thumbsUp",
  "thumbsDown",
];

const defaultUserActions: MessageActionType[] = ["copy", "edit"];

/**
 * MessageActions component for message interaction buttons.
 *
 * Shows contextual actions for user and agent messages with
 * hover reveal behavior and feedback states.
 */
export const MessageActions = ({
  messageType = "agent",
  showOnHover = true,
  actions,
  feedback,
  onCopy,
  onRegenerate,
  onEdit,
  onThumbsUp,
  onThumbsDown,
  onReport,
  isStreaming = false,
  className,
}: MessageActionsProps) => {
  const [isVisible, setIsVisible] = useState(!showOnHover);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const availableActions =
    actions ??
    (messageType === "agent" ? defaultAgentActions : defaultUserActions);

  const handleCopy = () => {
    onCopy?.();
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2000);
  };

  const getActionHandler = (action: MessageActionType) => {
    switch (action) {
      case "copy":
        return handleCopy;
      case "regenerate":
        return onRegenerate;
      case "edit":
        return onEdit;
      case "thumbsUp":
        return onThumbsUp;
      case "thumbsDown":
        return onThumbsDown;
      case "report":
        return onReport;
    }
  };

  const getActionState = (
    action: MessageActionType,
  ): "active" | "inactive" | null => {
    if (action === "thumbsUp" && feedback === "positive") return "active";
    if (action === "thumbsDown" && feedback === "negative") return "active";
    if (action === "thumbsUp" && feedback === "negative") return "inactive";
    if (action === "thumbsDown" && feedback === "positive") return "inactive";
    return null;
  };

  return (
    <div
      className={clsx("relative", className)}
      onMouseEnter={() => showOnHover && setIsVisible(true)}
      onMouseLeave={() => showOnHover && setIsVisible(false)}
    >
      <div
        className={clsx(
          "flex items-center gap-1 transition-opacity duration-150",
          showOnHover && !isVisible && "opacity-0",
          showOnHover && isVisible && "opacity-100",
        )}
        role="toolbar"
        aria-label="Message actions"
      >
        {availableActions.map((action) => {
          const config = actionConfigs[action];
          const handler = getActionHandler(action);
          const state = getActionState(action);
          const isDisabled = isStreaming && action !== "copy";

          // Special handling for copy with feedback
          if (action === "copy" && copiedFeedback) {
            return (
              <ActionButton
                key={action}
                icon="check"
                label="Copied!"
                onClick={handler}
                state="active"
                disabled={isDisabled}
              />
            );
          }

          return (
            <ActionButton
              key={action}
              icon={config.icon}
              label={config.label}
              onClick={handler}
              state={state}
              disabled={isDisabled}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: IconName;
  label: string;
  onClick?: () => void;
  state?: "active" | "inactive" | null;
  disabled?: boolean;
}

const ActionButton = ({
  icon,
  label,
  onClick,
  state,
  disabled,
}: ActionButtonProps) => (
  <Tooltip content={label} position="top">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "p-1.5 rounded-md transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        state === "active" && "bg-primary-100 text-primary-600",
        state === "inactive" && "text-neutral-300",
        state === null &&
          "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      aria-label={label}
    >
      <Icon name={icon} size="sm" />
    </button>
  </Tooltip>
);
