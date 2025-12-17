import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { Toast, type ToastData, type ToastVariant } from "./Toast";
import { ToastContext } from "./hooks";

type ToastHelperOptions = Partial<
  Omit<ToastData, "id" | "message" | "variant">
>;

export interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: ToastHelperOptions) => string;
  error: (message: string, options?: ToastHelperOptions) => string;
  warning: (message: string, options?: ToastHelperOptions) => string;
  info: (message: string, options?: ToastHelperOptions) => string;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default duration in ms for toasts */
  defaultDuration?: number;
  /** Maximum number of visible toasts */
  maxToasts?: number;
  /** Position of the toast container */
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const positionStyles: Record<
  NonNullable<ToastProviderProps["position"]>,
  string
> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

let toastIdCounter = 0;

/**
 * ToastProvider manages the toast notification queue and rendering.
 *
 * Wrap your app with this provider and use the useToast hook to show notifications.
 */
export const ToastProvider = ({
  children,
  defaultDuration = 5000,
  maxToasts = 5,
  position = "top-right",
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeToast = useCallback((id: string) => {
    // Clear the timer if it exists
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id = `toast-${++toastIdCounter}`;
      const duration = toast.duration ?? defaultDuration;

      setToasts((prev) => {
        // Remove oldest toasts if we exceed maxToasts
        const newToasts = [...prev, { ...toast, id }];
        if (newToasts.length > maxToasts) {
          const removed = newToasts.splice(0, newToasts.length - maxToasts);
          // Clear timers for removed toasts
          removed.forEach((t) => {
            const timer = timersRef.current.get(t.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(t.id);
            }
          });
        }
        return newToasts;
      });

      // Auto-dismiss after duration (0 = persist)
      if (duration > 0) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [defaultDuration, maxToasts, removeToast],
  );

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // Helper methods for common toast types
  const createVariantHelper = useCallback(
    (variant: ToastVariant) =>
      (message: string, options?: ToastHelperOptions) =>
        addToast({ ...options, message, variant }),
    [addToast],
  );

  const success = createVariantHelper("success");
  const error = createVariantHelper("error");
  const warning = createVariantHelper("warning");
  const info = createVariantHelper("info");

  const contextValue = useMemo(
    () => ({ toasts, addToast, removeToast, success, error, warning, info }),
    [toasts, addToast, removeToast, success, error, warning, info],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div
          className={`fixed z-50 flex flex-col gap-2 ${positionStyles[position]}`}
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
