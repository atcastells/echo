import { clsx } from "clsx";
import { Icon, type IconName } from "../../atoms/Icon";
import { Spinner } from "../../atoms/Spinner";

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "streaming";

export interface MessageMetaProps {
  /** Timestamp of the message */
  timestamp?: Date | string;
  /** Whether to show relative time (e.g., "2 min ago") */
  relativeTime?: boolean;
  /** Message delivery status */
  status?: MessageStatus;
  /** Cost of the AI response (in tokens or currency) */
  cost?: string;
  /** Latency of the response in milliseconds */
  latencyMs?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats a timestamp as a relative time string.
 */
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a timestamp as an absolute time string.
 */
const formatAbsoluteTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

const statusConfig: Record<
  MessageStatus,
  { icon?: IconName; label: string; className: string }
> = {
  sending: {
    label: "Sending",
    className: "text-neutral-400",
  },
  sent: {
    icon: "check",
    label: "Sent",
    className: "text-neutral-400",
  },
  delivered: {
    icon: "check-circle",
    label: "Delivered",
    className: "text-success-500",
  },
  failed: {
    icon: "x-circle",
    label: "Failed to send",
    className: "text-error-500",
  },
  streaming: {
    label: "Streaming",
    className: "text-primary-500",
  },
};

/**
 * MessageMeta component for displaying message metadata.
 *
 * Shows timestamp, delivery status, and optional metrics like
 * cost and latency for AI responses.
 */
export const MessageMeta = ({
  timestamp,
  relativeTime = true,
  status,
  cost,
  latencyMs,
  className,
}: MessageMetaProps) => {
  const date = timestamp
    ? typeof timestamp === "string"
      ? new Date(timestamp)
      : timestamp
    : null;

  const timeString = date
    ? relativeTime
      ? formatRelativeTime(date)
      : formatAbsoluteTime(date)
    : null;

  const statusInfo = status ? statusConfig[status] : null;

  const formatLatency = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-2 text-xs text-neutral-500",
        className,
      )}
    >
      {/* Timestamp */}
      {timeString && (
        <time
          dateTime={date?.toISOString()}
          title={date?.toLocaleString()}
          className="tabular-nums"
        >
          {timeString}
        </time>
      )}

      {/* Separator */}
      {timeString && statusInfo && <span className="text-neutral-300">·</span>}

      {/* Status */}
      {statusInfo && (
        <span
          className={clsx("flex items-center gap-1", statusInfo.className)}
          aria-label={statusInfo.label}
        >
          {status === "sending" || status === "streaming" ? (
            <Spinner size="sm" variant="secondary" />
          ) : (
            statusInfo.icon && <Icon name={statusInfo.icon} size="sm" />
          )}
          <span className="sr-only">{statusInfo.label}</span>
        </span>
      )}

      {/* Metrics (cost and latency) */}
      {(cost || latencyMs !== undefined) && (
        <>
          <span className="text-neutral-300">·</span>
          <div className="flex items-center gap-1.5">
            {cost && (
              <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                {cost}
              </span>
            )}
            {latencyMs !== undefined && (
              <span
                className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600"
                title={`Response time: ${latencyMs}ms`}
              >
                {formatLatency(latencyMs)}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
