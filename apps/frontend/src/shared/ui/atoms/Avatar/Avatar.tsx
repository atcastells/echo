import { type ImgHTMLAttributes, useState } from "react";
import { clsx } from "clsx";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "size"
> {
  /** The size of the avatar */
  size?: AvatarSize;
  /** The name to derive initials from (used as fallback) */
  name?: string;
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Status indicator */
  status?: AvatarStatus;
  /** Whether to show a ring around the avatar */
  showRing?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5 border",
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-2",
  lg: "w-3 h-3 border-2",
  xl: "w-4 h-4 border-2",
};

const statusColorStyles: Record<AvatarStatus, string> = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  busy: "bg-error-500",
  away: "bg-warning-500",
};

/**
 * Gets initials from a name string.
 * Returns up to 2 characters from the first letters of words.
 */
const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Generates a consistent color based on a string.
 * Used to give each user a unique avatar background color.
 */
const getColorFromName = (name: string): string => {
  const colors = [
    "bg-primary-500",
    "bg-info-500",
    "bg-success-500",
    "bg-warning-500",
    "bg-error-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

/**
 * Avatar component for displaying user profile images.
 *
 * Supports multiple sizes, status indicators, and falls back to
 * initials or a default icon when no image is provided.
 */
export const Avatar = ({
  size = "md",
  name,
  src,
  alt,
  status,
  showRing = false,
  className,
  ...props
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;
  const initials = name ? getInitials(name) : null;
  const bgColor = name ? getColorFromName(name) : "bg-neutral-400";

  return (
    <div className="relative inline-block">
      <div
        className={clsx(
          // Base styles
          "relative rounded-full overflow-hidden",
          "flex items-center justify-center",
          "font-medium text-white",
          // Size styles
          sizeStyles[size],
          // Background color (for initials/fallback)
          !showImage && bgColor,
          // Ring styles
          showRing && "ring-2 ring-white ring-offset-2",
          className,
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : initials ? (
          <span className="select-none">{initials}</span>
        ) : (
          <DefaultAvatarIcon className="w-3/5 h-3/5" />
        )}
      </div>

      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0",
            "rounded-full border-white",
            statusSizeStyles[size],
            statusColorStyles[status],
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

// Default user icon
const DefaultAvatarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);
