import { type ReactNode } from "react";
import { clsx } from "clsx";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  /** The content of the badge */
  children?: ReactNode;
  /** The visual style variant */
  variant?: BadgeVariant;
  /** The size of the badge */
  size?: BadgeSize;
  /** Whether to render as a dot indicator (no content) */
  dot?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  error: "bg-error-100 text-error-700",
  info: "bg-info-100 text-info-700",
};

const dotVariantStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
  info: "bg-info-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
};

/**
 * Badge component for displaying labels, counts, or status indicators.
 *
 * Can be rendered as a text badge or a simple dot indicator.
 */
export const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  className,
}: BadgeProps) => {
  if (dot) {
    return (
      <span
        className={clsx(
          "inline-block rounded-full",
          dotSizeStyles[size],
          dotVariantStyles[variant],
          className,
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center",
        "font-medium rounded-full",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
