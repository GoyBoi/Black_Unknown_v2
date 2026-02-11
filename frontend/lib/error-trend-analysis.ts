// lib/error-trend-analysis.ts

// Define types for error trend analysis
export interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  component?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  errorType: 'javascript' | 'network' | 'resource' | 'promise' | 'custom';
  status?: number; // For network errors
  resourceUrl?: string; // For resource errors
  userId?: string;
  sessionId?: string;
}

export interface ErrorTrend {
  date: string;
  totalErrors: number;
  criticalErrors: number;
  highSeverityErrors: number;
  mediumSeverityErrors: number;
  lowSeverityErrors: number;
  errorRate: number; // Errors per thousand page views
}

export interface ErrorTrendAnalysis {
  overallTrend: {
    totalErrors: number;
    errorRate: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    weeklyChange: number; // Percentage change
  };
  severityDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  topErrorMessages: {
    message: string;
    count: number;
    change: number; // Percentage change from previous period
  }[];
  errorTrends: ErrorTrend[];
  errorSources: {
    frontend: number;
    backend: number;
    network: number;
    resource: number;
  };
  resolutionMetrics: {
    avgResolutionTime: number; // in hours
    resolutionRate: number; // percentage
  };
  errorPredictions: {
    predictedErrors: number;
    confidence: number; // percentage
    nextPeriod: string; // date range
  };
}

// In-memory storage for error events (in production, this would be in a database)
const errorEvents: ErrorEvent[] = [];

// Function to add an error event
export const addErrorEvent = (error: Omit<ErrorEvent, 'id' | 'timestamp'>): ErrorEvent => {
  const newError: ErrorEvent = {
    ...error,
    id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  errorEvents.push(newError);

  // Keep only the last 10000 errors to prevent memory issues
  if (errorEvents.length > 10000) {
    errorEvents.splice(0, errorEvents.length - 10000);
  }

  return newError;
};

// Function to get error events
export const getErrorEvents = (limit?: number, filter?: { 
  startDate?: number; 
  endDate?: number; 
  severity?: string; 
  type?: string 
}): ErrorEvent[] => {
  let events = [...errorEvents];

  // Apply filters
  if (filter?.startDate) {
    events = events.filter(e => e.timestamp >= filter.startDate!);
  }

  if (filter?.endDate) {
    events = events.filter(e => e.timestamp <= filter.endDate!);
  }

  if (filter?.severity) {
    events = events.filter(e => e.severity === filter.severity);
  }

  if (filter?.type) {
    events = events.filter(e => e.errorType === filter.type);
  }

  // Sort by timestamp (newest first)
  events.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? events.slice(0, limit) : events;
};

// Function to calculate error trend analysis
export const calculateErrorTrendAnalysis = (timeRange?: { start: number; end: number }): ErrorTrendAnalysis => {
  const events = timeRange 
    ? getErrorEvents(undefined, { 
        startDate: timeRange.start, 
        endDate: timeRange.end 
      })
    : getErrorEvents();

  if (events.length === 0) {
    return {
      overallTrend: {
        totalErrors: 0,
        errorRate: 0,
        trendDirection: 'stable',
        weeklyChange: 0
      },
      severityDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      topErrorMessages: [],
      errorTrends: [],
      errorSources: {
        frontend: 0,
        backend: 0,
        network: 0,
        resource: 0
      },
      resolutionMetrics: {
        avgResolutionTime: 0,
        resolutionRate: 0
      },
      errorPredictions: {
        predictedErrors: 0,
        confidence: 0,
        nextPeriod: ''
      }
    };
  }

  // Calculate total errors
  const totalErrors = events.length;
  
  // Calculate severity distribution
  const severityCounts = events.reduce((acc, event) => {
    acc[event.severity]++;
    return acc;
  }, { low: 0, medium: 0, high: 0, critical: 0 } as Record<string, number>);
  
  // Calculate error trends by date
  const dateMap = new Map<string, ErrorTrend>();
  events.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!dateMap.has(date)) {
      dateMap.set(date, {
        date,
        totalErrors: 0,
        criticalErrors: 0,
        highSeverityErrors: 0,
        mediumSeverityErrors: 0,
        lowSeverityErrors: 0,
        errorRate: 0
      });
    }
    
    const trend = dateMap.get(date)!;
    trend.totalErrors++;
    
    switch (event.severity) {
      case 'critical':
        trend.criticalErrors++;
        break;
      case 'high':
        trend.highSeverityErrors++;
        break;
      case 'medium':
        trend.mediumSeverityErrors++;
        break;
      case 'low':
        trend.lowSeverityErrors++;
        break;
    }
  });
  
  // Calculate error rates (simplified - in reality this would be based on page views)
  const errorTrends = Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(trend => ({
      ...trend,
      errorRate: (trend.totalErrors / 1000) * 1000 // Simplified calculation
    }));
  
  // Calculate top error messages
  const messageCounts = new Map<string, number>();
  events.forEach(event => {
    const count = messageCounts.get(event.message) || 0;
    messageCounts.set(event.message, count + 1);
  });
  
  const topErrorMessages = Array.from(messageCounts.entries())
    .map(([message, count]) => ({ message, count, change: 0 })) // Simplified change calculation
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate error sources
  const errorSources = {
    frontend: events.filter(e => e.errorType === 'javascript' || e.errorType === 'promise').length,
    backend: 0, // Would be calculated from backend errors in a real implementation
    network: events.filter(e => e.errorType === 'network').length,
    resource: events.filter(e => e.errorType === 'resource').length
  };
  
  // Calculate trend direction (simplified)
  let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (errorTrends.length >= 2) {
    const recent = errorTrends[errorTrends.length - 1].totalErrors;
    const previous = errorTrends[errorTrends.length - 2].totalErrors;
    
    if (recent > previous) {
      trendDirection = 'increasing';
    } else if (recent < previous) {
      trendDirection = 'decreasing';
    }
  }
  
  // Calculate weekly change (simplified)
  const weeklyChange = errorTrends.length >= 7 
    ? ((errorTrends[errorTrends.length - 1].totalErrors - errorTrends[errorTrends.length - 7].totalErrors) / 
       errorTrends[errorTrends.length - 7].totalErrors) * 100
    : 0;
  
  // Calculate resolution metrics (simplified for demo)
  const resolutionMetrics = {
    avgResolutionTime: 4.5, // hours
    resolutionRate: 78 // percentage
  };
  
  // Calculate error predictions (simplified)
  const errorPredictions = {
    predictedErrors: Math.floor(totalErrors * 1.1), // Predict 10% increase
    confidence: 85, // percentage
    nextPeriod: `Next 7 days (${new Date().toISOString().split('T')[0]} to ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`
  };

  return {
    overallTrend: {
      totalErrors,
      errorRate: (totalErrors / 1000) * 1000, // Simplified calculation
      trendDirection,
      weeklyChange
    },
    severityDistribution: severityCounts,
    topErrorMessages,
    errorTrends,
    errorSources,
    resolutionMetrics,
    errorPredictions
  };
};

// Function to generate mock error data for demo purposes
export const generateMockErrorTrendData = () => {
  // Clear existing data
  errorEvents.length = 0;
  
  // Generate mock error events
  for (let i = 0; i < 200; i++) {
    const now = Date.now();
    const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    
    const severities: ErrorEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
    const errorTypes: ErrorEvent['errorType'][] = ['javascript', 'network', 'resource', 'promise', 'custom'];
    
    const error: ErrorEvent = {
      id: `err_${i}`,
      message: [
        'Cannot read property \'name\' of undefined',
        'Network request failed',
        'Failed to load resource',
        'Unhandled promise rejection',
        'Custom error occurred',
        'Maximum call stack size exceeded',
        'Invalid state error',
        'Security error'
      ][Math.floor(Math.random() * 8)],
      stack: 'Error stack trace would go here...',
      component: ['ProductCard', 'Header', 'Cart', 'Checkout', 'Footer'][Math.floor(Math.random() * 5)],
      url: [
        '/product/123',
        '/shop',
        '/cart',
        '/checkout',
        '/account',
        '/about'
      ][Math.floor(Math.random() * 6)],
      userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
      timestamp,
      severity: severities[Math.floor(Math.random() * severities.length)],
      errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
      status: errorTypes[Math.floor(Math.random() * errorTypes.length)] === 'network' ? 500 : undefined,
      userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 50)}` : undefined,
      sessionId: `session_${Math.floor(Math.random() * 100)}`
    };
    
    errorEvents.push(error);
  }
};

// Function to format timestamp to readable date
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Function to get severity color
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-blue-500';
    default:
      return 'text-foreground/60';
  }
};

// Function to get severity badge class
export const getSeverityBadgeClass = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-500';
    case 'high':
      return 'bg-orange-500/20 text-orange-500';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'low':
      return 'bg-blue-500/20 text-blue-500';
    default:
      return 'bg-foreground/10 text-foreground/60';
  }
};