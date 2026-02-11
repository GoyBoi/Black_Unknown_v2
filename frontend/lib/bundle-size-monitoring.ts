// lib/bundle-size-monitoring.ts

// Define types for bundle size monitoring
export interface BundleAsset {
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  brotliSize: number; // in bytes
  chunkId: string;
}

export interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  brotliSize: number; // in bytes
  assets: BundleAsset[];
  dependencies: string[];
  timestamp: number;
}

export interface BundleSizeReport {
  id: string;
  timestamp: number;
  reportDate: string;
  totalSize: number; // in bytes
  totalGzipSize: number; // in bytes
  totalBrotliSize: number; // in bytes
  chunks: BundleChunk[];
  assets: BundleAsset[];
  duplicatePackages: string[];
  optimizationSuggestions: BundleOptimizationSuggestion[];
  performanceScore: number; // 0-100
  sizeHistory: { timestamp: number; size: number }[];
}

export interface BundleOptimizationSuggestion {
  id: string;
  type: 'duplicate-package' | 'large-chunk' | 'unused-code' | 'unoptimized-asset' | 'missing-compression';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high'; // Potential size reduction
  estimatedSavings: number; // Estimated bytes savings
  implementationEffort: 'low' | 'medium' | 'high'; // Effort to implement
  details: {
    packageName?: string;
    chunkName?: string;
    assetName?: string;
    currentSize: number;
    recommendedSize?: number;
  };
}

export interface BundleSizeThreshold {
  chunkId: string;
  threshold: number; // in bytes
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface BundleSizeMonitoringConfig {
  thresholds: BundleSizeThreshold[];
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  alertCooldown: number; // in minutes
  enabled: boolean;
}

export interface BundleSizeMonitoringData {
  totalSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  sizeChange: number; // percentage change
  sizeTrend: 'increasing' | 'decreasing' | 'stable';
  chunks: BundleChunk[];
  alerts: BundleSizeAlert[];
  optimizationSuggestions: BundleOptimizationSuggestion[];
  performanceScore: number; // 0-100
  sizeHistory: { date: string; size: number }[];
  duplicatePackages: string[];
  topLargestChunks: BundleChunk[];
  topLargestAssets: BundleAsset[];
  compressionEfficiency: {
    chunkId: string;
    size: number;
    gzipSize: number;
    brotliSize: number;
    gzipEfficiency: number; // percentage
    brotliEfficiency: number; // percentage
  }[];
  optimizationOpportunities: {
    type: string;
    count: number;
    potentialSavings: number;
  }[];
}

// In-memory storage for bundle size reports (in production, this would be in a database)
const bundleSizeReports: BundleSizeReport[] = [];
const bundleSizeConfig: BundleSizeMonitoringConfig = {
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

// Function to add a bundle size report
export const addBundleSizeReport = (report: Omit<BundleSizeReport, 'id' | 'timestamp' | 'reportDate'>): BundleSizeReport => {
  const newReport: BundleSizeReport = {
    ...report,
    id: `bundle_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    reportDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  bundleSizeReports.unshift(newReport);

  // Check if any chunks exceed thresholds
  checkBundleSizeThresholds(newReport);

  // Keep only the last 50 reports to prevent memory issues
  if (bundleSizeReports.length > 50) {
    bundleSizeReports.length = 50;
  }

  return newReport;
};

// Function to check if bundle chunks exceed thresholds
const checkBundleSizeThresholds = (report: BundleSizeReport) => {
  if (!bundleSizeConfig.enabled) return;

  report.chunks.forEach(chunk => {
    const threshold = bundleSizeConfig.thresholds.find(t => 
      t.chunkId === chunk.id && t.enabled
    );

    if (!threshold) return;

    if (chunk.size > threshold.threshold) {
      // Check if we've already sent an alert for this chunk recently (cooldown)
      const recentAlert = bundleSizeAlerts.find(alert => 
        alert.chunkId === chunk.id && 
        !alert.resolved &&
        (Date.now() - alert.timestamp) < bundleSizeConfig.alertCooldown * 60 * 1000
      );

      if (recentAlert) {
        // Already alerted recently, skip
        return;
      }

      // Create a new alert
      const alert: BundleSizeAlert = {
        id: `bundle_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chunkId: chunk.id,
        chunkName: chunk.name,
        currentValue: chunk.size,
        threshold: threshold.threshold,
        severity: threshold.severity,
        timestamp: Date.now(),
        message: `Bundle chunk "${chunk.name}" is ${formatBytes(chunk.size)}, exceeding threshold of ${formatBytes(threshold.threshold)}`,
        resolved: false
      };

      bundleSizeAlerts.push(alert);

      // Send notifications
      sendBundleSizeAlert(alert);
    }
  });
};

// In-memory storage for bundle size alerts
const bundleSizeAlerts: BundleSizeAlert[] = [];

// Function to send bundle size alerts
const sendBundleSizeAlert = async (alert: BundleSizeAlert) => {
  // In a real implementation, this would send notifications to configured channels
  console.log(`Bundle Size Alert: ${alert.message}`, {
    chunkId: alert.chunkId,
    currentSize: alert.currentValue,
    threshold: alert.threshold,
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

// Function to calculate bundle size monitoring data
export const calculateBundleSizeMonitoring = (timeRange?: { start: number; end: number }): BundleSizeMonitoringData => {
  const reports = timeRange 
    ? bundleSizeReports.filter(r => r.timestamp >= timeRange.start && r.timestamp <= timeRange.end)
    : [...bundleSizeReports];

  if (reports.length === 0) {
    return {
      totalSize: 0,
      totalGzipSize: 0,
      totalBrotliSize: 0,
      sizeChange: 0,
      sizeTrend: 'stable',
      chunks: [],
      alerts: [],
      optimizationSuggestions: [],
      performanceScore: 100,
      sizeHistory: [],
      duplicatePackages: [],
      topLargestChunks: [],
      topLargestAssets: [],
      compressionEfficiency: [],
      optimizationOpportunities: []
    };
  }

  // Get the most recent report
  const latestReport = reports[0];
  const previousReport = reports.length > 1 ? reports[1] : null;

  // Calculate total sizes
  const totalSize = latestReport.totalSize;
  const totalGzipSize = latestReport.totalGzipSize;
  const totalBrotliSize = latestReport.totalBrotliSize;

  // Calculate size change
  let sizeChange = 0;
  if (previousReport) {
    sizeChange = ((totalSize - previousReport.totalSize) / previousReport.totalSize) * 100;
  }

  // Determine size trend
  let sizeTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (sizeChange > 5) {
    sizeTrend = 'increasing';
  } else if (sizeChange < -5) {
    sizeTrend = 'decreasing';
  }

  // Get top largest chunks
  const topLargestChunks = [...latestReport.chunks]
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  // Get top largest assets
  const allAssets = latestReport.chunks.flatMap(chunk => chunk.assets);
  const topLargestAssets = [...allAssets]
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);

  // Calculate compression efficiency
  const compressionEfficiency = latestReport.chunks.map(chunk => ({
    chunkId: chunk.id,
    size: chunk.size,
    gzipSize: chunk.gzipSize,
    brotliSize: chunk.brotliSize,
    gzipEfficiency: ((chunk.size - chunk.gzipSize) / chunk.size) * 100,
    brotliEfficiency: ((chunk.size - chunk.brotliSize) / chunk.size) * 100
  }));

  // Calculate size history
  const sizeHistory = reports
    .map(report => ({
      date: new Date(report.timestamp).toISOString().split('T')[0],
      size: report.totalSize
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate optimization opportunities
  const optimizationOpportunities = [
    {
      type: 'Large Chunks',
      count: latestReport.chunks.filter(c => c.size > 300000).length, // Chunks > 300KB
      potentialSavings: latestReport.chunks.filter(c => c.size > 300000).reduce((sum, c) => sum + Math.floor(c.size * 0.3), 0) // 30% potential savings
    },
    {
      type: 'Duplicate Packages',
      count: latestReport.duplicatePackages.length,
      potentialSavings: latestReport.duplicatePackages.length * 50000 // 50KB per duplicate
    },
    {
      type: 'Unoptimized Assets',
      count: allAssets.filter(a => a.size > 100000).length, // Assets > 100KB
      potentialSavings: allAssets.filter(a => a.size > 100000).reduce((sum, a) => sum + Math.floor(a.size * 0.4), 0) // 40% potential savings
    }
  ];

  return {
    totalSize,
    totalGzipSize,
    totalBrotliSize,
    sizeChange,
    sizeTrend,
    chunks: latestReport.chunks,
    alerts: getBundleSizeAlerts(),
    optimizationSuggestions: latestReport.optimizationSuggestions,
    performanceScore: latestReport.performanceScore,
    sizeHistory,
    duplicatePackages: latestReport.duplicatePackages,
    topLargestChunks,
    topLargestAssets,
    compressionEfficiency,
    optimizationOpportunities
  };
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

// Function to update bundle size monitoring configuration
export const updateBundleSizeMonitoringConfig = (newConfig: Partial<BundleSizeMonitoringConfig>) => {
  Object.assign(bundleSizeConfig, newConfig);
};

// Function to get current bundle size monitoring configuration
export const getBundleSizeMonitoringConfig = (): BundleSizeMonitoringConfig => {
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

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return num.toFixed(2) + '%';
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

// Function to generate mock bundle size data for demo purposes
export const generateMockBundleSizeData = () => {
  // Clear existing data
  bundleSizeReports.length = 0;
  bundleSizeAlerts.length = 0;
  
  // Generate mock bundle size reports
  for (let i = 0; i < 30; i++) {
    const now = Date.now();
    const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    
    // Generate mock chunks
    const chunks: BundleChunk[] = [
      {
        id: 'main',
        name: 'main.js',
        size: Math.floor(Math.random() * 300000) + 200000, // 200KB - 500KB
        gzipSize: Math.floor(Math.random() * 100000) + 50000, // 50KB - 150KB
        brotliSize: Math.floor(Math.random() * 90000) + 45000, // 45KB - 135KB
        assets: [
          { name: 'react.js', size: 120000, gzipSize: 40000, brotliSize: 36000, chunkId: 'main' },
          { name: 'react-dom.js', size: 110000, gzipSize: 35000, brotliSize: 32000, chunkId: 'main' },
          { name: 'app.js', size: 80000, gzipSize: 25000, brotliSize: 22000, chunkId: 'main' },
          { name: 'utils.js', size: 40000, gzipSize: 12000, brotliSize: 10000, chunkId: 'main' },
        ],
        dependencies: ['react', 'react-dom', 'next'],
        timestamp
      },
      {
        id: 'vendors',
        name: 'vendors.js',
        size: Math.floor(Math.random() * 400000) + 300000, // 300KB - 700KB
        gzipSize: Math.floor(Math.random() * 150000) + 100000, // 100KB - 250KB
        brotliSize: Math.floor(Math.random() * 135000) + 90000, // 90KB - 225KB
        assets: [
          { name: '@heroicons/react.js', size: 45000, gzipSize: 15000, brotliSize: 13000, chunkId: 'vendors' },
          { name: 'lucide-react.js', size: 35000, gzipSize: 12000, brotliSize: 10000, chunkId: 'vendors' },
          { name: 'next.js', size: 120000, gzipSize: 40000, brotliSize: 36000, chunkId: 'vendors' },
          { name: 'other-vendor.js', size: 250000, gzipSize: 80000, brotliSize: 72000, chunkId: 'vendors' },
        ],
        dependencies: ['@heroicons/react', 'lucide-react', 'next'],
        timestamp
      },
      {
        id: 'pages-home',
        name: 'pages-home.js',
        size: Math.floor(Math.random() * 150000) + 100000, // 100KB - 250KB
        gzipSize: Math.floor(Math.random() * 50000) + 30000, // 30KB - 80KB
        brotliSize: Math.floor(Math.random() * 45000) + 27000, // 27KB - 72KB
        assets: [
          { name: 'home-page.js', size: 70000, gzipSize: 25000, brotliSize: 22000, chunkId: 'pages-home' },
          { name: 'hero-section.js', size: 80000, gzipSize: 25000, brotliSize: 23000, chunkId: 'pages-home' },
        ],
        dependencies: ['home-page', 'hero-section'],
        timestamp
      }
    ];
    
    // Calculate total sizes
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzipSize = chunks.reduce((sum, chunk) => sum + chunk.gzipSize, 0);
    const totalBrotliSize = chunks.reduce((sum, chunk) => sum + chunk.brotliSize, 0);
    
    // Generate mock duplicate packages
    const duplicatePackages = Math.random() > 0.7 ? ['react', 'react-dom'] : [];
    
    // Generate mock optimization suggestions
    const optimizationSuggestions: BundleOptimizationSuggestion[] = [];
    if (Math.random() > 0.6) {
      optimizationSuggestions.push({
        id: `sugg_${i}_1`,
        type: 'large-chunk',
        priority: 'high',
        title: 'Split Large Chunk',
        description: 'Consider splitting this large chunk to improve initial load time',
        impact: 'high',
        estimatedSavings: Math.floor(chunks[0].size * 0.3),
        implementationEffort: 'medium',
        details: {
          chunkName: chunks[0].name,
          currentSize: chunks[0].size
        }
      });
    }
    
    // Generate mock report
    const report: BundleSizeReport = {
      id: `report_${i}`,
      timestamp,
      reportDate: new Date(timestamp).toISOString().split('T')[0],
      totalSize,
      totalGzipSize,
      totalBrotliSize,
      chunks,
      assets: chunks.flatMap(chunk => chunk.assets),
      duplicatePackages,
      optimizationSuggestions,
      performanceScore: Math.floor(Math.random() * 30) + 70, // 70-100
      sizeHistory: [
        { timestamp, size: totalSize }
      ]
    };
    
    bundleSizeReports.push(report);
  }
  
  // Sort reports by timestamp (newest first)
  bundleSizeReports.sort((a, b) => b.timestamp - a.timestamp);
};