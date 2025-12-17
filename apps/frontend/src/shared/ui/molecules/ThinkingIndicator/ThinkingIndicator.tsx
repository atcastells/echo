import { useState } from "react";
import { clsx } from "clsx";
import { Icon, type IconName } from "../../atoms/Icon";
import { Spinner } from "../../atoms/Spinner";

export interface ThinkingStep {
  /** Unique identifier */
  id: string;
  /** Display label for the step */
  label: string;
  /** Current status of the step */
  status: "pending" | "active" | "completed" | "failed";
  /** Icon to display */
  icon?: IconName;
}

export interface ThinkingIndicatorProps {
  /** Current thinking/reasoning label */
  label?: string;
  /** Steps or tools being used */
  steps?: ThinkingStep[];
  /** Whether to show expandable details */
  expandable?: boolean;
  /** Initially expanded state */
  defaultExpanded?: boolean;
  /** Time elapsed in milliseconds */
  elapsedMs?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ThinkingIndicator component for showing reasoning state.
 *
 * Distinct from streaming - shows when the AI is "thinking"
 * or using tools before generating a response.
 */
export const ThinkingIndicator = ({
  label = "Thinking",
  steps = [],
  expandable = true,
  defaultExpanded = false,
  elapsedMs,
  className,
}: ThinkingIndicatorProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatElapsed = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const hasSteps = steps.length > 0;
  const canExpand = expandable && hasSteps;

  return (
    <div
      className={clsx(
        "bg-primary-50 border border-primary-100 rounded-lg overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => canExpand && setIsExpanded(!isExpanded)}
        disabled={!canExpand}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3",
          canExpand && "hover:bg-primary-100/50 cursor-pointer",
          "transition-colors duration-150",
        )}
      >
        {/* Animated brain/thinking icon */}
        <div className="relative">
          <Icon
            name="sparkles"
            size="md"
            className="text-primary-600 animate-pulse"
          />
        </div>

        {/* Label and elapsed time */}
        <div className="flex-1 text-left">
          <span className="text-sm font-medium text-primary-800">{label}</span>
          {elapsedMs !== undefined && (
            <span className="ml-2 text-xs text-primary-500">
              {formatElapsed(elapsedMs)}
            </span>
          )}
        </div>

        {/* Expand/collapse indicator */}
        {canExpand && (
          <Icon
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size="sm"
            className="text-primary-400"
          />
        )}
      </button>

      {/* Steps (expandable) */}
      {isExpanded && hasSteps && (
        <div className="px-4 pb-3 pt-1 border-t border-primary-100">
          <div className="space-y-2">
            {steps.map((step) => (
              <StepItem key={step.id} step={step} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface StepItemProps {
  step: ThinkingStep;
}

const StepItem = ({ step }: StepItemProps) => {
  const statusConfig: Record<
    ThinkingStep["status"],
    { icon: IconName | null; colorClass: string }
  > = {
    pending: { icon: null, colorClass: "text-neutral-400" },
    active: { icon: null, colorClass: "text-primary-600" },
    completed: { icon: "check-circle", colorClass: "text-success-600" },
    failed: { icon: "x-circle", colorClass: "text-error-600" },
  };

  const config = statusConfig[step.status];

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      <div className={clsx("flex-shrink-0", config.colorClass)}>
        {step.status === "active" ? (
          <Spinner size="sm" variant="primary" />
        ) : step.status === "pending" ? (
          <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
        ) : config.icon ? (
          <Icon name={config.icon} size="sm" />
        ) : null}
      </div>

      {/* Step icon (if provided) */}
      {step.icon && (
        <Icon name={step.icon} size="sm" className={config.colorClass} />
      )}

      {/* Step label */}
      <span
        className={clsx(
          "text-sm",
          step.status === "active" && "font-medium text-primary-800",
          step.status === "completed" && "text-neutral-600",
          step.status === "pending" && "text-neutral-400",
          step.status === "failed" && "text-error-700",
        )}
      >
        {step.label}
      </span>
    </div>
  );
};
