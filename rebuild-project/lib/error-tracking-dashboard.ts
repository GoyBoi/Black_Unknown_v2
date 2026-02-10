// lib/error-tracking-dashboard.ts

// Define types for error tracking
export interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  component?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  sessionId?: string;
  errorType: 'javascript' | 'network' | 'resource' | 'promise' | 'custom';
  status?: number; // For network errors
  resourceUrl?: string; // For resource errors
}

export interface ErrorReport {
  id: string;
  timestamp: number;
  errorEvents: ErrorEvent[];
  summary: {
    totalErrors: number;
    criticalErrors: number;
    highSeverityErrors: number;
    mediumSeverityErrors: number;
    lowSeverityErrors: number;
    uniqueErrors: number;
    topErrorMessages: { message: string; count: number }[];
    errorRate: number; // Errors per thousand page views
  };
  environment: {
    userAgent: string;
    url: string;
    referrer?: string;
    viewport: {
      width: number;
      height: number;
    };
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
    };
  };
}

export interface ErrorAnalytics {
  totalErrors: number;
  errorRate: number; // Errors per thousand page views
  criticalErrors: number;
  resolvedErrors: number;
  unresolvedErrors: number;
  avgResolutionTime: number; // in hours
  topErrorMessages: { message: string; count: number }[];
  errorTrend: { date: string; count: number }[];
  errorDistribution: {
    byType: { type: string; count: number }[];
    bySeverity: { severity: string; count: number }[];
    byPage: { page: string; count: number }[];
    byBrowser: { browser: string; count: number }[];
    byDevice: { device: string; count: number }[];
  };
  errorSources: {
    frontend: number;
    backend: number;
    network: number;
    resource: number;
  };
}

// In-memory storage for error reports (in production, this would be in a database)
const errorReports: ErrorReport[] = [];

// Function to add an error report
export const addErrorReport = (report: Omit<ErrorReport, 'id' | 'timestamp'>): ErrorReport => {
  const newReport: ErrorReport = {
    ...report,
    id: `err_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  errorReports.unshift(newReport);

  // Keep only the last 1000 reports to prevent memory issues
  if (errorReports.length > 1000) {
    errorReports.length = 1000;
  }

  return newReport;
};

// Function to get all error reports
export const getErrorReports = (limit?: number): ErrorReport[] => {
  return limit ? errorReports.slice(0, limit) : [...errorReports];
};

// Function to calculate error analytics
export const calculateErrorAnalytics = (timeRange?: { start: number; end: number }): ErrorAnalytics => {
  const reports = timeRange 
    ? errorReports.filter(r => r.timestamp >= timeRange.start && r.timestamp <= timeRange.end)
    : [...errorReports];

  if (reports.length === 0) {
    return {
      totalErrors: 0,
      errorRate: 0,
      criticalErrors: 0,
      resolvedErrors: 0,
      unresolvedErrors: 0,
      avgResolutionTime: 0,
      topErrorMessages: [],
      errorTrend: [],
      errorDistribution: {
        byType: [],
        bySeverity: [],
        byPage: [],
        byBrowser: [],
        byDevice: []
      },
      errorSources: {
        frontend: 0,
        backend: 0,
        network: 0,
        resource: 0
      }
    };
  }

  // Calculate total errors
  const totalErrors = reports.reduce((sum, report) => sum + report.summary.totalErrors, 0);
  
  // Calculate critical errors
  const criticalErrors = reports.reduce((sum, report) => sum + report.summary.criticalErrors, 0);
  
  // Calculate error rate (simplified - in reality this would be based on page views)
  const errorRate = (totalErrors / reports.length) * 1000; // Per thousand reports
  
  // Calculate top error messages
  const messageCounts: Record<string, number> = {};
  reports.forEach(report => {
    report.summary.topErrorMessages.forEach(msg => {
      messageCounts[msg.message] = (messageCounts[msg.message] || 0) + msg.count;
    });
  });
  
  const topErrorMessages = Object.entries(messageCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Calculate error trend by day
  const dateMap = new Map<string, number>();
  reports.forEach(report => {
    const date = new Date(report.timestamp).toISOString().split('T')[0];
    const current = dateMap.get(date) || 0;
    dateMap.set(date, current + 1);
  });
  
  const errorTrend = Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate error distribution
  const typeMap = new Map<string, number>();
  const severityMap = new Map<string, number>();
  const pageMap = new Map<string, number>();
  const browserMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  
  reports.forEach(report => {
    // Count by type
    report.errorEvents.forEach(event => {
      const type = event.errorType;
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
      
      // Count by severity
      severityMap.set(event.severity, (severityMap.get(event.severity) || 0) + 1);
      
      // Count by page
      pageMap.set(event.url, (pageMap.get(event.url) || 0) + 1);
      
      // Extract browser from user agent
      const userAgent = report.environment.userAgent;
      let browser = 'Unknown';
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      else if (userAgent.includes('Opera')) browser = 'Opera';
      
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
      
      // Extract device type from user agent
      let device = 'Desktop';
      if (userAgent.includes('Mobile') || userAgent.includes('Android')) device = 'Mobile';
      else if (userAgent.includes('iPad') || userAgent.includes('Android') && userAgent.includes('Safari')) device = 'Tablet';
      
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });
  });
  
  const errorDistribution = {
    byType: Array.from(typeMap.entries()).map(([type, count]) => ({ type, count })),
    bySeverity: Array.from(severityMap.entries()).map(([severity, count]) => ({ severity, count })),
    byPage: Array.from(pageMap.entries()).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count),
    byBrowser: Array.from(browserMap.entries()).map(([browser, count]) => ({ browser, count })),
    byDevice: Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count }))
  };
  
  // Calculate error sources
  const errorSources = {
    frontend: errorDistribution.byType.filter(t => ['javascript', 'promise', 'custom'].includes(t.type)).reduce((sum, t) => sum + t.count, 0),
    backend: 0, // Would be calculated from backend errors in a real implementation
    network: errorDistribution.byType.filter(t => t.type === 'network').reduce((sum, t) => sum + t.count, 0),
    resource: errorDistribution.byType.filter(t => t.type === 'resource').reduce((sum, t) => sum + t.count, 0)
  };

  return {
    totalErrors,
    errorRate,
    criticalErrors,
    resolvedErrors: 0, // Would be calculated from resolved status in a real implementation
    unresolvedErrors: totalErrors, // Would be calculated in a real implementation
    avgResolutionTime: 0, // Would be calculated in a real implementation
    topErrorMessages,
    errorTrend,
    errorDistribution,
    errorSources
  };
};

// Function to get error report by ID
export const getErrorReportById = (id: string): ErrorReport | undefined => {
  return errorReports.find(report => report.id === id);
};

// Function to get recent errors
export const getRecentErrors = (limit: number = 10): ErrorEvent[] => {
  const allErrors: ErrorEvent[] = [];
  
  errorReports.forEach(report => {
    allErrors.push(...report.errorEvents);
  });
  
  return allErrors
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Function to get top error pages
export const getTopErrorPages = (limit: number = 10): { page: string; count: number }[] => {
  const pageCounts: Record<string, number> = {};
  
  errorReports.forEach(report => {
    report.errorEvents.forEach(event => {
      pageCounts[event.url] = (pageCounts[event.url] || 0) + 1;
    });
  });
  
  return Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Function to get error frequency by hour
export const getErrorFrequencyByHour = (): { hour: number; count: number }[] => {
  const hourCounts = new Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
  
  errorReports.forEach(report => {
    const hour = new Date(report.timestamp).getHours();
    hourCounts[hour].count++;
  });
  
  return hourCounts;
};

// Function to simulate adding mock error data for demo purposes
export const generateMockErrorData = () => {
  // Clear existing data
  errorReports.length = 0;
  
  // Generate mock error reports
  for (let i = 0; i < 50; i++) {
    const now = Date.now();
    const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    
    const errorEvents: ErrorEvent[] = [];
    const errorCount = Math.floor(Math.random() * 5) + 1; // 1-5 errors per report
    
    for (let j = 0; j < errorCount; j++) {
      const errorTypes: ErrorEvent['errorType'][] = ['javascript', 'network', 'resource', 'promise', 'custom'];
      const severities: ErrorEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
      
      errorEvents.push({
        id: `err_${i}_${j}`,
        message: [
          'Cannot read property \'name\' of undefined',
          'Network request failed',
          'Failed to load resource',
          'Unhandled promise rejection',
          'Custom error occurred'
        ][Math.floor(Math.random() * 5)],
        stack: 'Error stack trace would go here...',
        component: ['ProductCard', 'Header', 'Cart', 'Checkout', 'Footer'][Math.floor(Math.random() * 5)],
        url: [
          '/product/123',
          '/shop',
          '/cart',
          '/checkout',
          '/account'
        ][Math.floor(Math.random() * 5)],
        userAgent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        timestamp: timestamp - Math.floor(Math.random() * 3600 * 1000), // Within the same hour
        severity: severities[Math.floor(Math.random() * severities.length)],
        errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
        status: errorTypes[Math.floor(Math.random() * errorTypes.length)] === 'network' ? 500 : undefined
      });
    }
    
    const summary = {
      totalErrors: errorEvents.length,
      criticalErrors: errorEvents.filter(e => e.severity === 'critical').length,
      highSeverityErrors: errorEvents.filter(e => e.severity === 'high').length,
      mediumSeverityErrors: errorEvents.filter(e => e.severity === 'medium').length,
      lowSeverityErrors: errorEvents.filter(e => e.severity === 'low').length,
      uniqueErrors: new Set(errorEvents.map(e => e.message)).size,
      topErrorMessages: Array.from(
        errorEvents.reduce((acc, event) => {
          acc.set(event.message, (acc.get(event.message) || 0) + 1);
          return acc;
        }, new Map<string, number>())
      )
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
      errorRate: Math.random() * 5 // Random error rate between 0-5
    };
    
    const mockReport: ErrorReport = {
      id: `report_${i}`,
      timestamp,
      errorEvents,
      summary,
      environment: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        url: errorEvents[0]?.url || '/',
        referrer: 'https://google.com',
        viewport: {
          width: 1920,
          height: 1080
        },
        connection: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50
        }
      }
    };
    
    errorReports.push(mockReport);
  }
  
  // Sort reports by timestamp (newest first)
  errorReports.sort((a, b) => b.timestamp - a.timestamp);
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