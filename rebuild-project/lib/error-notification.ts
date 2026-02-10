// lib/error-notification.ts

import { TrackedError } from './error-tracking';

// Define notification types
export type NotificationChannel = 'email' | 'slack' | 'discord' | 'webhook' | 'dashboard';

export interface NotificationConfig {
  channels: NotificationChannel[];
  emailSettings?: {
    recipients: string[];
    subjectTemplate?: string;
  };
  slackSettings?: {
    webhookUrl: string;
    channel?: string;
  };
  discordSettings?: {
    webhookUrl: string;
    username?: string;
  };
  webhookSettings?: {
    url: string;
    headers?: Record<string, string>;
  };
  filters?: {
    minSeverity?: 'low' | 'medium' | 'high' | 'critical';
    includeMessages?: string[];
    excludeMessages?: string[];
  };
}

export interface NotificationPayload {
  error: TrackedError;
  timestamp: number;
  environment: string;
  userAgent?: string;
  user?: {
    id?: string;
    email?: string;
  };
}

// Default notification configuration
const defaultConfig: NotificationConfig = {
  channels: ['dashboard'],
  filters: {
    minSeverity: 'high'
  }
};

// In-memory storage for notification configurations (in production, this would be in a database)
let notificationConfig: NotificationConfig = defaultConfig;

// Function to set notification configuration
export const setNotificationConfig = (config: Partial<NotificationConfig>) => {
  notificationConfig = {
    ...notificationConfig,
    ...config
  };
};

// Function to get current notification configuration
export const getNotificationConfig = (): NotificationConfig => {
  return notificationConfig;
};

// Function to send error notification
export const sendErrorNotification = async (error: TrackedError): Promise<void> => {
  // Check if error should be notified based on filters
  if (!shouldNotify(error)) {
    return;
  }

  const payload: NotificationPayload = {
    error,
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    user: error.userId ? { id: error.userId } : undefined
  };

  // Send notifications to all configured channels
  const promises: Promise<void>[] = [];

  if (notificationConfig.channels.includes('email') && notificationConfig.emailSettings) {
    promises.push(sendEmailNotification(payload));
  }

  if (notificationConfig.channels.includes('slack') && notificationConfig.slackSettings) {
    promises.push(sendSlackNotification(payload));
  }

  if (notificationConfig.channels.includes('discord') && notificationConfig.discordSettings) {
    promises.push(sendDiscordNotification(payload));
  }

  if (notificationConfig.channels.includes('webhook') && notificationConfig.webhookSettings) {
    promises.push(sendWebhookNotification(payload));
  }

  if (notificationConfig.channels.includes('dashboard')) {
    promises.push(logToDashboard(payload));
  }

  // Execute all notification promises
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

// Function to check if error should be notified based on filters
const shouldNotify = (error: TrackedError): boolean => {
  // Check severity filter
  if (notificationConfig.filters?.minSeverity) {
    const severityLevels = { 'low': 0, 'medium': 1, 'high': 2, 'critical': 3 };
    const minLevel = severityLevels[notificationConfig.filters.minSeverity];
    const errorLevel = severityLevels[error.severity];

    if (errorLevel < minLevel) {
      return false;
    }
  }

  // Check include/exclude message filters
  if (notificationConfig.filters?.includeMessages) {
    const shouldInclude = notificationConfig.filters.includeMessages.some(msg =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
    if (!shouldInclude) {
      return false;
    }
  }

  if (notificationConfig.filters?.excludeMessages) {
    const shouldExclude = notificationConfig.filters.excludeMessages.some(msg =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
    if (shouldExclude) {
      return false;
    }
  }

  return true;
};

// Function to send email notification (simulated)
const sendEmailNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!notificationConfig.emailSettings) {
    console.warn('Email settings not configured');
    return;
  }

  // In a real implementation, this would send an email using a service like SendGrid, AWS SES, etc.
  console.log('Sending email notification:', {
    recipients: notificationConfig.emailSettings.recipients,
    subject: notificationConfig.emailSettings.subjectTemplate || `Error Alert: ${payload.error.message}`,
    error: payload.error
  });

  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to send Slack notification (simulated)
const sendSlackNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!notificationConfig.slackSettings) {
    console.warn('Slack settings not configured');
    return;
  }

  // In a real implementation, this would send a message to Slack using the webhook
  const slackMessage = {
    text: `🚨 *${payload.error.severity.toUpperCase()} Error*`,
    attachments: [
      {
        color: payload.error.severity === 'critical' ? 'danger' : payload.error.severity === 'high' ? 'warning' : 'good',
        fields: [
          {
            title: 'Message',
            value: payload.error.message,
            short: false
          },
          {
            title: 'Component',
            value: payload.error.component || 'Unknown',
            short: true
          },
          {
            title: 'URL',
            value: `<${payload.error.url}|View>`,
            short: true
          },
          {
            title: 'Timestamp',
            value: new Date(payload.timestamp).toISOString(),
            short: true
          }
        ]
      }
    ]
  };

  console.log('Sending Slack notification:', slackMessage);

  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to send Discord notification (simulated)
const sendDiscordNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!notificationConfig.discordSettings) {
    console.warn('Discord settings not configured');
    return;
  }

  // In a real implementation, this would send a message to Discord using the webhook
  const discordMessage = {
    username: notificationConfig.discordSettings.username || 'Error Bot',
    embeds: [
      {
        title: `🚨 ${payload.error.severity.toUpperCase()} Error`,
        color: payload.error.severity === 'critical' ? 0xFF0000 : payload.error.severity === 'high' ? 0xFFA500 : 0x00FF00,
        fields: [
          {
            name: 'Message',
            value: payload.error.message,
            inline: false
          },
          {
            name: 'Component',
            value: payload.error.component || 'Unknown',
            inline: true
          },
          {
            name: 'URL',
            value: payload.error.url,
            inline: true
          },
          {
            name: 'Timestamp',
            value: new Date(payload.timestamp).toISOString(),
            inline: true
          }
        ]
      }
    ]
  };

  console.log('Sending Discord notification:', discordMessage);

  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to send webhook notification (simulated)
const sendWebhookNotification = async (payload: NotificationPayload): Promise<void> => {
  if (!notificationConfig.webhookSettings) {
    console.warn('Webhook settings not configured');
    return;
  }

  // In a real implementation, this would send a POST request to the webhook URL
  console.log('Sending webhook notification:', {
    url: notificationConfig.webhookSettings.url,
    payload,
    headers: notificationConfig.webhookSettings.headers
  });

  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to log to dashboard
const logToDashboard = async (payload: NotificationPayload): Promise<void> => {
  // In a real implementation, this would log the error to a dashboard database
  console.log('Logging error to dashboard:', payload);

  // Simulate logging
  return new Promise(resolve => setTimeout(resolve, 100));
};

// Function to initialize error notification system
export const initErrorNotificationSystem = () => {
  // Set up global error handlers to automatically send notifications
  if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('error', (event) => {
      // Skip errors that are handled by React Error Boundaries
      if (event.error && event.error.suppressReactErrorLogging) {
        return;
      }

      // Create a TrackedError from the event
      const error: TrackedError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: event.message,
        stack: event.error?.stack,
        component: 'Global Error Handler',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        severity: 'high',
        userId: localStorage.getItem('userId') || undefined
      };

      // Send notification
      sendErrorNotification(error).catch(console.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error: TrackedError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        component: 'Unhandled Promise Rejection',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        severity: 'high',
        userId: localStorage.getItem('userId') || undefined
      };

      // Send notification
      sendErrorNotification(error).catch(console.error);
    });
  } else {
    // Server environment
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);

      const trackedError: TrackedError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: error.message,
        stack: error.stack,
        component: 'Uncaught Exception',
        url: 'server',
        userAgent: 'server',
        timestamp: Date.now(),
        severity: 'critical',
        additionalData: {
          process: {
            pid: process.pid,
            uptime: process.uptime()
          }
        }
      };

      // Send notification
      sendErrorNotification(trackedError).catch(console.error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);

      const trackedError: TrackedError = {
        id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        component: 'Unhandled Promise Rejection',
        url: 'server',
        userAgent: 'server',
        timestamp: Date.now(),
        severity: 'high',
        additionalData: {
          promise: String(promise)
        }
      };

      // Send notification
      sendErrorNotification(trackedError).catch(console.error);
    });
  }
};

// Define types for error notifications
export interface ErrorNotification {
  id: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  component?: string;
  url: string;
  userAgent?: string;
  userId?: string;
  status: 'resolved' | 'unresolved';
  resolvedAt?: number;
  resolvedBy?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorNotificationStats {
  total: number;
  unread: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
  unresolved: number;
}

// In-memory storage for notifications (in production, this would be in a database)
let errorNotifications: ErrorNotification[] = [];

// Function to get error notifications
export const getErrorNotifications = (limit?: number, filter?: {
  status?: 'resolved' | 'unresolved';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  component?: string;
}): ErrorNotification[] => {
  let notifications = [...errorNotifications];

  // Apply filters
  if (filter?.status) {
    notifications = notifications.filter(n => n.status === filter.status);
  }

  if (filter?.severity) {
    notifications = notifications.filter(n => n.severity === filter.severity);
  }

  if (filter?.component) {
    notifications = notifications.filter(n => n.component === filter.component);
  }

  // Sort by timestamp (newest first)
  notifications.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? notifications.slice(0, limit) : notifications;
};

// Function to get error notification stats
export const getErrorNotificationStats = (): ErrorNotificationStats => {
  return {
    total: errorNotifications.length,
    unread: errorNotifications.filter(n => n.status === 'unresolved').length,
    critical: errorNotifications.filter(n => n.severity === 'critical').length,
    high: errorNotifications.filter(n => n.severity === 'high').length,
    medium: errorNotifications.filter(n => n.severity === 'medium').length,
    low: errorNotifications.filter(n => n.severity === 'low').length,
    resolved: errorNotifications.filter(n => n.status === 'resolved').length,
    unresolved: errorNotifications.filter(n => n.status === 'unresolved').length
  };
};

// Function to add an error notification
export const addErrorNotification = (error: TrackedError): ErrorNotification => {
  const notification: ErrorNotification = {
    id: error.id,
    timestamp: error.timestamp,
    severity: error.severity,
    message: error.message,
    component: error.component,
    url: error.url,
    userAgent: error.userAgent,
    userId: error.userId,
    status: 'unresolved',
    additionalData: error.additionalData
  };

  errorNotifications.unshift(notification);

  // Keep only the last 1000 notifications to prevent memory issues
  if (errorNotifications.length > 1000) {
    errorNotifications = errorNotifications.slice(0, 1000);
  }

  return notification;
};

// Function to get notification settings
export const getNotificationSettings = () => {
  return {
    enabled: notificationConfig.channels.length > 0,
    channels: notificationConfig.channels,
    emailRecipients: notificationConfig.emailSettings?.recipients || [],
    webhookUrl: notificationConfig.webhookSettings?.url || '',
    minSeverity: notificationConfig.filters?.minSeverity || 'medium',
    notificationCooldown: 15, // minutes
    autoResolveAfter: 24 * 60 * 60 * 1000 // 24 hours in ms
  };
};

// Function to update notification settings
export const updateNotificationSettings = async (settings: any) => {
  const newConfig: Partial<NotificationConfig> = {
    channels: settings.channels,
    filters: {
      minSeverity: settings.minSeverity
    }
  };

  if (settings.channels.includes('email')) {
    newConfig.emailSettings = {
      recipients: settings.emailRecipients || []
    };
  }

  if (settings.channels.includes('webhook')) {
    newConfig.webhookSettings = {
      url: settings.webhookUrl
    };
  }

  setNotificationConfig(newConfig);
};

// Function to test notification system
export const testNotificationSystem = async (): Promise<boolean> => {
  try {
    const testError: TrackedError = {
      id: 'test-error',
      message: 'Test error notification',
      component: 'Test Component',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      timestamp: Date.now(),
      severity: 'low',
      additionalData: {
        test: true
      }
    };

    await sendErrorNotification(testError);
    return true;
  } catch (error) {
    console.error('Error testing notification system:', error);
    return false;
  }
};