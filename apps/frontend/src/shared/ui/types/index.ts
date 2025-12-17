/**
 * Common component types for the UI library
 */

/**
 * Size variants available for components
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Color variants available for components
 */
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

/**
 * Style variants for components (solid, outline, ghost)
 */
export type StyleVariant = "solid" | "outline" | "ghost";

/**
 * Common props that most components share
 */
export interface CommonProps {
  /** Additional CSS class names */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** ID attribute for the component */
  id?: string;
}

/**
 * Props for components with size variants
 */
export interface SizeProps {
  /** Size of the component */
  size?: Size;
}

/**
 * Props for components with color variants
 */
export interface ColorProps {
  /** Color variant */
  color?: ColorVariant;
}

/**
 * Props for components with style variants
 */
export interface VariantProps {
  /** Style variant */
  variant?: StyleVariant;
}

/**
 * Polymorphic component props - allows "as" prop for changing element type
 */
export type AsProps<T extends React.ElementType> = {
  as?: T;
};

/**
 * Utility type for polymorphic components
 */
export type PolymorphicProps<
  T extends React.ElementType,
  Props = object,
> = Props &
  AsProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props | "as">;
