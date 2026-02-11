// lib/performance-alert-dashboard.ts

// Define types for performance alert dashboard
export interface PerformanceMetric {
  id: string;
  name: 'lcp' | 'cls' | 'fcp' | 'fid' | 'inp' | 'ttfb' | 'tbt' | 'overall';
  value: number;
  threshold: number;
  timestamp: number;
  pageUrl: string;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
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

export interface PerformanceAlertConfig {
  thresholds: {
    metric: string;
    threshold: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    enabled: boolean;
  }[];
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  alertCooldown: number; // in minutes
  enabled: boolean;
}

export interface PerformanceAlertDashboardData {
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
  performanceTrends: {
    date: string;
    lcp: number;
    cls: number;
    fcp: number;
    fid: number;
  }[];
  metricThresholds: {
    metric: string;
    threshold: number;
    currentAvg: number;
  }[];
  topAffectedPages: {
    page: string;
    alertCount: number;
  }[];
  resolutionMetrics: {
    avgResolutionTime: number; // in minutes
    resolutionRate: number; // percentage
  };
  performanceScore: number; // 0-100
  coreWebVitalsStatus: {
    lcp: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
    fcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    inp: 'good' | 'needs-improvement' | 'poor';
    ttfb: 'good' | 'needs-improvement' | 'poor';
  };
}

// In-memory storage for performance alerts and metrics (in production, this would be in a database)
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
export const addPerformanceMetric = (metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): PerformanceMetric => {
  const newMetric: PerformanceMetric = {
    ...metric,
    id: `perf_metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      !alert.resolved &&
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
    currentValue: alert.currentValue,
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

// Function to calculate performance alert dashboard data
export const calculatePerformanceAlertDashboard = (timeRange?: { start: number; end: number }): PerformanceAlertDashboardData => {
  const metrics = timeRange 
    ? performanceMetrics.filter(m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end)
    : [...performanceMetrics];
    
  const alerts = timeRange 
    ? performanceAlerts.filter(a => a.timestamp >= timeRange.start && a.timestamp <= timeRange.end)
    : [...performanceAlerts];

  if (metrics.length === 0 && alerts.length === 0) {
    return {
      totalAlerts: 0,
      activeAlerts: 0,
      resolvedAlerts: 0,
      alertsBySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      alertsByMetric: [],
      performanceTrends: [],
      metricThresholds: [],
      topAffectedPages: [],
      resolutionMetrics: {
        avgResolutionTime: 0,
        resolutionRate: 0
      },
      performanceScore: 100,
      coreWebVitalsStatus: {
        lcp: 'good',
        cls: 'good',
        fcp: 'good',
        fid: 'good',
        inp: 'good',
        ttfb: 'good'
      }
    };
  }

  // Calculate total alerts
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const resolvedAlerts = alerts.filter(a => a.resolved).length;

  // Calculate alerts by severity
  const alertsBySeverity = {
    low: alerts.filter(a => a.severity === 'low').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    high: alerts.filter(a => a.severity === 'high').length,
    critical: alerts.filter(a => a.severity === 'critical').length
  };

  // Calculate alerts by metric
  const metricCountMap = new Map<string, number>();
  alerts.forEach(alert => {
    const current = metricCountMap.get(alert.metric) || 0;
    metricCountMap.set(alert.metric, current + 1);
  });

  const alertsByMetric = Array.from(metricCountMap.entries())
    .map(([metric, count]) => ({ metric, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate performance trends by date
  const dateMap = new Map<string, { lcp: number[], cls: number[], fcp: number[], fid: number[], count: number }>();
  metrics.forEach(metric => {
    const date = new Date(metric.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    const current = dateMap.get(date) || { lcp: [], cls: [], fcp: [], fid: [], count: 0 };
    
    current.count++;
    
    switch (metric.name) {
      case 'lcp':
        current.lcp.push(metric.value);
        break;
      case 'cls':
        current.cls.push(metric.value);
        break;
      case 'fcp':
        current.fcp.push(metric.value);
        break;
      case 'fid':
        current.fid.push(metric.value);
        break;
    }
    
    dateMap.set(date, current);
  });

  const performanceTrends = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      lcp: data.lcp.length > 0 ? data.lcp.reduce((a, b) => a + b, 0) / data.lcp.length : 0,
      cls: data.cls.length > 0 ? data.cls.reduce((a, b) => a + b, 0) / data.cls.length : 0,
      fcp: data.fcp.length > 0 ? data.fcp.reduce((a, b) => a + b, 0) / data.fcp.length : 0,
      fid: data.fid.length > 0 ? data.fid.reduce((a, b) => a + b, 0) / data.fid.length : 0
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate metric thresholds
  const metricThresholdMap = new Map<string, { threshold: number; values: number[] }>();
  metrics.forEach(metric => {
    if (!metricThresholdMap.has(metric.name)) {
      metricThresholdMap.set(metric.name, { threshold: metric.threshold, values: [] });
    }
    const data = metricThresholdMap.get(metric.name)!;
    data.values.push(metric.value);
  });

  const metricThresholds = Array.from(metricThresholdMap.entries())
    .map(([metric, data]) => ({
      metric,
      threshold: data.threshold,
      currentAvg: data.values.reduce((a, b) => a + b, 0) / data.values.length
    }));

  // Calculate top affected pages
  const pageAlertMap = new Map<string, number>();
  alerts.forEach(alert => {
    const current = pageAlertMap.get(alert.pageUrl) || 0;
    pageAlertMap.set(alert.pageUrl, current + 1);
  });

  const topAffectedPages = Array.from(pageAlertMap.entries())
    .map(([page, alertCount]) => ({ page, alertCount }))
    .sort((a, b) => b.alertCount - a.alertCount)
    .slice(0, 10);

  // Calculate resolution metrics
  const resolvedAlertsForCalc = alerts.filter(a => a.resolved && a.resolvedAt);
  let totalResolutionTime = 0;
  resolvedAlertsForCalc.forEach(alert => {
    if (alert.resolvedAt) {
      totalResolutionTime += (alert.resolvedAt - alert.timestamp) / (1000 * 60); // in minutes
    }
  });

  const resolutionMetrics = {
    avgResolutionTime: resolvedAlertsForCalc.length > 0 
      ? totalResolutionTime / resolvedAlertsForCalc.length 
      : 0,
    resolutionRate: totalAlerts > 0 
      ? (resolvedAlerts / totalAlerts) * 100 
      : 0
  };

  // Calculate performance score (0-100)
  // Lower is better for performance metrics
  let score = 100;
  if (metricThresholds.length > 0) {
    // Calculate average ratio of current value to threshold
    const avgRatio = metricThresholds.reduce((sum, mt) => sum + (mt.currentAvg / mt.threshold), 0) / metricThresholds.length;
    // Convert to score (lower ratios = higher scores)
    score = Math.max(0, Math.min(100, 100 - (avgRatio * 20)));
  }

  // Calculate Core Web Vitals status
  const coreWebVitalsStatus = {
    lcp: calculateVitalStatus('lcp', metricThresholds.find(mt => mt.metric === 'lcp')?.currentAvg || 0),
    cls: calculateVitalStatus('cls', metricThresholds.find(mt => mt.metric === 'cls')?.currentAvg || 0),
    fcp: calculateVitalStatus('fcp', metricThresholds.find(mt => mt.metric === 'fcp')?.currentAvg || 0),
    fid: calculateVitalStatus('fid', metricThresholds.find(mt => mt.metric === 'fid')?.currentAvg || 0),
    inp: calculateVitalStatus('inp', metricThresholds.find(mt => mt.metric === 'inp')?.currentAvg || 0),
    ttfb: calculateVitalStatus('ttfb', metricThresholds.find(mt => mt.metric === 'ttfb')?.currentAvg || 0),
  };

  return {
    totalAlerts,
    activeAlerts,
    resolvedAlerts,
    alertsBySeverity,
    alertsByMetric,
    performanceTrends,
    metricThresholds,
    topAffectedPages,
    resolutionMetrics,
    performanceScore: score,
    coreWebVitalsStatus
  };
};

// Helper function to calculate vital status
const calculateVitalStatus = (vital: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (vital) {
    case 'lcp':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'cls':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'fcp':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'fid':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'inp':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'ttfb':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
};

// Function to update alert configuration
export const updatePerformanceAlertConfig = (newConfig: Partial<PerformanceAlertConfig>) => {
  Object.assign(alertConfig, newConfig);
};

// Function to get current alert configuration
export const getPerformanceAlertConfig = (): PerformanceAlertConfig => {
  return { ...alertConfig };
};

// Function to format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to format duration from milliseconds to human-readable format
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  
  return `${seconds}s`;
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

// Function to generate mock performance data for demo purposes
export const generateMockPerformanceData = () => {
  // Clear existing data
  performanceMetrics.length = 0;
  performanceAlerts.length = 0;
  
  // Generate mock performance metrics
  const metricTypes: PerformanceMetric['name'][] = ['lcp', 'cls', 'fcp', 'fid', 'inp', 'ttfb', 'tbt'];
  const pages = ['/', '/shop', '/product/123', '/cart', '/checkout', '/about'];
  
  for (let i = 0; i < 200; i++) {
    const page = pages[Math.floor(Math.random() * pages.length)];
    const metricType = metricTypes[Math.floor(Math.random() * metricTypes.length)];
    
    // Define thresholds for each metric type
    let threshold = 0;
    switch (metricType) {
      case 'lcp':
        threshold = 2500; // 2.5s
        break;
      case 'cls':
        threshold = 0.1; // 0.1
        break;
      case 'fcp':
        threshold = 1800; // 1.8s
        break;
      case 'fid':
        threshold = 100; // 100ms
        break;
      case 'inp':
        threshold = 200; // 200ms
        break;
      case 'ttfb':
        threshold = 200; // 200ms
        break;
      case 'tbt':
        threshold = 300; // 300ms
        break;
      default:
        threshold = 1000;
    }
    
    // Generate a value that sometimes exceeds the threshold
    let value = 0;
    if (Math.random() > 0.7) {
      // Exceed threshold 30% of the time
      value = threshold + Math.random() * (threshold * 0.5);
    } else {
      // Stay under threshold 70% of the time
      value = Math.random() * threshold * 0.8;
    }
    
    const metric: PerformanceMetric = {
      id: `metric_${i}`,
      name: metricType,
      value,
      threshold,
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days
      pageUrl: page,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: determineSeverity(metricType, value, threshold)
    };
    
    performanceMetrics.push(metric);
    
    // Create an alert if the metric exceeds the threshold
    if (value > threshold) {
      const alert: PerformanceAlert = {
        id: `alert_${i}`,
        metric: metricType,
        currentValue: value,
        threshold,
        severity: determineSeverity(metricType, value, threshold),
        timestamp: metric.timestamp,
        pageUrl: page,
        userAgent: metric.userAgent,
        message: `Performance metric ${metricType.toUpperCase()} is ${value.toFixed(2)}ms, exceeding threshold of ${threshold}ms`,
        resolved: Math.random() > 0.6 // 40% of alerts are resolved
      };
      
      performanceAlerts.push(alert);
    }
  }
  
  // Sort metrics by timestamp (newest first)
  performanceMetrics.sort((a, b) => b.timestamp - a.timestamp);
};

// Helper function to determine severity based on metric type and value
const determineSeverity = (metricName: string, value: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' => {
  const ratio = value / threshold;
  
  if (ratio > 2) return 'critical';
  if (ratio > 1.5) return 'high';
  if (ratio > 1.2) return 'medium';
  return 'low';
};