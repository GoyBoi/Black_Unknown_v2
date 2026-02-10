// lib/performance-alert-configuration.ts

// Define types for performance alert configuration
export interface PerformanceMetricConfig {
  metric: 'lcp' | 'cls' | 'fcp' | 'fid' | 'inp' | 'ttfb' | 'tbt';
  threshold: number;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  alertCooldown: number; // in minutes
}

export interface PerformanceAlertConfig {
  enabled: boolean;
  metrics: PerformanceMetricConfig[];
  notificationChannels: {
    email: {
      enabled: boolean;
      recipients: string[];
      subjectTemplate?: string;
    };
    slack: {
      enabled: boolean;
      webhookUrl?: string;
      channel?: string;
    };
    discord: {
      enabled: boolean;
      webhookUrl?: string;
      username?: string;
    };
    webhook: {
      enabled: boolean;
      url?: string;
      headers?: Record<string, string>;
    };
    dashboard: {
      enabled: boolean;
    };
  };
  alertCooldown: number; // Global cooldown in minutes
  performanceScoreThreshold: number; // Performance score threshold (0-100)
  reportingFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface PerformanceAlertConfigurationData {
  config: PerformanceAlertConfig;
  currentMetrics: {
    metric: string;
    value: number;
    threshold: number;
    status: 'good' | 'needs-improvement' | 'poor';
  }[];
  recommendations: string[];
  lastUpdated: number;
}

// Default configuration
const defaultConfig: PerformanceAlertConfig = {
  enabled: true,
  metrics: [
    { 
      metric: 'lcp', 
      threshold: 2500, // 2.5s
      enabled: true, 
      severity: 'high',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'cls', 
      threshold: 0.1, // 0.1
      enabled: true, 
      severity: 'high',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'fcp', 
      threshold: 1800, // 1.8s
      enabled: true, 
      severity: 'medium',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'fid', 
      threshold: 100, // 100ms
      enabled: true, 
      severity: 'medium',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'inp', 
      threshold: 200, // 200ms
      enabled: true, 
      severity: 'medium',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'ttfb', 
      threshold: 200, // 200ms
      enabled: true, 
      severity: 'low',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    },
    { 
      metric: 'tbt', 
      threshold: 300, // 300ms
      enabled: true, 
      severity: 'high',
      notificationChannels: ['dashboard'],
      alertCooldown: 30
    }
  ],
  notificationChannels: {
    email: {
      enabled: false,
      recipients: []
    },
    slack: {
      enabled: false,
      webhookUrl: undefined
    },
    discord: {
      enabled: false,
      webhookUrl: undefined
    },
    webhook: {
      enabled: false,
      url: undefined
    },
    dashboard: {
      enabled: true
    }
  },
  alertCooldown: 15, // Global cooldown
  performanceScoreThreshold: 90, // Performance score threshold
  reportingFrequency: 'daily'
};

// In-memory storage for configuration (in production, this would be in a database)
let performanceAlertConfig: PerformanceAlertConfig = { ...defaultConfig };

// Function to get current performance alert configuration
export const getPerformanceAlertConfig = (): PerformanceAlertConfig => {
  return { ...performanceAlertConfig };
};

// Function to update performance alert configuration
export const updatePerformanceAlertConfig = (newConfig: Partial<PerformanceAlertConfig>) => {
  performanceAlertConfig = {
    ...performanceAlertConfig,
    ...newConfig
  };
};

// Function to update a specific metric configuration
export const updateMetricConfig = (metric: string, config: Partial<PerformanceMetricConfig>) => {
  const metricIndex = performanceAlertConfig.metrics.findIndex(m => m.metric === metric);
  if (metricIndex !== -1) {
    performanceAlertConfig.metrics[metricIndex] = {
      ...performanceAlertConfig.metrics[metricIndex],
      ...config
    };
  }
};

// Function to calculate performance alert configuration data
export const calculatePerformanceAlertConfiguration = (): PerformanceAlertConfigurationData => {
  // Mock current metrics data (in a real implementation, this would come from actual performance monitoring)
  const currentMetrics = [
    { metric: 'lcp', value: 2400, threshold: 2500, status: 'good' as const },
    { metric: 'cls', value: 0.08, threshold: 0.1, status: 'good' as const },
    { metric: 'fcp', value: 1600, threshold: 1800, status: 'good' as const },
    { metric: 'fid', value: 120, threshold: 100, status: 'needs-improvement' as const },
    { metric: 'inp', value: 180, threshold: 200, status: 'good' as const },
    { metric: 'ttfb', value: 180, threshold: 200, status: 'good' as const },
    { metric: 'tbt', value: 280, threshold: 300, status: 'good' as const }
  ];

  // Generate recommendations based on current metrics
  const recommendations: string[] = [];
  
  if (currentMetrics.some(m => m.status !== 'good')) {
    recommendations.push('Adjust thresholds for metrics that are consistently exceeding limits');
  }
  
  if (!performanceAlertConfig.notificationChannels.email.enabled && 
      performanceAlertConfig.notificationChannels.email.recipients.length === 0) {
    recommendations.push('Configure email notifications to receive performance alerts');
  }
  
  if (!performanceAlertConfig.notificationChannels.slack.enabled) {
    recommendations.push('Enable Slack notifications for real-time performance alerts');
  }
  
  if (performanceAlertConfig.alertCooldown > 60) {
    recommendations.push('Consider reducing alert cooldown to receive more timely notifications');
  }

  return {
    config: getPerformanceAlertConfig(),
    currentMetrics,
    recommendations,
    lastUpdated: Date.now()
  };
};

// Function to validate configuration
export const validatePerformanceAlertConfig = (config: PerformanceAlertConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate metric thresholds
  config.metrics.forEach(metric => {
    if (metric.enabled) {
      if (metric.threshold <= 0) {
        errors.push(`Threshold for ${metric.metric} must be greater than 0`);
      }
      
      if (metric.alertCooldown <= 0) {
        errors.push(`Alert cooldown for ${metric.metric} must be greater than 0 minutes`);
      }
    }
  });

  // Validate notification channels
  if (config.notificationChannels.email.enabled && 
      config.notificationChannels.email.recipients.length === 0) {
    errors.push('Email notifications enabled but no recipients configured');
  }

  if (config.notificationChannels.slack.enabled && 
      !config.notificationChannels.slack.webhookUrl) {
    errors.push('Slack notifications enabled but no webhook URL configured');
  }

  if (config.notificationChannels.discord.enabled && 
      !config.notificationChannels.discord.webhookUrl) {
    errors.push('Discord notifications enabled but no webhook URL configured');
  }

  if (config.notificationChannels.webhook.enabled && 
      !config.notificationChannels.webhook.url) {
    errors.push('Webhook notifications enabled but no URL configured');
  }

  // Validate global settings
  if (config.alertCooldown <= 0) {
    errors.push('Global alert cooldown must be greater than 0 minutes');
  }

  if (config.performanceScoreThreshold < 0 || config.performanceScoreThreshold > 100) {
    errors.push('Performance score threshold must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
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

// Function to format number with thousands separator
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

// Function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'good':
      return 'text-green-500';
    case 'needs-improvement':
      return 'text-yellow-500';
    case 'poor':
      return 'text-red-500';
    default:
      return 'text-foreground/60';
  }
};

// Function to get status badge class
export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'good':
      return 'bg-green-500/20 text-green-500';
    case 'needs-improvement':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'poor':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-foreground/10 text-foreground/60';
  }
};