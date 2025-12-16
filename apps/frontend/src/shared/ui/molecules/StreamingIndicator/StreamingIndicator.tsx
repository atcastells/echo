import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';

export interface StreamingIndicatorProps {
  /** Partial content being streamed */
  partialContent?: string;
  /** Whether to show the typing animation */
  showTyping?: boolean;
  /** Whether to show the stop button */
  showStopButton?: boolean;
  /** Callback when stop is clicked */
  onStop?: () => void;
  /** Label text for streaming state */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StreamingIndicator component for showing active streaming state.
 *
 * Displays typing animation, partial content, and stop affordance
 * while an AI response is being streamed.
 */
export const StreamingIndicator = ({
  partialContent,
  showTyping = true,
  showStopButton = true,
  onStop,
  label = 'Echo is typing',
  className,
}: StreamingIndicatorProps) => {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {/* Partial content display */}
      {partialContent && (
        <div className="text-neutral-800 whitespace-pre-wrap">
          {partialContent}
          {showTyping && <BlinkingCursor />}
        </div>
      )}

      {/* Typing indicator with stop button */}
      <div className="flex items-center gap-3">
        {showTyping && !partialContent && <TypingDots />}
        
        <span className="text-sm text-neutral-500 flex items-center gap-2">
          {label}
          {showTyping && partialContent && <TypingDotsInline />}
        </span>

        {showStopButton && onStop && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onStop}
            leadingIcon={<Icon name="stop" size="sm" />}
            className="text-neutral-500 hover:text-neutral-700"
          >
            Stop
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Animated typing dots indicator.
 */
const TypingDots = () => (
  <div className="flex items-center gap-1" aria-label="Typing">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={clsx(
          'w-2 h-2 rounded-full bg-neutral-400',
          'animate-bounce'
        )}
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '0.6s',
        }}
      />
    ))}
  </div>
);

/**
 * Smaller inline typing dots for use alongside text.
 */
const TypingDotsInline = () => (
  <span className="inline-flex items-center gap-0.5" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className={clsx(
          'w-1 h-1 rounded-full bg-neutral-400',
          'animate-bounce'
        )}
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '0.6s',
        }}
      />
    ))}
  </span>
);

/**
 * Blinking cursor for end of streaming content.
 */
const BlinkingCursor = () => (
  <span
    className="inline-block w-0.5 h-5 bg-primary-600 ml-0.5 animate-pulse"
    aria-hidden="true"
  />
);
