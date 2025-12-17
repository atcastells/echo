import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
  useId,
} from "react";
import { clsx } from "clsx";

export type TextInputSize = "sm" | "md" | "lg";

interface BaseTextInputProps {
  /** The size of the input */
  size?: TextInputSize;
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Whether to show character count */
  showCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Icon to display at the start of the input */
  leadingIcon?: ReactNode;
  /** Icon to display at the end of the input */
  trailingIcon?: ReactNode;
  /** Whether to show a clear button */
  showClear?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
}

export interface SingleLineInputProps
  extends
    BaseTextInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Whether the input is multiline */
  multiline?: false;
}

export interface MultiLineInputProps
  extends
    BaseTextInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Whether the input is multiline */
  multiline: true;
  /** Number of rows for multiline input */
  rows?: number;
}

export type TextInputProps = SingleLineInputProps | MultiLineInputProps;

const sizeStyles: Record<TextInputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const labelSizeStyles: Record<TextInputSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

/**
 * TextInput component for text entry.
 *
 * Supports single-line and multiline modes, with optional
 * labels, helper text, error states, character count, and icons.
 */
export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>((props, ref) => {
  const {
    size = "md",
    label,
    helperText,
    error,
    showCount = false,
    maxLength,
    leadingIcon,
    trailingIcon,
    showClear = false,
    onClear,
    className,
    disabled,
    value,
    defaultValue,
    onChange,
    ...rest
  } = props;

  const id = useId();
  const inputId = props.id || id;
  const [internalValue, setInternalValue] = useState(
    defaultValue?.toString() || "",
  );

  const currentValue = value !== undefined ? value.toString() : internalValue;
  const hasError = !!error;
  const showClearButton = showClear && currentValue.length > 0 && !disabled;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (value === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e as never);
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue("");
    }
    onClear?.();
  };

  const inputStyles = clsx(
    // Base styles
    "w-full rounded-lg border bg-white",
    "transition-colors duration-150 ease-out",
    "placeholder:text-neutral-400",
    // Focus styles
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    // Size styles
    sizeStyles[size],
    // State styles
    hasError
      ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
      : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20",
    disabled && "bg-neutral-50 text-neutral-500 cursor-not-allowed",
    // Icon padding
    leadingIcon && "pl-10",
    (trailingIcon || showClearButton) && "pr-10",
    className,
  );

  const renderInput = () => {
    if (props.multiline) {
      const {
        multiline: _multiline,
        rows = 3,
        ...textareaProps
      } = rest as MultiLineInputProps;
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={inputId}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={currentValue}
          onChange={handleChange}
          className={clsx(inputStyles, "resize-y min-h-[80px]")}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...textareaProps}
        />
      );
    }

    const { multiline: _multiline, size: _ignoreSize, ...inputProps } =
      rest as SingleLineInputProps;
    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        id={inputId}
        disabled={disabled}
        maxLength={maxLength}
        value={currentValue}
        onChange={handleChange}
        className={inputStyles}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        {...inputProps}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            "block font-medium text-neutral-700 mb-1.5",
            labelSizeStyles[size],
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none">
            {leadingIcon}
          </div>
        )}

        {renderInput()}

        {(trailingIcon || showClearButton) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="w-5 h-5 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Clear input"
              >
                <ClearIcon />
              </button>
            )}
            {trailingIcon && !showClearButton && (
              <div className="w-5 h-5 text-neutral-400 pointer-events-none">
                {trailingIcon}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-1.5">
        <div className="flex-1">
          {error && (
            <p id={`${inputId}-error`} className="text-sm text-error-600">
              {error}
            </p>
          )}
          {!error && helperText && (
            <p id={`${inputId}-helper`} className="text-sm text-neutral-500">
              {helperText}
            </p>
          )}
        </div>
        {showCount && maxLength && (
          <span className="text-xs text-neutral-400 ml-2">
            {currentValue.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

TextInput.displayName = "TextInput";

// Clear icon component
const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-full h-full"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);
