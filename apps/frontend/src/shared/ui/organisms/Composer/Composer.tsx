import { useRef, useCallback, useEffect, type KeyboardEvent } from 'react';
import { useMachine } from '@xstate/react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { TextInput } from '../../atoms/TextInput';
import { Tooltip } from '../../atoms/Tooltip';
import {
  AttachmentPreview,
  type AttachmentFile,
} from '../../molecules/AttachmentPreview';
import { composerMachine, type ComposerContext } from '../../../state-machines';

/** Machine states for external control */
export type ComposerMachineState =
  | 'idle'
  | 'typing'
  | 'submitting'
  | 'error'
  | 'disabled'
  | 'blocked';

export interface ComposerProps {
  /** Current input value (controlled mode) */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when message is submitted */
  onSubmit?: (message: string, attachments?: AttachmentFile[]) => void;
  /** Callback when attachments are added */
  onAttach?: (files: FileList) => void;
  /** Callback when an attachment is removed */
  onRemoveAttachment?: (fileId: string) => void;
  /** Current attachments */
  attachments?: AttachmentFile[];
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character limit */
  maxLength?: number;
  /**
   * Whether the composer is disabled (e.g., during streaming)
   * @deprecated Use `machineState="disabled"` instead for explicit state control
   */
  disabled?: boolean;
  /** Whether to show the attachment button */
  showAttachButton?: boolean;
  /** Whether to show the voice input button */
  showVoiceButton?: boolean;
  /** Accepted file types for attachments */
  acceptedFileTypes?: string;
  /** Keyboard shortcut hint text */
  submitShortcut?: string;
  /**
   * Initial/forced machine state for Storybook and testing.
   * When provided, the component will start in this state.
   */
  initialMachineState?: ComposerMachineState;
  /**
   * Initial context for the machine (for testing error states, etc.)
   */
  initialContext?: Partial<ComposerContext>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Composer organism component.
 *
 * A complete message input area with text input, send button,
 * attachment support, and keyboard shortcuts.
 *
 * ## State Machine
 *
 * This component uses an XState machine with the following states:
 * - **idle**: Ready for input
 * - **typing**: User is actively typing
 * - **submitting**: Message is being sent
 * - **error**: Submission failed
 * - **disabled**: Composer disabled (e.g., agent streaming)
 * - **blocked**: Composer blocked (e.g., rate limited)
 *
 * ```
 * idle ──TYPE──> typing ──SUBMIT──> submitting ──SUCCESS──> idle
 *                   │                    │
 *                   └──CLEAR──> idle     └──ERROR──> error ──RETRY──> submitting
 * ```
 */
export const Composer = ({
  value,
  onChange,
  onSubmit,
  onAttach,
  onRemoveAttachment,
  attachments = [],
  placeholder = 'Type your message...',
  maxLength = 4000,
  disabled = false,
  showAttachButton = true,
  showVoiceButton = false,
  acceptedFileTypes = '.pdf,.doc,.docx,.txt,.md',
  submitShortcut = '⌘ Enter',
  initialMachineState,
  initialContext,
  className,
}: ComposerProps) => {
  // Create machine
  const [state, send] = useMachine(composerMachine);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Handle initial machine state for Storybook testing
  useEffect(() => {
    if (!initialMachineState || initialMachineState === 'idle') return;

    // Transition to the requested initial state
    switch (initialMachineState) {
      case 'typing':
        send({ type: 'TYPE', value: value ?? '' });
        break;
      case 'submitting':
        send({ type: 'TYPE', value: value ?? 'Submitting...' });
        send({ type: 'SUBMIT' });
        break;
      case 'error':
        send({ type: 'TYPE', value: value ?? '' });
        send({ type: 'SUBMIT' });
        send({
          type: 'SUBMIT_ERROR',
          error: initialContext?.errorMessage ?? 'Submission failed',
        });
        break;
      case 'disabled':
        send({ type: 'DISABLE' });
        break;
      case 'blocked':
        send({ type: 'BLOCK' });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Sync external disabled prop with machine state (backward compatibility)
  useEffect(() => {
    // Skip if we're using initialMachineState
    if (initialMachineState) return;

    if (disabled && !state.matches('disabled') && !state.matches('blocked')) {
      send({ type: 'DISABLE' });
    } else if (!disabled && state.matches('disabled')) {
      send({ type: 'ENABLE' });
    }
  }, [disabled, state, send, initialMachineState]);

  // Sync controlled value with machine context
  useEffect(() => {
    // Skip initial sync if using initialMachineState
    if (value !== undefined && value !== state.context.inputValue) {
      send({ type: 'TYPE', value });
    }
  }, [value, state.context.inputValue, send]);

  // Derive UI state from machine
  const isDisabled = state.matches('disabled') || state.matches('blocked');
  const isSubmitting = state.matches('submitting');
  const isError = state.matches('error');
  const inputValue = state.context.inputValue;
  const hasContent = inputValue.trim().length > 0;
  const hasAttachments = attachments.length > 0;
  const canSubmit = (hasContent || hasAttachments) && !isDisabled && !isSubmitting;
  const characterCount = inputValue.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isOverLimit = characterCount > maxLength;

  const handleChange = useCallback(
    (newValue: string) => {
      send({ type: 'TYPE', value: newValue });
      onChange?.(newValue);
    },
    [send, onChange]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const message = inputValue.trim();
    send({ type: 'SUBMIT' });

    // Call onSubmit and handle success/error
    try {
      onSubmit?.(message, hasAttachments ? attachments : undefined);
      send({ type: 'SUBMIT_SUCCESS' });
    } catch (error) {
      send({
        type: 'SUBMIT_ERROR',
        error: error instanceof Error ? error.message : 'Submission failed',
      });
    }

    // Refocus input
    textInputRef.current?.focus();
  }, [canSubmit, inputValue, attachments, hasAttachments, onSubmit, send]);

  const handleRetry = useCallback(() => {
    send({ type: 'RETRY' });
    handleSubmit();
  }, [send, handleSubmit]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttach?.(files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div
      className={clsx(
        'bg-white border border-neutral-200 rounded-xl shadow-sm',
        'focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100',
        'transition-all duration-150',
        isDisabled && 'opacity-60',
        isError && 'border-error-300 focus-within:border-error-400 focus-within:ring-error-100',
        className
      )}
      data-state={state.value}
    >
      {/* Error message */}
      {isError && state.context.errorMessage && (
        <div className="px-3 pt-3 flex items-center justify-between">
          <span className="text-sm text-error-600">{state.context.errorMessage}</span>
          <Button variant="ghost" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {/* Attachments preview */}
      {hasAttachments && (
        <div className="p-3 border-b border-neutral-100 space-y-2">
          {attachments.map((file) => (
            <AttachmentPreview
              key={file.id}
              file={file}
              size="sm"
              onRemove={onRemoveAttachment}
            />
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-3">
        <TextInput
          ref={textInputRef}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          multiline
          rows={3}
          className="border-0 p-0 focus:ring-0 resize-none"
          aria-label="Message input"
        />
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between px-3 pb-3">
        {/* Left actions */}
        <div className="flex items-center gap-1">
          {showAttachButton && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                aria-label="Attach files"
              />
              <Tooltip content="Attach files" position="top">
                <button
                  type="button"
                  onClick={handleAttachClick}
                  disabled={isDisabled}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    isDisabled && 'cursor-not-allowed opacity-50'
                  )}
                  aria-label="Attach files"
                >
                  <Icon name="paper-clip" size="md" />
                </button>
              </Tooltip>
            </>
          )}

          {showVoiceButton && (
            <Tooltip content="Voice input" position="top">
              <button
                type="button"
                disabled={isDisabled}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  isDisabled && 'cursor-not-allowed opacity-50'
                )}
                aria-label="Voice input"
              >
                <Icon name="microphone" size="md" />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Right side: character count and submit */}
        <div className="flex items-center gap-3">
          {/* Character count */}
          {maxLength && characterCount > 0 && (
            <span
              className={clsx(
                'text-xs tabular-nums',
                isOverLimit && 'text-error-600 font-medium',
                isNearLimit && !isOverLimit && 'text-warning-600',
                !isNearLimit && 'text-neutral-400'
              )}
            >
              {characterCount}/{maxLength}
            </span>
          )}

          {/* Submit button */}
          <Tooltip content={`Send message (${submitShortcut})`} position="top">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit || isOverLimit}
              isLoading={isSubmitting}
              leadingIcon={<Icon name="paper-airplane" size="sm" />}
              className="px-4"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
