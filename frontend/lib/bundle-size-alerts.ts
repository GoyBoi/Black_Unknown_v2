// lib/bundle-size-alerts.ts

// Define types for bundle size alerts
export interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  assets: BundleAsset[];
  dependencies: string[];
}

export interface BundleAsset {
  name: string;
  size: number; // in bytes
  chunkId: string;
}

export interface BundleSizeAlert {
  id: string;
  timestamp: number;
  chunkId: string;
  chunkName: string;
  currentSize: number; // in bytes
  thresholdSize: number; // in bytes
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

export interface BundleSizeThreshold {
  chunkId: string;
  threshold: number; // in bytes
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface BundleSizeAlertConfig {
  thresholds: BundleSizeThreshold[];
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  alertCooldown: number; // in minutes
  enabled: boolean;
}

export interface BundleSizeAnalytics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  alertsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  alertsByChunk: {
    chunkName: string;
    count: number;
  }[];
  resolutionTime: {
    avg: number; // in minutes
    fastest: number;
    slowest: number;
  };
  trendingIssues: {
    chunkName: string;
    change: number; // percentage change
    direction: 'increasing' | 'decreasing';
  }[];
}

// In-memory storage for bundle size alerts and configurations (in production, this would be in a database)
const bundleSizeAlerts: BundleSizeAlert[] = [];
const bundleSizeConfig: BundleSizeAlertConfig = {
  thresholds: [
    { chunkId: 'main', threshold: 300000, severity: 'high', enabled: true }, // 300KB
    { chunkId: 'vendors', threshold: 500000, severity: 'medium', enabled: true }, // 500KB
    { chunkId: 'pages-home', threshold: 200000, severity: 'medium', enabled: true }, // 200KB
    { chunkId: 'pages-product', threshold: 250000, severity: 'high', enabled: true }, // 250KB
    { chunkId: 'ui-components', threshold: 400000, severity: 'high', enabled: true }, // 400KB
  ],
  notificationChannels: ['dashboard'],
  alertCooldown: 30, // 30 minutes
  enabled: true
};

// Function to check if a bundle chunk exceeds its threshold
export const checkBundleSizeThreshold = (chunk: BundleChunk): BundleSizeAlert | null => {
  if (!bundleSizeConfig.enabled) {
    return null;
  }

  // Find the threshold for this chunk
  const threshold = bundleSizeConfig.thresholds.find(t => 
    t.chunkId === chunk.id && t.enabled
  );

  if (!threshold) {
    return null;
  }

  // Check if the chunk size exceeds the threshold
  if (chunk.size > threshold.threshold) {
    // Check if we've already sent an alert for this chunk recently (cooldown)
    const recentAlert = bundleSizeAlerts.find(alert => 
      alert.chunkId === chunk.id && 
      !alert.resolved &&
      (Date.now() - alert.timestamp) < bundleSizeConfig.alertCooldown * 60 * 1000
    );

    if (recentAlert) {
      // Already alerted recently, skip
      return null;
    }

    // Create a new alert
    const alert: BundleSizeAlert = {
      id: `bundle_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      chunkId: chunk.id,
      chunkName: chunk.name,
      currentSize: chunk.size,
      thresholdSize: threshold.threshold,
      severity: threshold.severity,
      message: `Bundle chunk "${chunk.name}" is ${formatBytes(chunk.size)}, exceeding threshold of ${formatBytes(threshold.threshold)}`,
      resolved: false
    };

    bundleSizeAlerts.push(alert);

    // Send notifications
    sendBundleSizeAlert(alert);

    return alert;
  }

  return null;
};

// Function to send bundle size alert notifications
const sendBundleSizeAlert = async (alert: BundleSizeAlert) => {
  // In a real implementation, this would send notifications to configured channels
  console.log(`Bundle Size Alert: ${alert.message}`, {
    chunkId: alert.chunkId,
    currentSize: alert.currentSize,
    threshold: alert.thresholdSize,
    severity: alert.severity,
    timestamp: alert.timestamp
  });

  // Simulate sending to different channels based on config
  if (bundleSizeConfig.notificationChannels.includes('email')) {
    // Simulate sending email
    console.log(`Sending email alert for ${alert.chunkName} bundle size`);
  }

  if (bundleSizeConfig.notificationChannels.includes('slack')) {
    // Simulate sending to Slack
    console.log(`Sending Slack alert for ${alert.chunkName} bundle size`);
  }

  if (bundleSizeConfig.notificationChannels.includes('dashboard')) {
    // Dashboard alert is already stored in bundleSizeAlerts array
    console.log(`Dashboard alert created for ${alert.chunkName} bundle size`);
  }
};

// Function to get bundle size alerts
export const getBundleSizeAlerts = (limit?: number, filter?: { resolved?: boolean; severity?: string; chunkId?: string }): BundleSizeAlert[] => {
  let alerts = [...bundleSizeAlerts];

  // Apply filters
  if (filter?.resolved !== undefined) {
    alerts = alerts.filter(alert => alert.resolved === filter.resolved);
  }

  if (filter?.severity) {
    alerts = alerts.filter(alert => alert.severity === filter.severity);
  }

  if (filter?.chunkId) {
    alerts = alerts.filter(alert => alert.chunkId === filter.chunkId);
  }

  // Sort by timestamp (newest first)
  alerts.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? alerts.slice(0, limit) : alerts;
};

// Function to resolve a bundle size alert
export const resolveBundleSizeAlert = (alertId: string, resolvedBy?: string): boolean => {
  const alertIndex = bundleSizeAlerts.findIndex(alert => alert.id === alertId);
  if (alertIndex === -1) return false;

  bundleSizeAlerts[alertIndex].resolved = true;
  bundleSizeAlerts[alertIndex].resolvedAt = Date.now();
  bundleSizeAlerts[alertIndex].resolvedBy = resolvedBy;

  return true;
};

// Function to calculate bundle size alert analytics
export const calculateBundleSizeAlertAnalytics = (): BundleSizeAnalytics => {
  const allAlerts = [...bundleSizeAlerts];
  const activeAlerts = allAlerts.filter(alert => !alert.resolved);
  const resolvedAlerts = allAlerts.filter(alert => alert.resolved);

  // Calculate alerts by severity
  const alertsBySeverity = {
    low: allAlerts.filter(a => a.severity === 'low').length,
    medium: allAlerts.filter(a => a.severity === 'medium').length,
    high: allAlerts.filter(a => a.severity === 'high').length,
    critical: allAlerts.filter(a => a.severity === 'critical').length
  };

  // Calculate alerts by chunk
  const chunkCountMap = new Map<string, number>();
  allAlerts.forEach(alert => {
    const current = chunkCountMap.get(alert.chunkName) || 0;
    chunkCountMap.set(alert.chunkName, current + 1);
  });

  const alertsByChunk = Array.from(chunkCountMap.entries())
    .map(([chunkName, count]) => ({ chunkName, count }))
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
    { chunkName: 'Main Bundle', change: 15.2, direction: 'increasing' as const },
    { chunkName: 'Vendor Bundle', change: -8.7, direction: 'decreasing' as const },
    { chunkName: 'Product Pages', change: 12.3, direction: 'increasing' as const },
    { chunkName: 'Home Page', change: 5.4, direction: 'increasing' as const }
  ];

  return {
    totalAlerts: allAlerts.length,
    activeAlerts: activeAlerts.length,
    resolvedAlerts: resolvedAlerts.length,
    alertsBySeverity,
    alertsByChunk,
    resolutionTime: {
      avg: avgResolutionTime,
      fastest: isFinite(fastestResolution) ? fastestResolution : 0,
      slowest: slowestResolution
    },
    trendingIssues
  };
};

// Function to update bundle size alert configuration
export const updateBundleSizeAlertConfig = (newConfig: Partial<BundleSizeAlertConfig>) => {
  Object.assign(bundleSizeConfig, newConfig);
};

// Function to get current bundle size alert configuration
export const getBundleSizeAlertConfig = (): BundleSizeAlertConfig => {
  return { ...bundleSizeConfig };
};

// Function to format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to simulate adding mock bundle size data for demo purposes
export const generateMockBundleSizeData = () => {
  // Clear existing alerts
  bundleSizeAlerts.length = 0;

  // Generate mock bundle size alerts
  const mockChunks = [
    { id: 'main', name: 'main.js', size: 350000 }, // Exceeds threshold
    { id: 'vendors', name: 'vendors.js', size: 450000 }, // Under threshold
    { id: 'pages-home', name: 'pages-home.js', size: 220000 }, // Exceeds threshold
    { id: 'pages-product', name: 'pages-product.js', size: 280000 }, // Exceeds threshold
    { id: 'ui-components', name: 'ui-components.js', size: 420000 }, // Exceeds threshold
  ];

  mockChunks.forEach(chunk => {
    // Simulate checking thresholds for each chunk
    const threshold = bundleSizeConfig.thresholds.find(t => t.chunkId === chunk.id);
    if (threshold && chunk.size > threshold.threshold) {
      const alert: BundleSizeAlert = {
        id: `bundle_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within last 7 days
        chunkId: chunk.id,
        chunkName: chunk.name,
        currentSize: chunk.size,
        thresholdSize: threshold.threshold,
        severity: threshold.severity,
        message: `Bundle chunk "${chunk.name}" is ${formatBytes(chunk.size)}, exceeding threshold of ${formatBytes(threshold.threshold)}`,
        resolved: Math.random() > 0.7 // 70% chance of being unresolved
      };
      
      bundleSizeAlerts.push(alert);
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