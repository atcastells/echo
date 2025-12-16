import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for merging class names
 * Combines clsx for conditional classes
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Common component size variants
 */
export const sizeVariants = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
  xl: 'text-xl px-6 py-3',
} as const;

/**
 * Common component color variants for primary, secondary, etc.
 */
export const colorVariants = {
  primary: {
    solid: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    outline:
      'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  },
  secondary: {
    solid: 'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500',
    outline:
      'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500',
  },
  success: {
    solid: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
  },
  warning: {
    solid: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500',
    outline: 'border border-amber-500 text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
    ghost: 'text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
  },
  danger: {
    solid: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
  },
} as const;

/**
 * Focus ring styles for accessibility
 */
export const focusRing =
  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';

/**
 * Disabled state styles
 */
export const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

/**
 * Transition styles for interactive elements
 */
export const transitionStyles = 'transition-colors duration-150 ease-in-out';
