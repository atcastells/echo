import { clsx } from "clsx";
import { Icon } from "../Icon";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  message: string;
  variant?: ToastVariant;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps {
  /** Toast data */
  toast: ToastData;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-success-50 border-success-200 text-success-800",
  error: "bg-error-50 border-error-200 text-error-800",
  warning: "bg-warning-50 border-warning-200 text-warning-800",
  info: "bg-info-50 border-info-200 text-info-800",
};

const iconByVariant: Record<ToastVariant, Parameters<typeof Icon>[0]["name"]> =
  {
    success: "check-circle",
    error: "x-circle",
    warning: "exclamation-circle",
    info: "information-circle",
  };

const iconColorByVariant: Record<ToastVariant, string> = {
  success: "text-success-500",
  error: "text-error-500",
  warning: "text-warning-500",
  info: "text-info-500",
};

/**
 * Toast component for displaying transient notifications.
 *
 * Use with ToastProvider and useToast hook for automatic management.
 */
export const Toast = ({ toast, onDismiss, className }: ToastProps) => {
  const { id, message, variant = "info", title, action } = toast;

  return (
    <div
      role="alert"
      className={clsx(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm",
        "animate-in slide-in-from-right duration-300",
        variantStyles[variant],
        className,
      )}
    >
      {/* Icon */}
      <Icon
        name={iconByVariant[variant]}
        size="md"
        className={clsx("flex-shrink-0 mt-0.5", iconColorByVariant[variant])}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium text-sm mb-1">{title}</p>}
        <p className="text-sm">{message}</p>

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className={clsx(
              "mt-2 text-sm font-medium underline underline-offset-2",
              "hover:opacity-80 transition-opacity",
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        aria-label="Dismiss"
      >
        <Icon name="x-mark" size="sm" />
      </button>
    </div>
  );
};
