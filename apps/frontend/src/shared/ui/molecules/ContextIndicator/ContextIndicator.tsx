import { clsx } from "clsx";
import { Icon } from "../../atoms/Icon";
import { Tooltip } from "../../atoms/Tooltip";
import { Button } from "../../atoms/Button";

export interface ContextIndicatorProps {
  /** Whether memory/context is enabled */
  isEnabled?: boolean;
  /** Current context usage (0-100 percentage) */
  usagePercent?: number;
  /** Maximum context tokens */
  maxTokens?: number;
  /** Current used tokens */
  usedTokens?: number;
  /** Whether to show the reset button */
  showResetButton?: boolean;
  /** Callback when reset is clicked */
  onReset?: () => void;
  /** Callback when toggle is clicked */
  onToggle?: () => void;
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

const formatTokens = (tokens: number): string => {
  if (tokens < 1000) return tokens.toString();
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}k`;
  return `${(tokens / 1000000).toFixed(1)}m`;
};

const getUsageLevel = (
  percent: number,
): "low" | "medium" | "high" | "critical" => {
  if (percent < 50) return "low";
  if (percent < 75) return "medium";
  if (percent < 90) return "high";
  return "critical";
};

const usageLevelColors: Record<ReturnType<typeof getUsageLevel>, string> = {
  low: "bg-success-500",
  medium: "bg-warning-400",
  high: "bg-warning-500",
  critical: "bg-error-500",
};

const sizeConfig = {
  sm: {
    container: "px-2 py-1.5",
    text: "text-xs",
    progressHeight: "h-1",
    gap: "gap-1.5",
  },
  md: {
    container: "px-3 py-2",
    text: "text-sm",
    progressHeight: "h-1.5",
    gap: "gap-2",
  },
};

const privacyTooltipContent = `Context Memory

When enabled, the AI remembers your conversation history
to provide more personalized and relevant responses.

Your data is encrypted and only used for this session.
You can reset the context at any time.`;

/**
 * ContextIndicator component for showing memory/context state.
 *
 * Displays whether context memory is on/off, current usage level,
 * and provides controls for resetting context.
 */
export const ContextIndicator = ({
  isEnabled = true,
  usagePercent = 0,
  maxTokens,
  usedTokens,
  showResetButton = true,
  onReset,
  onToggle,
  size = "md",
  className,
}: ContextIndicatorProps) => {
  const config = sizeConfig[size];
  const usageLevel = getUsageLevel(usagePercent);

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-lg",
        "bg-neutral-50 border border-neutral-200",
        config.container,
        config.gap,
        className,
      )}
    >
      {/* Memory icon with toggle */}
      <Tooltip content={privacyTooltipContent} position="bottom">
        <button
          type="button"
          onClick={onToggle}
          disabled={!onToggle}
          className={clsx(
            "flex items-center gap-1.5 rounded-md transition-colors",
            onToggle && "hover:bg-neutral-100 cursor-pointer",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          )}
        >
          <Icon
            name={isEnabled ? "sparkles" : "x-circle"}
            size="sm"
            className={isEnabled ? "text-primary-500" : "text-neutral-400"}
          />
          <span
            className={clsx(
              config.text,
              "font-medium",
              isEnabled ? "text-neutral-700" : "text-neutral-500",
            )}
          >
            {isEnabled ? "Memory on" : "Memory off"}
          </span>
        </button>
      </Tooltip>

      {/* Usage progress (only when enabled) */}
      {isEnabled && usagePercent > 0 && (
        <>
          <span className="text-neutral-300">|</span>

          <Tooltip
            content={
              maxTokens && usedTokens
                ? `${formatTokens(usedTokens)} / ${formatTokens(maxTokens)} tokens used`
                : `${usagePercent}% context used`
            }
            position="bottom"
          >
            <div className="flex items-center gap-2">
              {/* Progress bar */}
              <div
                className={clsx(
                  "w-16 rounded-full bg-neutral-200 overflow-hidden",
                  config.progressHeight,
                )}
              >
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-300",
                    usageLevelColors[usageLevel],
                  )}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>

              {/* Percentage text */}
              <span
                className={clsx(
                  config.text,
                  "tabular-nums",
                  usageLevel === "critical"
                    ? "text-error-600 font-medium"
                    : "text-neutral-500",
                )}
              >
                {usagePercent}%
              </span>
            </div>
          </Tooltip>
        </>
      )}

      {/* Reset button */}
      {isEnabled && showResetButton && onReset && usagePercent > 0 && (
        <>
          <span className="text-neutral-300">|</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leadingIcon={<Icon name="refresh" size="sm" />}
            className="text-neutral-500 hover:text-neutral-700 !px-1.5 !py-0.5"
          >
            Reset
          </Button>
        </>
      )}
    </div>
  );
};
