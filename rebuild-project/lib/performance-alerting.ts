// lib/performance-alerting.ts

// Define types for performance alerting
export interface PerformanceMetric {
  name: 'lcp' | 'cls' | 'fcp' | 'fid' | 'inp' | 'ttfb' | 'tbt' | 'overall';
  value: number;
  timestamp: number;
  pageUrl: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  currentValue: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  pageUrl: string;
  userAgent?: string;
  message: string;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

export interface PerformanceThreshold {
  metric: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface PerformanceAlertConfig {
  thresholds: PerformanceThreshold[];
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  alertCooldown: number; // in minutes
  enabled: boolean;
}

export interface PerformanceAlertAnalytics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  alertsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  alertsByMetric: {
    metric: string;
    count: number;
  }[];
  resolutionTime: {
    avg: number; // in minutes
    fastest: number;
    slowest: number;
  };
  trendingIssues: {
    metric: string;
    change: number; // percentage change
    direction: 'increasing' | 'decreasing';
  }[];
}

// In-memory storage for performance alerts (in production, this would be in a database)
const performanceAlerts: PerformanceAlert[] = [];
const performanceMetrics: PerformanceMetric[] = [];
const alertConfig: PerformanceAlertConfig = {
  thresholds: [
    { metric: 'lcp', threshold: 2500, severity: 'high', enabled: true }, // 2.5s threshold
    { metric: 'cls', threshold: 0.1, severity: 'high', enabled: true }, // 0.1 threshold
    { metric: 'fcp', threshold: 1800, severity: 'medium', enabled: true }, // 1.8s threshold
    { metric: 'fid', threshold: 100, severity: 'medium', enabled: true }, // 100ms threshold
    { metric: 'inp', threshold: 200, severity: 'medium', enabled: true }, // 200ms threshold
    { metric: 'ttfb', threshold: 200, severity: 'low', enabled: true }, // 200ms threshold
    { metric: 'tbt', threshold: 300, severity: 'high', enabled: true } // 300ms threshold
  ],
  notificationChannels: ['dashboard'],
  alertCooldown: 15, // 15 minutes
  enabled: true
};

// Function to add a performance metric
export const addPerformanceMetric = (metric: Omit<PerformanceMetric, 'timestamp'>): PerformanceMetric => {
  const newMetric: PerformanceMetric = {
    ...metric,
    timestamp: Date.now()
  };

  performanceMetrics.push(newMetric);

  // Check if this metric exceeds any thresholds
  checkPerformanceThresholds(newMetric);

  // Keep only the last 1000 metrics to prevent memory issues
  if (performanceMetrics.length > 1000) {
    performanceMetrics.splice(0, performanceMetrics.length - 1000);
  }

  return newMetric;
};

// Function to check if a metric exceeds thresholds
const checkPerformanceThresholds = (metric: PerformanceMetric) => {
  if (!alertConfig.enabled) return;

  const threshold = alertConfig.thresholds.find(t => 
    t.metric === metric.name && t.enabled
  );

  if (!threshold) return;

  // Check if the metric value exceeds the threshold
  if (metric.value > threshold.threshold) {
    // Check if we've already sent an alert for this metric recently (cooldown)
    const recentAlert = performanceAlerts.find(alert => 
      alert.metric === metric.name && 
      alert.pageUrl === metric.pageUrl &&
      (Date.now() - alert.timestamp) < alertConfig.alertCooldown * 60 * 1000
    );

    if (recentAlert) {
      // Already alerted recently, skip
      return;
    }

    // Create a new alert
    const alert: PerformanceAlert = {
      id: `perf_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metric: metric.name,
      currentValue: metric.value,
      threshold: threshold.threshold,
      severity: threshold.severity,
      timestamp: Date.now(),
      pageUrl: metric.pageUrl,
      userAgent: metric.userAgent,
      message: `Performance metric ${metric.name.toUpperCase()} is ${metric.value}ms, exceeding threshold of ${threshold.threshold}ms`,
      resolved: false
    };

    performanceAlerts.push(alert);

    // Send notifications
    sendPerformanceAlert(alert);
  }
};

// Function to send performance alert notifications
const sendPerformanceAlert = async (alert: PerformanceAlert) => {
  // In a real implementation, this would send notifications to configured channels
  console.log(`Performance Alert: ${alert.message}`, {
    metric: alert.metric,
    value: alert.currentValue,
    threshold: alert.threshold,
    severity: alert.severity,
    pageUrl: alert.pageUrl
  });

  // Simulate sending to different channels based on config
  if (alertConfig.notificationChannels.includes('email')) {
    // Simulate sending email
    console.log(`Sending email alert for ${alert.metric} on ${alert.pageUrl}`);
  }

  if (alertConfig.notificationChannels.includes('slack')) {
    // Simulate sending to Slack
    console.log(`Sending Slack alert for ${alert.metric} on ${alert.pageUrl}`);
  }

  if (alertConfig.notificationChannels.includes('dashboard')) {
    // Dashboard alert is already stored in performanceAlerts array
    console.log(`Dashboard alert created for ${alert.metric} on ${alert.pageUrl}`);
  }
};

// Function to get performance alerts
export const getPerformanceAlerts = (limit?: number, filter?: { resolved?: boolean; severity?: string; metric?: string }): PerformanceAlert[] => {
  let alerts = [...performanceAlerts];

  // Apply filters
  if (filter?.resolved !== undefined) {
    alerts = alerts.filter(alert => alert.resolved === filter.resolved);
  }

  if (filter?.severity) {
    alerts = alerts.filter(alert => alert.severity === filter.severity);
  }

  if (filter?.metric) {
    alerts = alerts.filter(alert => alert.metric === filter.metric);
  }

  // Sort by timestamp (newest first)
  alerts.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? alerts.slice(0, limit) : alerts;
};

// Function to resolve a performance alert
export const resolvePerformanceAlert = (alertId: string, resolvedBy?: string): boolean => {
  const alertIndex = performanceAlerts.findIndex(alert => alert.id === alertId);
  if (alertIndex === -1) return false;

  performanceAlerts[alertIndex].resolved = true;
  performanceAlerts[alertIndex].resolvedAt = Date.now();
  performanceAlerts[alertIndex].resolvedBy = resolvedBy;

  return true;
};

// Function to calculate performance alert analytics
export const calculatePerformanceAlertAnalytics = (): PerformanceAlertAnalytics => {
  const allAlerts = [...performanceAlerts];
  const activeAlerts = allAlerts.filter(alert => !alert.resolved);
  const resolvedAlerts = allAlerts.filter(alert => alert.resolved);

  // Calculate alerts by severity
  const alertsBySeverity = {
    low: allAlerts.filter(a => a.severity === 'low').length,
    medium: allAlerts.filter(a => a.severity === 'medium').length,
    high: allAlerts.filter(a => a.severity === 'high').length,
    critical: allAlerts.filter(a => a.severity === 'critical').length
  };

  // Calculate alerts by metric
  const metricCountMap = new Map<string, number>();
  allAlerts.forEach(alert => {
    const current = metricCountMap.get(alert.metric) || 0;
    metricCountMap.set(alert.metric, current + 1);
  });

  const alertsByMetric = Array.from(metricCountMap.entries())
    .map(([metric, count]) => ({ metric, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate resolution time statistics
  let totalResolutionTime = 0;
  let fastestResolution = Infinity;
  let slowestResolution = 0;

  resolvedAlerts.forEach(alert => {
    if (alert.resolvedAt) {
      const resolutionTime = (alert.resolvedAt - alert.timestamp) / (1000 * 60); // in minutes
      totalResolutionTime += resolutionTime;
      
      if (resolutionTime < fastestResolution) fastestResolution = resolutionTime;
      if (resolutionTime > slowestResolution) slowestResolution = resolutionTime;
    }
  });

  const avgResolutionTime = resolvedAlerts.length > 0 
    ? totalResolutionTime / resolvedAlerts.length 
    : 0;

  // Calculate trending issues (simplified for demo)
  const trendingIssues = [
    { metric: 'LCP', change: 12.5, direction: 'increasing' as const },
    { metric: 'CLS', change: -5.2, direction: 'decreasing' as const },
    { metric: 'FCP', change: 8.3, direction: 'increasing' as const },
    { metric: 'TTFB', change: -3.1, direction: 'decreasing' as const }
  ];

  return {
    totalAlerts: allAlerts.length,
    activeAlerts: activeAlerts.length,
    resolvedAlerts: resolvedAlerts.length,
    alertsBySeverity,
    alertsByMetric,
    resolutionTime: {
      avg: avgResolutionTime,
      fastest: isFinite(fastestResolution) ? fastestResolution : 0,
      slowest: slowestResolution
    },
    trendingIssues
  };
};

// Function to update alert configuration
export const updatePerformanceAlertConfig = (newConfig: Partial<PerformanceAlertConfig>) => {
  Object.assign(alertConfig, newConfig);
};

// Function to get current alert configuration
export const getPerformanceAlertConfig = (): PerformanceAlertConfig => {
  return { ...alertConfig };
};

// Function to get performance metrics
export const getPerformanceMetrics = (limit?: number, filter?: { metric?: string; pageUrl?: string }): PerformanceMetric[] => {
  let metrics = [...performanceMetrics];

  if (filter?.metric) {
    metrics = metrics.filter(m => m.name === filter.metric);
  }

  if (filter?.pageUrl) {
    metrics = metrics.filter(m => m.pageUrl === filter.pageUrl);
  }

  // Sort by timestamp (newest first)
  metrics.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? metrics.slice(0, limit) : metrics;
};

// Function to simulate adding mock performance data for demo purposes
export const generateMockPerformanceData = () => {
  // Clear existing data
  performanceMetrics.length = 0;
  performanceAlerts.length = 0;

  // Generate mock performance metrics
  const metrics: PerformanceMetric[] = [];
  const pages = ['/', '/shop', '/product/123', '/cart', '/checkout', '/about'];
  const metricTypes: PerformanceMetric['name'][] = ['lcp', 'cls', 'fcp', 'fid', 'ttfb', 'tbt'];

  for (let i = 0; i < 200; i++) {
    const page = pages[Math.floor(Math.random() * pages.length)];
    const metricType = metricTypes[Math.floor(Math.random() * metricTypes.length)];
    
    // Generate realistic values for each metric type
    let value = 0;
    switch (metricType) {
      case 'lcp':
        value = Math.random() > 0.7 ? Math.random() * 4000 + 2500 : Math.random() * 2500; // Sometimes exceed threshold
        break;
      case 'cls':
        value = Math.random() > 0.8 ? Math.random() * 0.5 + 0.1 : Math.random() * 0.1; // Sometimes exceed threshold
        break;
      case 'fcp':
        value = Math.random() > 0.6 ? Math.random() * 3000 + 1800 : Math.random() * 1800; // Sometimes exceed threshold
        break;
      case 'fid':
        value = Math.random() > 0.7 ? Math.random() * 300 + 100 : Math.random() * 100; // Sometimes exceed threshold
        break;
      case 'ttfb':
        value = Math.random() > 0.5 ? Math.random() * 500 + 200 : Math.random() * 200; // Sometimes exceed threshold
        break;
      case 'tbt':
        value = Math.random() > 0.6 ? Math.random() * 600 + 300 : Math.random() * 300; // Sometimes exceed threshold
        break;
      default:
        value = Math.random() * 1000;
    }

    metrics.push({
      name: metricType,
      value,
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days
      pageUrl: page,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: {
        width: 1920,
        height: 1080
      }
    });
  }

  // Add metrics to storage
  performanceMetrics.push(...metrics);

  // Generate some alerts based on thresholds
  metrics.forEach(metric => {
    const threshold = alertConfig.thresholds.find(t => t.metric === metric.name);
    if (threshold && metric.value > threshold.threshold) {
      const alert: PerformanceAlert = {
        id: `perf_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metric: metric.name,
        currentValue: metric.value,
        threshold: threshold.threshold,
        severity: threshold.severity,
        timestamp: metric.timestamp,
        pageUrl: metric.pageUrl,
        userAgent: metric.userAgent,
        message: `Performance metric ${metric.name.toUpperCase()} is ${metric.value}ms, exceeding threshold of ${threshold.threshold}ms`,
        resolved: Math.random() > 0.7 // 70% of alerts are unresolved
      };
      
      performanceAlerts.push(alert);
    }
  });
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