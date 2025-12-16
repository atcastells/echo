import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { TextInput } from '../../atoms/TextInput';
import { Tooltip } from '../../atoms/Tooltip';
import {
  AttachmentPreview,
  type AttachmentFile,
} from '../../molecules/AttachmentPreview';

export interface ComposerProps {
  /** Current input value */
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
  /** Whether the composer is disabled (e.g., during streaming) */
  disabled?: boolean;
  /** Whether to show the attachment button */
  showAttachButton?: boolean;
  /** Whether to show the voice input button */
  showVoiceButton?: boolean;
  /** Accepted file types for attachments */
  acceptedFileTypes?: string;
  /** Keyboard shortcut hint text */
  submitShortcut?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Composer organism component.
 *
 * A complete message input area with text input, send button,
 * attachment support, and keyboard shortcuts.
 */
export const Composer = ({
  value = '',
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
  className,
}: ComposerProps) => {
  const [localValue, setLocalValue] = useState(value);
  const inputValue = onChange ? value : localValue;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = inputValue.trim().length > 0;
  const hasAttachments = attachments.length > 0;
  const canSubmit = (hasContent || hasAttachments) && !disabled;
  const characterCount = inputValue.length;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isOverLimit = characterCount > maxLength;

  const handleChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      } else {
        setLocalValue(newValue);
      }
    },
    [onChange]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const message = inputValue.trim();
    onSubmit?.(message, hasAttachments ? attachments : undefined);

    // Clear input after submit
    if (onChange) {
      onChange('');
    } else {
      setLocalValue('');
    }

    // Refocus input
    textInputRef.current?.focus();
  }, [canSubmit, inputValue, attachments, hasAttachments, onSubmit, onChange]);

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
        disabled && 'opacity-60',
        className
      )}
    >
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
          disabled={disabled}
          multiline
          rows={1}
          maxRows={6}
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
                  disabled={disabled}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    disabled && 'cursor-not-allowed opacity-50'
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
                disabled={disabled}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  disabled && 'cursor-not-allowed opacity-50'
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
              leadingIcon={<Icon name="paper-airplane" size="sm" />}
              className="px-4"
            >
              Send
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
