import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { clsx } from "clsx";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  /** The content to display in the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Position of the tooltip relative to the trigger */
  position?: TooltipPosition;
  /** Delay in ms before showing the tooltip */
  delay?: number;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the tooltip container */
  className?: string;
  /** Additional CSS classes for the tooltip content */
  tooltipClassName?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-neutral-800 border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-neutral-800 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-neutral-800 border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-neutral-800 border-y-transparent border-l-transparent",
};

/**
 * Tooltip component for displaying contextual information on hover.
 *
 * Supports multiple positions, configurable delay, and rich content.
 */
export const Tooltip = ({
  content,
  children,
  position = "top",
  delay = 300,
  disabled = false,
  className,
  tooltipClassName,
  ...props
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={clsx("relative inline-flex", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      {...props}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={clsx(
            "absolute z-50 px-3 py-1.5 text-sm text-white bg-neutral-800 rounded-md shadow-lg whitespace-nowrap",
            "animate-in fade-in duration-150",
            positionStyles[position],
            tooltipClassName,
          )}
        >
          {content}
          {/* Arrow */}
          <div
            className={clsx("absolute w-0 h-0 border-4", arrowStyles[position])}
          />
        </div>
      )}
    </div>
  );
};
