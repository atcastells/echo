import { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Spinner } from '../../atoms/Spinner';

export type ActionState = 'pending' | 'executing' | 'done' | 'failed';

export interface ActionSurfaceProps {
  /** Title of the action */
  title: string;
  /** Description of what the action will do */
  description?: ReactNode;
  /** Current state of the action */
  state?: ActionState;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Callback when confirm is clicked */
  onConfirm?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Callback when undo is clicked (for done state) */
  onUndo?: () => void;
  /** Callback when retry is clicked (for failed state) */
  onRetry?: () => void;
  /** Error message (for failed state) */
  errorMessage?: string;
  /** Success message (for done state) */
  successMessage?: string;
  /** Whether this is a destructive action */
  isDestructive?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const stateConfig: Record<ActionState, { borderClass: string; bgClass: string }> = {
  pending: { borderClass: 'border-primary-200', bgClass: 'bg-primary-50' },
  executing: { borderClass: 'border-primary-300', bgClass: 'bg-primary-50' },
  done: { borderClass: 'border-success-200', bgClass: 'bg-success-50' },
  failed: { borderClass: 'border-error-200', bgClass: 'bg-error-50' },
};

/**
 * ActionSurface organism component.
 *
 * Renders actionable UI from agent with confirmation flows,
 * state tracking, and undo/retry capabilities.
 */
export const ActionSurface = ({
  title,
  description,
  state = 'pending',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  onUndo,
  onRetry,
  errorMessage,
  successMessage,
  isDestructive = false,
  className,
}: ActionSurfaceProps) => {
  const config = stateConfig[state];

  return (
    <div
      className={clsx(
        'rounded-xl border p-4',
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* State indicator */}
        <div className="flex-shrink-0 mt-0.5">
          {state === 'executing' ? (
            <Spinner size="sm" variant="primary" />
          ) : state === 'done' ? (
            <Icon name="check-circle" size="md" className="text-success-500" />
          ) : state === 'failed' ? (
            <Icon name="x-circle" size="md" className="text-error-500" />
          ) : (
            <Icon
              name={isDestructive ? 'exclamation-triangle' : 'sparkles'}
              size="md"
              className={isDestructive ? 'text-error-500' : 'text-primary-500'}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              'font-medium',
              state === 'done' && 'text-success-800',
              state === 'failed' && 'text-error-800',
              state !== 'done' && state !== 'failed' && 'text-neutral-800'
            )}
          >
            {title}
          </h3>

          {/* Description (pending/executing) */}
          {description && (state === 'pending' || state === 'executing') && (
            <div className="mt-1 text-sm text-neutral-600">{description}</div>
          )}

          {/* Success message (done) */}
          {state === 'done' && successMessage && (
            <p className="mt-1 text-sm text-success-700">{successMessage}</p>
          )}

          {/* Error message (failed) */}
          {state === 'failed' && errorMessage && (
            <p className="mt-1 text-sm text-error-700">{errorMessage}</p>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            {/* Pending state: confirm/cancel */}
            {state === 'pending' && (
              <>
                {onConfirm && (
                  <Button
                    variant={isDestructive ? 'danger' : 'primary'}
                    size="sm"
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                )}
                {onCancel && (
                  <Button variant="ghost" size="sm" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                )}
              </>
            )}

            {/* Executing state: show progress text */}
            {state === 'executing' && (
              <span className="text-sm text-primary-700">Processing...</span>
            )}

            {/* Done state: undo option */}
            {state === 'done' && onUndo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                leadingIcon={<Icon name="refresh" size="sm" />}
              >
                Undo
              </Button>
            )}

            {/* Failed state: retry/cancel */}
            {state === 'failed' && (
              <>
                {onRetry && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onRetry}
                    leadingIcon={<Icon name="refresh" size="sm" />}
                  >
                    Retry
                  </Button>
                )}
                {onCancel && (
                  <Button variant="ghost" size="sm" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
