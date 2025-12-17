/**
 * Pages - Final assembled views
 *
 * Pages are specific instances of templates that show what a UI looks like
 * with real representative content in place.
 */

// Conversation app shell
export { ConversationApp } from "./ConversationApp";
export type { ConversationAppProps } from "./ConversationApp";

// Global state handlers
export {
  GlobalStates,
  OfflineBanner,
  RateLimitBanner,
  ErrorBoundary,
} from "./GlobalStates";
export type {
  OfflineBannerProps,
  RateLimitBannerProps,
  ErrorBoundaryProps,
} from "./GlobalStates";
