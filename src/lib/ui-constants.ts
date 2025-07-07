/**
 * UI spacing and sizing constants
 */
export const UI_CONSTANTS = {
  spacing: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    xxl: 'gap-8',
  },

  padding: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-6',
    xxl: 'p-8',
  },

  margin: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-3',
    lg: 'm-4',
    xl: 'm-6',
    xxl: 'm-8',
  },

  maxWidth: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  },

  borderRadius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  },

  iconSizes: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },

  animations: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    fadeIn: 'animate-fade-in',
  },

  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
} as const;

/**
 * Component-specific UI configurations
 */
export const COMPONENT_CONFIGS = {
  assetConverter: {
    maxWidth: UI_CONSTANTS.maxWidth['2xl'],
    spacing: UI_CONSTANTS.spacing.xl,
    cardPadding: UI_CONSTANTS.padding.xl,
  },

  assetPairSelector: {
    maxWidth: UI_CONSTANTS.maxWidth['2xl'],
    gridCols: 'grid-cols-1 sm:grid-cols-3',
    buttonPadding: UI_CONSTANTS.padding.lg,
  },

  walletModal: {
    maxWidth: UI_CONSTANTS.maxWidth.md,
    spacing: UI_CONSTANTS.spacing.lg,
  },

  header: {
    logoSize: UI_CONSTANTS.iconSizes.xl,
    iconSize: UI_CONSTANTS.iconSizes.sm,
    padding: UI_CONSTANTS.padding.lg,
  },
} as const;

/**
 * Status colors for different states
 */
export const STATUS_COLORS = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-blue-600',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
} as const;

/**
 * Common cursor states
 */
export const CURSOR_STATES = {
  pointer: 'cursor-pointer',
  notAllowed: 'cursor-not-allowed',
  default: 'cursor-default',
  text: 'cursor-text',
} as const;
