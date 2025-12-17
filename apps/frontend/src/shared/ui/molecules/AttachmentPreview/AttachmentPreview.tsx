import { clsx } from "clsx";
import { Icon, type IconName } from "../../atoms/Icon";
import { Button } from "../../atoms/Button";
import { Spinner } from "../../atoms/Spinner";

export interface AttachmentFile {
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload progress (0-100), undefined if not uploading */
  progress?: number;
  /** Error message if upload failed */
  error?: string;
}

export interface AttachmentPreviewProps {
  /** The attachment file to preview */
  file: AttachmentFile;
  /** Whether the file can be removed */
  removable?: boolean;
  /** Callback when remove is clicked */
  onRemove?: (fileId: string) => void;
  /** Callback when retry is clicked (for failed uploads) */
  onRetry?: (fileId: string) => void;
  /** Size variant */
  size?: "sm" | "md";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Formats file size in human-readable format.
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Gets the appropriate icon for a file type.
 */
const getFileIcon = (type: string): IconName => {
  if (type.startsWith("image/")) return "document";
  if (type === "application/pdf") return "document";
  if (type.includes("word") || type.includes("document")) return "document";
  if (type.includes("spreadsheet") || type.includes("excel")) return "document";
  if (type.includes("text/")) return "document";
  return "paper-clip";
};

/**
 * Gets file type label for display.
 */
const getFileTypeLabel = (type: string, name: string): string => {
  // Extract extension from name as fallback
  const extension = name.split(".").pop()?.toUpperCase() || "";

  if (type === "application/pdf") return "PDF";
  if (type.includes("word")) return "DOC";
  if (type.includes("spreadsheet") || type.includes("excel")) return "XLS";
  if (type.startsWith("image/")) return extension || "IMG";
  if (type.includes("text/")) return "TXT";
  return extension || "FILE";
};

const sizeConfig = {
  sm: {
    container: "p-2",
    icon: "sm" as const,
    text: "text-xs",
    gap: "gap-2",
  },
  md: {
    container: "p-3",
    icon: "md" as const,
    text: "text-sm",
    gap: "gap-3",
  },
};

/**
 * AttachmentPreview component for displaying file attachments.
 *
 * Shows file type icon, name, size, upload progress,
 * and remove/retry actions.
 */
export const AttachmentPreview = ({
  file,
  removable = true,
  onRemove,
  onRetry,
  size = "md",
  className,
}: AttachmentPreviewProps) => {
  const config = sizeConfig[size];
  const isUploading = file.progress !== undefined && file.progress < 100;
  const hasError = !!file.error;
  const isComplete =
    file.progress === 100 || (file.progress === undefined && !file.error);

  return (
    <div
      className={clsx(
        "flex items-center rounded-lg border",
        config.container,
        config.gap,
        hasError
          ? "bg-error-50 border-error-200"
          : "bg-neutral-50 border-neutral-200",
        className,
      )}
    >
      {/* File type icon */}
      <div
        className={clsx(
          "flex-shrink-0 flex items-center justify-center",
          "w-10 h-10 rounded-lg",
          hasError ? "bg-error-100" : "bg-neutral-100",
        )}
      >
        {isUploading ? (
          <Spinner size="sm" variant="primary" />
        ) : hasError ? (
          <Icon
            name="exclamation-circle"
            size={config.icon}
            className="text-error-500"
          />
        ) : (
          <Icon
            name={getFileIcon(file.type)}
            size={config.icon}
            className="text-neutral-500"
          />
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            config.text,
            "font-medium truncate",
            hasError ? "text-error-800" : "text-neutral-800",
          )}
          title={file.name}
        >
          {file.name}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              "text-xs",
              hasError ? "text-error-600" : "text-neutral-500",
            )}
          >
            {hasError
              ? file.error
              : `${getFileTypeLabel(file.type, file.name)} · ${formatFileSize(file.size)}`}
          </span>
        </div>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="mt-1.5 h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {hasError && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRetry(file.id)}
            className="text-error-600 hover:text-error-700"
          >
            Retry
          </Button>
        )}

        {removable && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className={clsx(
              "p-1 rounded-md transition-colors",
              "hover:bg-neutral-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            )}
            aria-label={`Remove ${file.name}`}
          >
            <Icon name="x-mark" size="sm" className="text-neutral-500" />
          </button>
        )}
      </div>

      {/* Complete check */}
      {isComplete && !isUploading && !hasError && (
        <Icon
          name="check-circle"
          size="sm"
          className="flex-shrink-0 text-success-500"
        />
      )}
    </div>
  );
};
