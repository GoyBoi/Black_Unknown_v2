// components/ErrorNotificationDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  getErrorNotifications,
  getErrorNotificationStats,
  updateNotificationSettings,
  getNotificationSettings,
  ErrorNotification,
  ErrorNotificationStats
} from '@/lib/error-notification';

const ErrorNotificationDashboard = () => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [stats, setStats] = useState<ErrorNotificationStats>({
    total: 0,
    unread: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    resolved: 0,
    unresolved: 0
  });
  const [settings, setSettings] = useState<any>({
    enabled: true,
    channels: ['email', 'dashboard'],
    emailRecipients: [],
    webhookUrl: '',
    minSeverity: 'medium',
    notificationCooldown: 15,
    autoResolveAfter: 24 * 60 * 60 * 1000 // 24 hours
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings' | 'statistics'>('notifications');
  const [selectedNotification, setSelectedNotification] = useState<ErrorNotification | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll create mock data
      const mockNotifications: ErrorNotification[] = [
        {
          id: 'err_1',
          timestamp: Date.now() - 300000, // 5 minutes ago
          severity: 'critical',
          message: 'Failed to load product data from API',
          component: 'ProductDetailPage',
          url: '/product/123',
          userAgent: 'Mozilla/5.0...',
          userId: 'user_123',
          status: 'unresolved',
          resolvedAt: undefined,
          resolvedBy: undefined,
          additionalData: {
            errorStack: 'TypeError: Cannot read property \'name\' of undefined\n    at ProductDetailPage.render...',
            requestUrl: 'https://api.example.com/products/123',
            statusCode: 500
          }
        },
        {
          id: 'err_2',
          timestamp: Date.now() - 1800000, // 30 minutes ago
          severity: 'high',
          message: 'Slow API response in checkout process',
          component: 'CheckoutPage',
          url: '/checkout',
          userAgent: 'Mozilla/5.0...',
          userId: 'user_456',
          status: 'unresolved',
          resolvedAt: undefined,
          resolvedBy: undefined,
          additionalData: {
            responseTime: 8500,
            expectedTime: 2000,
            endpoint: '/api/checkout/process'
          }
        },
        {
          id: 'err_3',
          timestamp: Date.now() - 3600000, // 1 hour ago
          severity: 'medium',
          message: 'Deprecated function usage detected',
          component: 'CartProvider',
          url: '/cart',
          userAgent: 'Mozilla/5.0...',
          userId: 'user_789',
          status: 'resolved',
          resolvedAt: Date.now() - 1800000,
          resolvedBy: 'admin_user',
          additionalData: {
            deprecatedFunction: 'oldCalculateTax()',
            suggestedReplacement: 'newCalculateTax()'
          }
        },
        {
          id: 'err_4',
          timestamp: Date.now() - 7200000, // 2 hours ago
          severity: 'low',
          message: 'Minor UI rendering issue',
          component: 'ProductCard',
          url: '/shop',
          userAgent: 'Mozilla/5.0...',
          userId: 'user_101',
          status: 'resolved',
          resolvedAt: Date.now() - 3600000,
          resolvedBy: 'admin_user',
          additionalData: {
            element: 'ProductCard component',
            issue: 'Minor alignment issue on mobile'
          }
        }
      ];
      
      setNotifications(mockNotifications);
      
      // Calculate stats
      const mockStats: ErrorNotificationStats = {
        total: mockNotifications.length,
        unread: mockNotifications.filter(n => n.status === 'unresolved').length,
        critical: mockNotifications.filter(n => n.severity === 'critical').length,
        high: mockNotifications.filter(n => n.severity === 'high').length,
        medium: mockNotifications.filter(n => n.severity === 'medium').length,
        low: mockNotifications.filter(n => n.severity === 'low').length,
        resolved: mockNotifications.filter(n => n.status === 'resolved').length,
        unresolved: mockNotifications.filter(n => n.status === 'unresolved').length
      };
      
      setStats(mockStats);
      
      // Load settings
      const currentSettings = getNotificationSettings();
      setSettings(currentSettings);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Function to mark a notification as resolved
  const handleResolveNotification = async (id: string) => {
    // In a real implementation, this would update the notification status via API
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'resolved', resolvedAt: Date.now(), resolvedBy: 'current_user' } 
        : notification
    ));
    
    // Update stats
    setStats({
      ...stats,
      unresolved: stats.unresolved - 1,
      resolved: stats.resolved + 1
    });
  };

  // Function to mark all notifications as read
  const handleMarkAllAsRead = () => {
    // In a real implementation, this would update via API
    setNotifications(notifications.map(notification => 
      notification.status === 'unresolved' 
        ? { ...notification, status: 'resolved', resolvedAt: Date.now(), resolvedBy: 'current_user' } 
        : notification
    ));
    
    // Update stats
    setStats({
      ...stats,
      unresolved: 0,
      resolved: stats.total
    });
  };

  // Function to handle settings changes
  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to save settings
  const handleSaveSettings = async () => {
    try {
      await updateNotificationSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
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

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Error Notification Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and manage error notifications</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm"
              disabled={stats.unresolved === 0}
            >
              Mark All as Resolved
            </button>
            <button 
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-foreground/10">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Errors</h3>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Unresolved</h3>
          <p className="text-2xl font-bold text-red-500">{stats.unresolved}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Critical</h3>
          <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Resolved</h3>
          <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['notifications', 'settings', 'statistics'] as const).map(tab => (
            <button
              key={tab}
              className={`py-4 px-1 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Notifications</h3>
              <div className="flex space-x-2">
                <select 
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                  value={settings.minSeverity}
                  onChange={(e) => handleSettingsChange('minSeverity', e.target.value)}
                >
                  <option value="low">Show All</option>
                  <option value="medium">Medium+</option>
                  <option value="high">High+</option>
                  <option value="critical">Critical Only</option>
                </select>
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-foreground/60">
                <p>No error notifications to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${
                      notification.status === 'unresolved' 
                        ? 'border-foreground/20 bg-foreground/5' 
                        : 'border-foreground/10 bg-foreground/2'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-2">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            notification.severity === 'critical' ? 'bg-red-500' :
                            notification.severity === 'high' ? 'bg-orange-500' :
                            notification.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${getSeverityBadge(notification.severity)}`}>
                            {notification.severity.toUpperCase()}
                          </span>
                          <span className="ml-2 text-sm text-foreground/60">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <span className={`ml-2 text-sm px-2 py-1 rounded ${
                            notification.status === 'resolved' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-foreground/10 text-foreground/60'
                          }`}>
                            {notification.status}
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-foreground truncate">{notification.message}</h4>
                        <p className="text-sm text-foreground/80 truncate">{notification.component} - {notification.url}</p>
                        
                        {notification.additionalData && (
                          <div className="mt-2">
                            <button 
                              onClick={() => setSelectedNotification(notification)}
                              className="text-sm text-gold hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {notification.status === 'unresolved' ? (
                          <button
                            onClick={() => handleResolveNotification(notification.id)}
                            className="px-3 py-1 bg-gold text-black rounded-lg text-sm font-medium hover:bg-gold/90"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            className="px-3 py-1 bg-foreground/20 text-foreground/60 rounded-lg text-sm"
                            disabled
                          >
                            Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.enabled}
                        onChange={(e) => handleSettingsChange('enabled', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full ${
                        settings.enabled ? 'bg-gold' : 'bg-foreground/20'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-background w-4 h-4 rounded-full transition-transform ${
                        settings.enabled ? 'transform translate-x-4' : ''
                      }`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium">Enable Error Notifications</div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notification Channels</label>
                  <div className="flex flex-wrap gap-4">
                    {(['email', 'slack', 'discord', 'webhook', 'dashboard'] as const).map(channel => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.channels.includes(channel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleSettingsChange('channels', [...settings.channels, channel]);
                            } else {
                              handleSettingsChange('channels', settings.channels.filter((c: string) => c !== channel));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {settings.channels.includes('email') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Recipients</label>
                    <input
                      type="text"
                      value={settings.emailRecipients.join(', ')}
                      onChange={(e) => handleSettingsChange('emailRecipients', e.target.value.split(',').map(email => email.trim()))}
                      placeholder="admin@example.com, dev@example.com"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                    <p className="text-xs text-foreground/60 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>
                )}
                
                {settings.channels.includes('webhook') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Webhook URL</label>
                    <input
                      type="text"
                      value={settings.webhookUrl}
                      onChange={(e) => handleSettingsChange('webhookUrl', e.target.value)}
                      placeholder="https://hooks.example.com/errors"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Severity Level</label>
                  <select
                    value={settings.minSeverity}
                    onChange={(e) => handleSettingsChange('minSeverity', e.target.value)}
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  >
                    <option value="low">Low (and higher)</option>
                    <option value="medium">Medium (and higher)</option>
                    <option value="high">High (and higher)</option>
                    <option value="critical">Critical Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notification Cooldown (minutes)</label>
                  <input
                    type="number"
                    value={settings.notificationCooldown}
                    onChange={(e) => handleSettingsChange('notificationCooldown', Number(e.target.value))}
                    min="1"
                    max="1440" // 24 hours
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Minimum time between notifications for the same error
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Auto Resolve After (hours)</label>
                  <input
                    type="number"
                    value={settings.autoResolveAfter / (1000 * 60 * 60)} // Convert ms to hours
                    onChange={(e) => handleSettingsChange('autoResolveAfter', Number(e.target.value) * 1000 * 60 * 60)}
                    min="1"
                    max="168" // 1 week
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Automatically mark errors as resolved after this time period
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-3">Severity Distribution</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Critical</span>
                      <span className="font-medium">{stats.critical}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(stats.critical / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">High</span>
                      <span className="font-medium">{stats.high}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(stats.high / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Medium</span>
                      <span className="font-medium">{stats.medium}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(stats.medium / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Low</span>
                      <span className="font-medium">{stats.low}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stats.low / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-3">Status Overview</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Unresolved</span>
                      <span className="font-medium">{stats.unresolved}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(stats.unresolved / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Resolved</span>
                      <span className="font-medium">{stats.resolved}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(stats.resolved / stats.total) * 100 || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h4 className="font-medium mb-3">Top Affected Components</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Component</th>
                      <th className="text-left py-2 px-4">Error Count</th>
                      <th className="text-left py-2 px-4">Severity Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-foreground/10">
                      <td className="py-3 px-4">ProductDetailPage</td>
                      <td className="py-3 px-4">12</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">High</span>
                      </td>
                    </tr>
                    <tr className="border-b border-foreground/10">
                      <td className="py-3 px-4">CheckoutPage</td>
                      <td className="py-3 px-4">8</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs">High</span>
                      </td>
                    </tr>
                    <tr className="border-b border-foreground/10">
                      <td className="py-3 px-4">CartProvider</td>
                      <td className="py-3 px-4">5</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">Medium</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">ProductCard</td>
                      <td className="py-3 px-4">3</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">Low</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-foreground/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Error Details</h3>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground/80 mb-1">Message</h4>
                  <p className="text-foreground">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground/80 mb-1">Severity</h4>
                    <p className={`font-medium ${getSeverityColor(selectedNotification.severity)}`}>
                      {selectedNotification.severity.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground/80 mb-1">Status</h4>
                    <p className={`font-medium ${
                      selectedNotification.status === 'resolved' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {selectedNotification.status.charAt(0).toUpperCase() + selectedNotification.status.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground/80 mb-1">Component</h4>
                  <p className="text-foreground">{selectedNotification.component}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground/80 mb-1">URL</h4>
                  <p className="text-foreground break-all">{selectedNotification.url}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground/80 mb-1">Timestamp</h4>
                  <p className="text-foreground">{formatTimestamp(selectedNotification.timestamp)}</p>
                </div>
                
                {selectedNotification.additionalData && (
                  <div>
                    <h4 className="font-medium text-foreground/80 mb-1">Additional Data</h4>
                    <pre className="bg-foreground/5 p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedNotification.additionalData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/10"
                >
                  Close
                </button>
                {selectedNotification.status === 'unresolved' && (
                  <button
                    onClick={() => {
                      handleResolveNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorNotificationDashboard;