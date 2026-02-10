// lib/error-tracking.ts

// Define error types
export interface TrackedError {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  additionalData?: Record<string, any>;
}

// In-memory error storage (in production, this would be sent to an external service)
const errors: TrackedError[] = [];

// Function to log errors
export const logError = (
  error: Error,
  componentStack?: string,
  additionalData?: Record<string, any>,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): string => {
  const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const trackedError: TrackedError = {
    id: errorId,
    message: error.message,
    stack: error.stack,
    component: componentStack,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    timestamp: Date.now(),
    severity,
    userId: typeof window !== 'undefined' ? localStorage.getItem('userId') || undefined : undefined,
    additionalData
  };

  errors.push(trackedError);

  // In a real implementation, this would send the error to an external service
  console.group(`%c${severity.toUpperCase()} Error: ${error.message}`, 
    severity === 'critical' ? 'color: red; font-weight: bold;' :
    severity === 'high' ? 'color: orange; font-weight: bold;' :
    severity === 'medium' ? 'color: yellow;' : 'color: gray;'
  );
  console.error(error);
  console.log('Error ID:', errorId);
  console.log('Component:', componentStack);
  console.log('URL:', typeof window !== 'undefined' ? window.location.href : 'server');
  console.groupEnd();

  return errorId;
};

// Function to get recent errors
export const getRecentErrors = (limit: number = 10): TrackedError[] => {
  return errors
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Function to get error count by severity
export const getErrorCounts = (): Record<string, number> => {
  return errors.reduce((acc, error) => {
    acc[error.severity] = (acc[error.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// Function to simulate error reporting to external service
export const reportErrorToService = async (errorId: string) => {
  const error = errors.find(err => err.id === errorId);
  if (!error) {
    throw new Error(`Error with ID ${errorId} not found`);
  }

  // In a real implementation, this would send the error to an external service like Sentry, Bugsnag, etc.
  console.log(`Reporting error ${errorId} to external service:`, error);
  
  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to initialize error tracking
export const initErrorTracking = () => {
  // Capture unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      logError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'Unhandled Promise Rejection',
        { promiseEvent: true },
        'high'
      );
    });

    // Capture uncaught exceptions
    window.addEventListener('error', (event) => {
      logError(
        event.error instanceof Error ? event.error : new Error(event.message),
        'Global Error Handler',
        { filename: event.filename, lineno: event.lineno, colno: event.colno },
        'high'
      );
    });
  }
};