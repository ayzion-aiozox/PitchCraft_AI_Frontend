/**
 * Breakpoint media queries aligned with global SCSS (styles.scss).
 * Use these in BreakpointService and in any logic-driven responsiveness
 * so TypeScript and CSS stay in sync.
 */
export const BREAKPOINTS = {
  /** max-width: 768px - mobile */
  MOBILE: '(max-width: 768px)',
  /** max-width: 1200px - tablet */
  TABLET: '(max-width: 1200px)',
  /** min-width: 769px - above mobile */
  ABOVE_MOBILE: '(min-width: 769px)',
  /** min-width: 1201px - desktop */
  DESKTOP: '(min-width: 1201px)',
} as const;

/** Breakpoint names for use in templates and logic */
export type BreakpointMode = 'mobile' | 'tablet' | 'desktop';

/** Pixel values for reference (e.g. in JS calculations) */
export const BREAKPOINT_PX = {
  MOBILE_MAX: 768,
  TABLET_MAX: 1200,
} as const;
