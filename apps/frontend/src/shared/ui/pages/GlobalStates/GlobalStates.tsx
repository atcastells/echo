import { Component, type ReactNode, type ErrorInfo } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';

// -------------------
// Offline Banner
// -------------------

export interface OfflineBannerProps {
  /** Whether the user is offline */
  isOffline: boolean;
  /** Callback when retry is clicked */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * OfflineBanner component.
 *
 * Displays a banner when the user loses network connectivity.
 */
export const OfflineBanner = ({
  isOffline,
  onRetry,
  className,
}: OfflineBannerProps) => {
  if (!isOffline) return null;

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50',
        'bg-warning-600 text-white',
        'px-4 py-2',
        'flex items-center justify-center gap-3',
        'animate-in slide-in-from-top duration-300',
        className
      )}
      role="alert"
    >
      <Icon name="exclamation-circle" size="sm" />
      <span className="text-sm font-medium">
        You're offline. Some features may be unavailable.
      </span>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="text-white hover:bg-white/20"
        >
          Retry
        </Button>
      )}
    </div>
  );
};

// -------------------
// Rate Limit Banner
// -------------------

export interface RateLimitBannerProps {
  /** Whether rate limited */
  isRateLimited: boolean;
  /** Seconds until rate limit resets */
  resetInSeconds?: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * RateLimitBanner component.
 *
 * Displays a banner when the user hits API rate limits.
 */
export const RateLimitBanner = ({
  isRateLimited,
  resetInSeconds,
  onDismiss,
  className,
}: RateLimitBannerProps) => {
  if (!isRateLimited) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50',
        'bg-error-600 text-white',
        'px-4 py-2',
        'flex items-center justify-center gap-3',
        'animate-in slide-in-from-top duration-300',
        className
      )}
      role="alert"
    >
      <Icon name="clock" size="sm" />
      <span className="text-sm font-medium">
        Rate limit reached.
        {resetInSeconds !== undefined && (
          <> Try again in {formatTime(resetInSeconds)}.</>
        )}
      </span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded"
          aria-label="Dismiss"
        >
          <Icon name="x-mark" size="sm" />
        </button>
      )}
    </div>
  );
};

// -------------------
// Error Boundary
// -------------------

export interface ErrorBoundaryProps {
  /** Child components */
  children: ReactNode;
  /** Fallback UI when error occurs */
  fallback?: ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Callback to reset the error state */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component.
 *
 * Catches JavaScript errors in child component tree and
 * displays a fallback UI.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-6">
              <Icon
                name="exclamation-circle"
                size="lg"
                className="text-error-500 w-10 h-10"
              />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-3">
              Something went wrong
            </h1>
            <p className="text-neutral-600 mb-6 max-w-md">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left max-w-md mx-auto">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs text-error-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => globalThis.location.reload()}
              >
                Refresh page
              </Button>
              <Button variant="ghost" onClick={this.handleReset}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// -------------------
// Combined GlobalStates wrapper
// -------------------

export interface GlobalStatesProps {
  /** Whether user is offline */
  isOffline?: boolean;
  /** Whether rate limited */
  isRateLimited?: boolean;
  /** Rate limit reset time */
  rateLimitResetInSeconds?: number;
  /** Child content */
  children: ReactNode;
  /** Callbacks */
  onRetryConnection?: () => void;
  onDismissRateLimit?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onResetError?: () => void;
}

/**
 * GlobalStates component.
 *
 * Wrapper component that handles offline state, rate limiting,
 * and error boundaries for the application.
 */
export const GlobalStates = ({
  isOffline = false,
  isRateLimited = false,
  rateLimitResetInSeconds,
  children,
  onRetryConnection,
  onDismissRateLimit,
  onError,
  onResetError,
}: GlobalStatesProps) => {
  return (
    <ErrorBoundary onError={onError} onReset={onResetError}>
      <OfflineBanner isOffline={isOffline} onRetry={onRetryConnection} />
      <RateLimitBanner
        isRateLimited={isRateLimited}
        resetInSeconds={rateLimitResetInSeconds}
        onDismiss={onDismissRateLimit}
      />
      <div className={clsx((isOffline || isRateLimited) && 'pt-10')}>
        {children}
      </div>
    </ErrorBoundary>
  );
};
