// lib/bundle-monitoring.ts

// Define types for bundle monitoring
export interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  assets: BundleAsset[];
}

export interface BundleAsset {
  name: string;
  size: number; // in bytes
  chunkId: string;
}

export interface BundleReport {
  id: string;
  timestamp: number;
  totalSize: number;
  totalGzipSize: number;
  chunks: BundleChunk[];
  assets: BundleAsset[];
  duplicatePackages: string[];
  optimizationSuggestions: string[];
  sizeHistory: { timestamp: number; size: number }[];
}

export interface BundleMonitoringConfig {
  maxSizeThreshold: number; // in bytes
  maxGzipSizeThreshold: number; // in bytes
  notificationChannels: ('email' | 'slack' | 'discord' | 'webhook' | 'dashboard')[];
  alertCooldown: number; // in minutes
  enabled: boolean;
}

// In-memory storage for bundle reports (in production, this would be in a database)
const bundleReports: BundleReport[] = [];
const bundleMonitoringConfig: BundleMonitoringConfig = {
  maxSizeThreshold: 1048576, // 1MB
  maxGzipSizeThreshold: 307200, // 300KB
  notificationChannels: ['dashboard'],
  alertCooldown: 30, // 30 minutes
  enabled: true,
};

// Function to set bundle monitoring configuration
export const setBundleMonitoringConfig = (config: Partial<BundleMonitoringConfig>) => {
  Object.assign(bundleMonitoringConfig, config);
};

// Function to get current bundle monitoring configuration
export const getBundleMonitoringConfig = (): BundleMonitoringConfig => {
  return { ...bundleMonitoringConfig };
};

// Function to add a bundle report
export const addBundleReport = (report: Omit<BundleReport, 'id' | 'sizeHistory'>): BundleReport => {
  const newReport: BundleReport = {
    ...report,
    id: `bundle-report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sizeHistory: [
      { timestamp: Date.now(), size: report.totalSize }
    ]
  };

  // Add to reports list
  bundleReports.unshift(newReport);

  // Keep only the last 50 reports to prevent memory issues
  if (bundleReports.length > 50) {
    bundleReports.length = 50;
  }

  // Check if bundle size exceeds thresholds
  checkBundleSizeThresholds(newReport);

  return newReport;
};

// Function to get all bundle reports
export const getBundleReports = (limit?: number): BundleReport[] => {
  return limit ? bundleReports.slice(0, limit) : [...bundleReports];
};

// Function to get the latest bundle report
export const getLatestBundleReport = (): BundleReport | undefined => {
  return bundleReports[0];
};

// Function to check if bundle size exceeds thresholds
export const checkBundleSizeThresholds = (report: BundleReport) => {
  if (!bundleMonitoringConfig.enabled) {
    return;
  }

  // Check if enough time has passed since the last alert
  const now = Date.now();
  const lastAlertTime = getLastAlertTime('bundle-size');
  if (lastAlertTime && (now - lastAlertTime) < bundleMonitoringConfig.alertCooldown * 60 * 1000) {
    return; // Still in cooldown period
  }

  const alerts = [];

  if (report.totalSize > bundleMonitoringConfig.maxSizeThreshold) {
    alerts.push({
      type: 'size_exceeded',
      message: `Bundle size (${formatBytes(report.totalSize)}) exceeds threshold (${formatBytes(bundleMonitoringConfig.maxSizeThreshold)})`,
      severity: 'high' as const,
      value: report.totalSize,
      threshold: bundleMonitoringConfig.maxSizeThreshold
    });
  }

  if (report.totalGzipSize > bundleMonitoringConfig.maxGzipSizeThreshold) {
    alerts.push({
      type: 'gzip_size_exceeded',
      message: `Gzipped bundle size (${formatBytes(report.totalGzipSize)}) exceeds threshold (${formatBytes(bundleMonitoringConfig.maxGzipSizeThreshold)})`,
      severity: 'high' as const,
      value: report.totalGzipSize,
      threshold: bundleMonitoringConfig.maxGzipSizeThreshold
    });
  }

  // If there are alerts, send notifications
  if (alerts.length > 0) {
    // Update last alert time
    setLastAlertTime('bundle-size', now);

    // Send notifications for each alert
    alerts.forEach(alert => {
      sendBundleAlertNotification(alert, report);
    });
  }
};

// Function to send bundle alert notifications
const sendBundleAlertNotification = async (alert: any, report: BundleReport) => {
  // In a real implementation, this would send notifications to configured channels
  console.log(`Bundle Alert: ${alert.message}`, {
    reportId: report.id,
    timestamp: report.timestamp,
    totalSize: report.totalSize,
    totalGzipSize: report.totalGzipSize
  });

  // Simulate sending notifications to different channels
  const notificationPromises: Promise<void>[] = [];

  if (bundleMonitoringConfig.notificationChannels.includes('email')) {
    notificationPromises.push(sendEmailNotification(alert, report));
  }

  if (bundleMonitoringConfig.notificationChannels.includes('slack')) {
    notificationPromises.push(sendSlackNotification(alert, report));
  }

  if (bundleMonitoringConfig.notificationChannels.includes('discord')) {
    notificationPromises.push(sendDiscordNotification(alert, report));
  }

  if (bundleMonitoringConfig.notificationChannels.includes('webhook')) {
    notificationPromises.push(sendWebhookNotification(alert, report));
  }

  if (bundleMonitoringConfig.notificationChannels.includes('dashboard')) {
    // Add to dashboard alerts (would be stored in a database in production)
    console.log('Bundle alert added to dashboard:', alert);
  }

  try {
    await Promise.all(notificationPromises);
  } catch (error) {
    console.error('Error sending bundle alert notifications:', error);
  }
};

// Simulated notification functions
const sendEmailNotification = async (alert: any, report: BundleReport): Promise<void> => {
  // Simulate sending an email notification
  console.log('Sending email notification for bundle alert:', alert);
  return new Promise(resolve => setTimeout(resolve, 300));
};

const sendSlackNotification = async (alert: any, report: BundleReport): Promise<void> => {
  // Simulate sending a Slack notification
  console.log('Sending Slack notification for bundle alert:', alert);
  return new Promise(resolve => setTimeout(resolve, 300));
};

const sendDiscordNotification = async (alert: any, report: BundleReport): Promise<void> => {
  // Simulate sending a Discord notification
  console.log('Sending Discord notification for bundle alert:', alert);
  return new Promise(resolve => setTimeout(resolve, 300));
};

const sendWebhookNotification = async (alert: any, report: BundleReport): Promise<void> => {
  // Simulate sending a webhook notification
  console.log('Sending webhook notification for bundle alert:', alert);
  return new Promise(resolve => setTimeout(resolve, 300));
};

// Helper function to format bytes
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper function to calculate growth rate
export const calculateGrowthRate = (history: { timestamp: number; size: number }[]): number => {
  if (history.length < 2) return 0;

  const oldest = history[history.length - 1];
  const newest = history[0];
  const timeDiff = newest.timestamp - oldest.timestamp;
  const sizeDiff = newest.size - oldest.size;

  // Calculate average daily growth rate
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  return daysDiff > 0 ? sizeDiff / daysDiff : 0;
};

// Helper function to get bundle composition analysis
export const getBundleComposition = (report: BundleReport) => {
  // Calculate percentage of each chunk
  const totalSize = report.totalSize;
  const chunkPercentages = report.chunks.map(chunk => ({
    ...chunk,
    percentage: (chunk.size / totalSize) * 100
  }));

  // Identify the largest chunks
  const largestChunks = [...chunkPercentages]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Identify potential optimization opportunities
  const optimizationOpportunities = report.chunks.filter(chunk => {
    // Flag chunks that are larger than 20% of the total bundle
    return (chunk.size / totalSize) > 0.2;
  });

  return {
    chunkPercentages,
    largestChunks,
    optimizationOpportunities,
    duplicatePackages: report.duplicatePackages
  };
};

// In-memory storage for last alert times (in production, this would be in a database)
const lastAlertTimes: Map<string, number> = new Map();

// Helper function to get last alert time
const getLastAlertTime = (alertType: string): number | undefined => {
  return lastAlertTimes.get(alertType);
};

// Helper function to set last alert time
const setLastAlertTime = (alertType: string, timestamp: number) => {
  lastAlertTimes.set(alertType, timestamp);
};

// Function to generate bundle optimization suggestions
export const generateBundleOptimizationSuggestions = (report: BundleReport): string[] => {
  const suggestions: string[] = [];

  // Check for large chunks
  report.chunks.forEach(chunk => {
    if (chunk.size > 200000) { // Larger than 200KB
      suggestions.push(`Chunk "${chunk.name}" is ${formatBytes(chunk.size)}, consider code splitting`);
    }
  });

  // Check for duplicate packages
  if (report.duplicatePackages.length > 0) {
    suggestions.push(`Duplicate packages detected: ${report.duplicatePackages.join(', ')}. Consider deduplication.`);
  }

  // Check for large assets
  report.assets.forEach(asset => {
    if (asset.size > 100000) { // Larger than 100KB
      suggestions.push(`Asset "${asset.name}" is ${formatBytes(asset.size)}, consider optimization`);
    }
  });

  // Check for growth trends
  if (report.sizeHistory.length > 1) {
    const oldest = report.sizeHistory[report.sizeHistory.length - 1];
    const newest = report.sizeHistory[0];
    const growth = newest.size - oldest.size;
    const growthPercent = (growth / oldest.size) * 100;

    if (growthPercent > 10) {
      suggestions.push(`Bundle size grew by ${growthPercent.toFixed(2)}% since ${new Date(oldest.timestamp).toLocaleDateString()}, investigate new dependencies`);
    }
  }

  return suggestions;
};