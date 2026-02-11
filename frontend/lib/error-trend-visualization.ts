// lib/error-trend-visualization.ts

// Define types for error trend visualization
export interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  component?: string;
  pageUrl: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  errorType: 'javascript' | 'network' | 'resource' | 'promise' | 'custom';
  status?: number; // For network errors
  resourceUrl?: string; // For resource errors
  userId?: string;
  sessionId?: string;
}

export interface ErrorTrendVisualizationData {
  totalErrors: number;
  errorRate: number; // Errors per thousand page views
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  weeklyChange: number; // Percentage change
  errorsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  errorsByType: {
    type: string;
    count: number;
  }[];
  errorTrends: {
    date: string;
    totalErrors: number;
    criticalErrors: number;
    highSeverityErrors: number;
    mediumSeverityErrors: number;
    lowSeverityErrors: number;
  }[];
  topErrorMessages: {
    message: string;
    count: number;
    change: number; // Percentage change from previous period
  }[];
  errorFrequencyByPage: {
    page: string;
    errorCount: number;
    errorRate: number; // errors per page view
  }[];
  errorFrequencyByHour: {
    hour: number;
    errorCount: number;
  }[];
  resolutionMetrics: {
    avgResolutionTime: number; // in hours
    resolutionRate: number; // percentage
  };
  errorSources: {
    frontend: number;
    backend: number;
    network: number;
    resource: number;
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

  // Keep only the last 1000 errors to prevent memory issues
  if (errorEvents.length > 1000) {
    errorEvents.splice(0, errorEvents.length - 1000);
  }

  return newError;
};

// Function to calculate error trend visualization data
export const calculateErrorTrendVisualization = (timeRange?: { start: number; end: number }): ErrorTrendVisualizationData => {
  const errors = timeRange 
    ? errorEvents.filter(e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end)
    : [...errorEvents];

  if (errors.length === 0) {
    return {
      totalErrors: 0,
      errorRate: 0,
      trendDirection: 'stable',
      weeklyChange: 0,
      errorsBySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      errorsByType: [],
      errorTrends: [],
      topErrorMessages: [],
      errorFrequencyByPage: [],
      errorFrequencyByHour: [],
      resolutionMetrics: {
        avgResolutionTime: 0,
        resolutionRate: 0
      },
      errorSources: {
        frontend: 0,
        backend: 0,
        network: 0,
        resource: 0
      },
      errorPredictions: {
        predictedErrors: 0,
        confidence: 0,
        nextPeriod: ''
      }
    };
  }

  // Calculate total errors
  const totalErrors = errors.length;
  
  // Calculate error rate (simplified - in reality this would be based on page views)
  const errorRate = (totalErrors / 1000) * 1000; // Per thousand page views
  
  // Calculate errors by severity
  const errorsBySeverity = {
    low: errors.filter(e => e.severity === 'low').length,
    medium: errors.filter(e => e.severity === 'medium').length,
    high: errors.filter(e => e.severity === 'high').length,
    critical: errors.filter(e => e.severity === 'critical').length
  };
  
  // Calculate errors by type
  const typeCountMap = new Map<string, number>();
  errors.forEach(error => {
    const current = typeCountMap.get(error.errorType) || 0;
    typeCountMap.set(error.errorType, current + 1);
  });
  
  const errorsByType = Array.from(typeCountMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate error trends by date
  const dateMap = new Map<string, { 
    total: number; 
    critical: number; 
    high: number; 
    medium: number; 
    low: number 
  }>();
  
  errors.forEach(error => {
    const date = new Date(error.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    const current = dateMap.get(date) || { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
    
    current.total++;
    
    switch (error.severity) {
      case 'critical':
        current.critical++;
        break;
      case 'high':
        current.high++;
        break;
      case 'medium':
        current.medium++;
        break;
      case 'low':
        current.low++;
        break;
    }
    
    dateMap.set(date, current);
  });
  
  const errorTrends = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      totalErrors: data.total,
      criticalErrors: data.critical,
      highSeverityErrors: data.high,
      mediumSeverityErrors: data.medium,
      lowSeverityErrors: data.low
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate top error messages
  const messageCountMap = new Map<string, number>();
  errors.forEach(error => {
    const current = messageCountMap.get(error.message) || 0;
    messageCountMap.set(error.message, current + 1);
  });
  
  const topErrorMessages = Array.from(messageCountMap.entries())
    .map(([message, count]) => ({ message, count, change: 0 })) // Simplified change calculation
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate error frequency by page
  const pageCountMap = new Map<string, number>();
  errors.forEach(error => {
    const current = pageCountMap.get(error.pageUrl) || 0;
    pageCountMap.set(error.pageUrl, current + 1);
  });
  
  const errorFrequencyByPage = Array.from(pageCountMap.entries())
    .map(([page, errorCount]) => ({
      page,
      errorCount,
      errorRate: errorCount // Simplified - in reality this would be errors per page view
    }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10);
  
  // Calculate error frequency by hour
  const hourCountMap = new Map<number, number>();
  errors.forEach(error => {
    const hour = new Date(error.timestamp).getHours();
    const current = hourCountMap.get(hour) || 0;
    hourCountMap.set(hour, current + 1);
  });
  
  const errorFrequencyByHour = Array.from(hourCountMap.entries())
    .map(([hour, errorCount]) => ({ hour, errorCount }))
    .sort((a, b) => a.hour - b.hour);
  
  // Calculate resolution metrics (simplified)
  const resolutionMetrics = {
    avgResolutionTime: 4.5, // hours
    resolutionRate: 78 // percentage
  };
  
  // Calculate error sources
  const errorSources = {
    frontend: errors.filter(e => e.errorType === 'javascript' || e.errorType === 'promise').length,
    backend: 0, // Would be calculated from backend errors in a real implementation
    network: errors.filter(e => e.errorType === 'network').length,
    resource: errors.filter(e => e.errorType === 'resource').length
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
  
  // Calculate error predictions (simplified)
  const errorPredictions = {
    predictedErrors: Math.floor(totalErrors * 1.1), // Predict 10% increase
    confidence: 85, // percentage
    nextPeriod: `Next 7 days (${new Date().toISOString().split('T')[0]} to ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`
  };

  return {
    totalErrors,
    errorRate,
    trendDirection,
    weeklyChange,
    errorsBySeverity,
    errorsByType,
    errorTrends,
    topErrorMessages,
    errorFrequencyByPage,
    errorFrequencyByHour,
    resolutionMetrics,
    errorSources,
    errorPredictions
  };
};

// Function to get error events
export const getErrorEvents = (limit?: number, filter?: { 
  severity?: string; 
  type?: string; 
  pageUrl?: string 
}): ErrorEvent[] => {
  let events = [...errorEvents];

  // Apply filters
  if (filter?.severity) {
    events = events.filter(e => e.severity === filter.severity);
  }

  if (filter?.type) {
    events = events.filter(e => e.errorType === filter.type);
  }

  if (filter?.pageUrl) {
    events = events.filter(e => e.pageUrl === filter.pageUrl);
  }

  // Sort by timestamp (newest first)
  events.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? events.slice(0, limit) : events;
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

// Function to format number with thousands separator
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return num.toFixed(2) + '%';
};

// Function to generate mock error data for demo purposes
export const generateMockErrorData = () => {
  // Clear existing data
  errorEvents.length = 0;
  
  // Generate mock error events
  const errorTypes: ErrorEvent['errorType'][] = ['javascript', 'network', 'resource', 'promise', 'custom'];
  const severities: ErrorEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
  const pages = ['/', '/shop', '/product/123', '/cart', '/checkout', '/about', '/contact'];
  
  for (let i = 0; i < 200; i++) {
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];
    
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
      pageUrl: page,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days
      severity,
      errorType,
      status: errorType === 'network' ? [404, 500, 503][Math.floor(Math.random() * 3)] : undefined,
      resourceUrl: errorType === 'resource' ? 'https://example.com/missing-resource.js' : undefined,
      userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 50)}` : undefined,
      sessionId: `session_${Math.floor(Math.random() * 100)}`
    };
    
    errorEvents.push(error);
  }
  
  // Sort by timestamp (newest first)
  errorEvents.sort((a, b) => b.timestamp - a.timestamp);
};