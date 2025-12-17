import { useState } from "react";
import { clsx } from "clsx";
import { Button } from "../../atoms/Button";
import { Icon } from "../../atoms/Icon";
import { TextInput } from "../../atoms/TextInput";

export type FeedbackState = "none" | "positive" | "negative";

export interface FeedbackControlsProps {
  /** Current feedback state */
  feedback?: FeedbackState;
  /** Whether to show the feedback input form */
  showFeedbackInput?: boolean;
  /** Whether to show the regenerate button */
  showRegenerate?: boolean;
  /** Callback when thumbs up is clicked */
  onThumbsUp?: () => void;
  /** Callback when thumbs down is clicked */
  onThumbsDown?: () => void;
  /** Callback when feedback is submitted */
  onSubmitFeedback?: (feedback: string) => void;
  /** Callback when regenerate is clicked */
  onRegenerate?: () => void;
  /** Placeholder for feedback input */
  feedbackPlaceholder?: string;
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

/**
 * FeedbackControls organism component.
 *
 * Provides thumbs up/down buttons, optional freeform feedback input,
 * and regenerate action for AI responses.
 */
export const FeedbackControls = ({
  feedback = "none",
  showFeedbackInput = false,
  showRegenerate = true,
  onThumbsUp,
  onThumbsDown,
  onSubmitFeedback,
  onRegenerate,
  feedbackPlaceholder = "What could be improved?",
  size = "md",
  className,
}: FeedbackControlsProps) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(showFeedbackInput);

  const handleThumbsDown = () => {
    onThumbsDown?.();
    setIsInputVisible(true);
  };

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      onSubmitFeedback?.(feedbackText.trim());
      setFeedbackText("");
      setIsInputVisible(false);
    }
  };

  const buttonSize = size === "sm" ? "p-1.5" : "p-2";
  const iconSize = size === "sm" ? "sm" : "md";

  return (
    <div className={clsx("space-y-3", className)}>
      {/* Action buttons row */}
      <div className="flex items-center gap-2">
        {/* Thumbs up */}
        <button
          type="button"
          onClick={onThumbsUp}
          className={clsx(
            buttonSize,
            "rounded-lg transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            feedback === "positive"
              ? "bg-success-100 text-success-600"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
          )}
          aria-label="Good response"
          aria-pressed={feedback === "positive"}
        >
          <Icon name="hand-thumb-up" size={iconSize} />
        </button>

        {/* Thumbs down */}
        <button
          type="button"
          onClick={handleThumbsDown}
          className={clsx(
            buttonSize,
            "rounded-lg transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            feedback === "negative"
              ? "bg-error-100 text-error-600"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
          )}
          aria-label="Bad response"
          aria-pressed={feedback === "negative"}
        >
          <Icon name="hand-thumb-down" size={iconSize} />
        </button>

        {/* Regenerate */}
        {showRegenerate && onRegenerate && (
          <>
            <div className="w-px h-4 bg-neutral-200 mx-1" />
            <button
              type="button"
              onClick={onRegenerate}
              className={clsx(
                buttonSize,
                "rounded-lg transition-all duration-150",
                "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              )}
              aria-label="Regenerate response"
            >
              <Icon name="refresh" size={iconSize} />
            </button>
          </>
        )}
      </div>

      {/* Feedback input (shown after thumbs down) */}
      {isInputVisible && feedback === "negative" && (
        <div className="flex gap-2">
          <TextInput
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={feedbackPlaceholder}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!feedbackText.trim()}
          >
            Send
          </Button>
        </div>
      )}

      {/* Thank you message for positive feedback */}
      {feedback === "positive" && (
        <p className="text-sm text-success-600 flex items-center gap-1">
          <Icon name="check-circle" size="sm" />
          Thanks for your feedback!
        </p>
      )}
    </div>
  );
};
