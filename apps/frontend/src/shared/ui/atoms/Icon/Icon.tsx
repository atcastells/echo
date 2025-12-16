import { type SVGProps } from "react";
import { clsx } from "clsx";
import { icons } from "./constants";

export type IconSize = "sm" | "md" | "lg" | "xl";
export type IconName = keyof typeof icons;

export interface IconProps extends SVGProps<SVGSVGElement> {
  /** The name of the icon */
  name: IconName;
  /** The size of the icon */
  size?: IconSize;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles: Record<IconSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

/**
 * Icon component for displaying SVG icons.
 *
 * Uses Heroicons-style paths with consistent sizing and color inheritance.
 */
export const Icon = ({ name, size = "md", className, ...props }: IconProps) => {
  const path = icons[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={clsx(sizeStyles[size], className)}
      aria-hidden="true"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
};
