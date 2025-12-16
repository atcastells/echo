import { createContext, useContext } from "react";
import type { ToastContextValue } from "./ToastProvider";

export const ToastContext = createContext<ToastContextValue | null>(null);


/**
 * Hook to access toast notifications.
 *
 * Must be used within a ToastProvider.
 */


export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
