import { clsx } from "clsx";
import { Button } from "../../atoms/Button";
import { Icon, type IconName } from "../../atoms/Icon";

export type ErrorStateVariant = "inline" | "card" | "fullPage";

export interface ErrorStateProps {
  /** Error variant/layout */
  variant?: ErrorStateVariant;
  /** Error title */
  title?: string;
  /** Error description */
  description?: string;
  /** Error type for icon selection */
  errorType?:
    | "generic"
    | "network"
    | "permission"
    | "notFound"
    | "timeout"
    | "toolFailure";
  /** Whether to show the retry button */
  showRetry?: boolean;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Custom action button label */
  actionLabel?: string;
  /** Custom action callback */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
}

const errorTypeConfig: Record<
  NonNullable<ErrorStateProps["errorType"]>,
  { icon: IconName; defaultTitle: string; defaultDescription: string }
> = {
  generic: {
    icon: "exclamation-circle",
    defaultTitle: "Something went wrong",
    defaultDescription: "An unexpected error occurred. Please try again.",
  },
  network: {
    icon: "exclamation-circle",
    defaultTitle: "Connection error",
    defaultDescription:
      "Unable to connect to the server. Check your internet connection.",
  },
  permission: {
    icon: "x-circle",
    defaultTitle: "Access denied",
    defaultDescription: "You don't have permission to perform this action.",
  },
  notFound: {
    icon: "magnifying-glass",
    defaultTitle: "Not found",
    defaultDescription: "The requested resource couldn't be found.",
  },
  timeout: {
    icon: "clock",
    defaultTitle: "Request timed out",
    defaultDescription: "The request took too long. Please try again.",
  },
  toolFailure: {
    icon: "exclamation-triangle",
    defaultTitle: "Tool execution failed",
    defaultDescription:
      "The AI tool encountered an error while processing your request.",
  },
};

/**
 * ErrorState organism component.
 *
 * Displays error states with various layouts (inline, card, full page),
 * error explanations, and recovery actions.
 */
export const ErrorState = ({
  variant = "card",
  title,
  description,
  errorType = "generic",
  showRetry = true,
  onRetry,
  actionLabel,
  onAction,
  className,
}: ErrorStateProps) => {
  const config = errorTypeConfig[errorType];
  const displayTitle = title ?? config.defaultTitle;
  const displayDescription = description ?? config.defaultDescription;

  // Inline variant
  if (variant === "inline") {
    return (
      <div
        className={clsx(
          "flex items-center gap-2 text-sm text-error-600",
          className,
        )}
        role="alert"
      >
        <Icon name={config.icon} size="sm" className="flex-shrink-0" />
        <span>{displayDescription}</span>
        {showRetry && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-medium underline hover:no-underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <div
        className={clsx(
          "p-6 bg-error-50 border border-error-200 rounded-xl text-center",
          className,
        )}
        role="alert"
      >
        <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-4">
          <Icon name={config.icon} size="lg" className="text-error-500" />
        </div>

        <h3 className="text-lg font-semibold text-error-800 mb-2">
          {displayTitle}
        </h3>

        <p className="text-sm text-error-600 mb-4 max-w-sm mx-auto">
          {displayDescription}
        </p>

        <div className="flex items-center justify-center gap-3">
          {showRetry && onRetry && (
            <Button
              variant="ghost"
              onClick={onRetry}
              leadingIcon={<Icon name="refresh" size="sm" />}
            >
              Try again
            </Button>
          )}
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Full page variant
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
        className,
      )}
      role="alert"
    >
      <div className="w-20 h-20 rounded-full bg-error-100 flex items-center justify-center mb-6">
        <Icon
          name={config.icon}
          size="lg"
          className="text-error-500 w-10 h-10"
        />
      </div>

      <h1 className="text-2xl font-bold text-neutral-800 mb-3">
        {displayTitle}
      </h1>

      <p className="text-neutral-600 mb-8 max-w-md">{displayDescription}</p>

      <div className="flex items-center gap-4">
        {showRetry && onRetry && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onRetry}
            leadingIcon={<Icon name="refresh" size="sm" />}
          >
            Try again
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
