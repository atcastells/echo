import { clsx } from "clsx";

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerVariant = "primary" | "secondary" | "white";

export interface SpinnerProps {
  /** The size of the spinner */
  size?: SpinnerSize;
  /** The color variant */
  variant?: SpinnerVariant;
  /** Additional CSS classes */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const variantStyles: Record<SpinnerVariant, { circle: string; path: string }> =
  {
    primary: {
      circle: "text-primary-200",
      path: "text-primary-600",
    },
    secondary: {
      circle: "text-neutral-200",
      path: "text-neutral-600",
    },
    white: {
      circle: "text-white/30",
      path: "text-white",
    },
  };

/**
 * Spinner component for loading states.
 *
 * Use to indicate that content is loading or a process is in progress.
 */
export const Spinner = ({
  size = "md",
  variant = "primary",
  className,
  label = "Loading",
}: SpinnerProps) => {
  const colors = variantStyles[variant];

  return (
    <div
      role="status"
      aria-label={label}
      className={clsx("inline-flex", className)}
    >
      <svg
        className={clsx("animate-spin", sizeStyles[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className={clsx("opacity-25", colors.circle)}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={colors.path}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Whether to render as a circle */
  circle?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton component for content placeholder loading states.
 *
 * Use to show a placeholder while content is loading.
 */
export const Skeleton = ({
  width,
  height,
  circle = false,
  className,
}: SkeletonProps) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-neutral-200",
        circle ? "rounded-full" : "rounded",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
};
