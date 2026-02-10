// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { logError } from '@/lib/error-tracking';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    logError(error, errorInfo.componentStack || undefined, { errorInfo }, 'high');
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback UI if provided, otherwise use default
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
          <p className="text-foreground/80 mb-6">
            We've been notified of this issue and are working to fix it.
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90 transition-colors"
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-6 p-4 bg-foreground/5 rounded-lg text-left max-w-2xl">
              <h3 className="font-bold text-foreground mb-2">Error Details:</h3>
              <pre className="text-sm text-foreground/80 overflow-auto">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Export a default error fallback component
export const DefaultErrorFallback: React.ComponentType<{ error: Error; resetError: () => void }> = 
({ error, resetError }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
    <h2 className="text-2xl font-bold text-foreground mb-4">Oops! Something went wrong</h2>
    <p className="text-foreground/80 mb-6">
      We've recorded this issue and are working to resolve it.
    </p>
    <button
      onClick={resetError}
      className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90 transition-colors"
    >
      Try Again
    </button>
    {process.env.NODE_ENV === 'development' && (
      <div className="mt-6 p-4 bg-foreground/5 rounded-lg text-left max-w-2xl">
        <h3 className="font-bold text-foreground mb-2">Error Details:</h3>
        <pre className="text-sm text-foreground/80 overflow-auto">
          {error.stack}
        </pre>
      </div>
    )}
  </div>
);