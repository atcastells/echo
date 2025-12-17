import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The visual style variant of the button */
  variant?: ButtonVariant;
  /** The size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Icon to display before the button text */
  leadingIcon?: ReactNode;
  /** Icon to display after the button text */
  trailingIcon?: ReactNode;
  /** The content of the button */
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    "bg-primary-600 text-white",
    "hover:bg-primary-700",
    "focus-visible:ring-primary-500",
    "active:bg-primary-800",
    "disabled:bg-primary-300 disabled:cursor-not-allowed",
  ),
  secondary: clsx(
    "bg-neutral-100 text-neutral-800 border border-neutral-300",
    "hover:bg-neutral-200",
    "focus-visible:ring-neutral-500",
    "active:bg-neutral-300",
    "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed",
  ),
  ghost: clsx(
    "bg-transparent text-neutral-700",
    "hover:bg-neutral-100",
    "focus-visible:ring-neutral-500",
    "active:bg-neutral-200",
    "disabled:text-neutral-400 disabled:hover:bg-transparent disabled:cursor-not-allowed",
  ),
  destructive: clsx(
    "bg-error-600 text-white",
    "hover:bg-error-700",
    "focus-visible:ring-error-500",
    "active:bg-error-800",
    "disabled:bg-error-300 disabled:cursor-not-allowed",
  ),
  danger: clsx(
    "bg-error-600 text-white",
    "hover:bg-error-700",
    "focus-visible:ring-error-500",
    "active:bg-error-800",
    "disabled:bg-error-300 disabled:cursor-not-allowed",
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

/**
 * Button component for user interactions.
 *
 * Supports multiple variants (primary, secondary, ghost, destructive),
 * sizes (sm, md, lg), and states (loading, disabled).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          // Base styles
          "inline-flex items-center justify-center",
          "font-medium rounded-lg",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Custom className
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner className={iconSizeStyles[size]} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leadingIcon && (
              <span className={clsx("flex-shrink-0", iconSizeStyles[size])}>
                {leadingIcon}
              </span>
            )}
            {children}
            {trailingIcon && (
              <span className={clsx("flex-shrink-0", iconSizeStyles[size])}>
                {trailingIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

// Simple loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={clsx("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
