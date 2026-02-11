// components/PerformanceAlertConfiguration.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  getPerformanceAlertConfig, 
  updatePerformanceAlertConfig, 
  updateMetricConfig, 
  calculatePerformanceAlertConfiguration,
  validatePerformanceAlertConfig,
  formatDuration,
  formatNumber,
  formatPercentage,
  getSeverityColor,
  getSeverityBadgeClass,
  getStatusColor,
  getStatusBadgeClass,
  PerformanceAlertConfigurationData
} from '@/lib/performance-alert-configuration';

const PerformanceAlertConfiguration = () => {
  const [config, setConfig] = useState<any>(null);
  const [analytics, setAnalytics] = useState<PerformanceAlertConfigurationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'notifications' | 'recommendations'>('metrics');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Load performance alert configuration
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Get current configuration
      const currentConfig = getPerformanceAlertConfig();
      setConfig(currentConfig);
      
      // Calculate analytics
      const analytics = calculatePerformanceAlertConfiguration();
      setAnalytics(analytics);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Handle configuration changes
  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle metric configuration changes
  const handleMetricChange = (metric: string, field: string, value: any) => {
    setConfig((prev: any) => {
      const newMetrics = [...prev.metrics];
      const metricIndex = newMetrics.findIndex(m => m.metric === metric);
      
      if (metricIndex !== -1) {
        newMetrics[metricIndex] = {
          ...newMetrics[metricIndex],
          [field]: value
        };
      }
      
      return {
        ...prev,
        metrics: newMetrics
      };
    });
  };

  // Handle notification channel changes
  const handleNotificationChange = (channel: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      notificationChannels: {
        ...prev.notificationChannels,
        [channel]: {
          ...prev.notificationChannels[channel],
          [field]: value
        }
      }
    }));
  };

  // Save configuration
  const saveConfiguration = async () => {
    // Validate configuration
    const validation = validatePerformanceAlertConfig(config);
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      alert('Configuration has validation errors. Please fix them before saving.');
      return;
    }
    
    try {
      updatePerformanceAlertConfig(config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!config || !analytics) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>Unable to load performance alert configuration</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Performance Alert Configuration</h2>
            <p className="text-foreground/80 mt-1">Configure performance thresholds and notification settings</p>
          </div>
          <button
            onClick={saveConfiguration}
            className="px-6 py-3 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 p-4">
          <h3 className="text-red-500 font-bold mb-2">Configuration Errors</h3>
          <ul className="list-disc pl-5 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-red-500 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['metrics', 'notifications', 'recommendations'] as const).map(tab => (
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
        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Metric Thresholds</h3>
            <div className="space-y-4">
              {config.metrics.map((metric: any, index: number) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-foreground capitalize">{metric.metric.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-sm text-foreground/80">
                        Current: {metric.metric === 'cls' ? metric.value.toFixed(3) : formatDuration(metric.value)}, 
                        Threshold: {metric.metric === 'cls' ? metric.threshold.toFixed(3) : formatDuration(metric.threshold)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(metric.severity)}`}>
                        {metric.severity}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={metric.enabled}
                          onChange={(e) => handleMetricChange(metric.metric, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Threshold Value</label>
                      <input
                        type="number"
                        value={metric.threshold}
                        onChange={(e) => handleMetricChange(metric.metric, 'threshold', Number(e.target.value))}
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                        min="0"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Alert when metric exceeds this value
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Alert Cooldown (minutes)</label>
                      <input
                        type="number"
                        value={metric.alertCooldown}
                        onChange={(e) => handleMetricChange(metric.metric, 'alertCooldown', Number(e.target.value))}
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                        min="1"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Minimum time between alerts for this metric
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Notification Channels</label>
                    <div className="flex flex-wrap gap-2">
                      {(['email', 'dashboard', 'slack', 'discord', 'webhook'] as const).map(channel => (
                        <label key={channel} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={metric.notificationChannels.includes(channel)}
                            onChange={(e) => {
                              const currentChannels = [...metric.notificationChannels];
                              const channelIndex = currentChannels.indexOf(channel);
                              
                              if (e.target.checked && channelIndex === -1) {
                                currentChannels.push(channel);
                              } else if (!e.target.checked && channelIndex !== -1) {
                                currentChannels.splice(channelIndex, 1);
                              }
                              
                              handleMetricChange(metric.metric, 'notificationChannels', currentChannels);
                            }}
                            className="mr-2"
                          />
                          <span className="capitalize">{channel}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-foreground">Email Notifications</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notificationChannels.email.enabled}
                      onChange={(e) => handleNotificationChange('email', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
                
                {config.notificationChannels.email.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipient Emails</label>
                      <input
                        type="text"
                        value={config.notificationChannels.email.recipients.join(', ')}
                        onChange={(e) => {
                          const recipients = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                          handleNotificationChange('email', 'recipients', recipients);
                        }}
                        placeholder="admin@example.com, dev@example.com"
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Separate multiple emails with commas
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject Template</label>
                      <input
                        type="text"
                        value={config.notificationChannels.email.subjectTemplate || 'Performance Alert: {{metric}} on {{page}}'}
                        onChange={(e) => handleNotificationChange('email', 'subjectTemplate', e.target.value)}
                        placeholder="Performance Alert: {{metric}} on {{page}}"
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Use {'{{metric}}'}, {'{{page}}'}, {'{{value}}'}, {'{{threshold}}'} as placeholders
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Slack Notifications */}
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-foreground">Slack Notifications</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notificationChannels.slack.enabled}
                      onChange={(e) => handleNotificationChange('slack', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
                
                {config.notificationChannels.slack.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Webhook URL</label>
                      <input
                        type="text"
                        value={config.notificationChannels.slack.webhookUrl || ''}
                        onChange={(e) => handleNotificationChange('slack', 'webhookUrl', e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Slack incoming webhook URL
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Channel (optional)</label>
                      <input
                        type="text"
                        value={config.notificationChannels.slack.channel || ''}
                        onChange={(e) => handleNotificationChange('slack', 'channel', e.target.value)}
                        placeholder="#performance-alerts"
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Discord Notifications */}
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-foreground">Discord Notifications</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notificationChannels.discord.enabled}
                      onChange={(e) => handleNotificationChange('discord', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
                
                {config.notificationChannels.discord.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Webhook URL</label>
                      <input
                        type="text"
                        value={config.notificationChannels.discord.webhookUrl || ''}
                        onChange={(e) => handleNotificationChange('discord', 'webhookUrl', e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Discord webhook URL
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Username (optional)</label>
                      <input
                        type="text"
                        value={config.notificationChannels.discord.username || ''}
                        onChange={(e) => handleNotificationChange('discord', 'username', e.target.value)}
                        placeholder="Performance Bot"
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Webhook Notifications */}
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-foreground">Webhook Notifications</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.notificationChannels.webhook.enabled}
                      onChange={(e) => handleNotificationChange('webhook', 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
                
                {config.notificationChannels.webhook.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Webhook URL</label>
                      <input
                        type="text"
                        value={config.notificationChannels.webhook.url || ''}
                        onChange={(e) => handleNotificationChange('webhook', 'url', e.target.value)}
                        placeholder="https://your-webhook-url.com"
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Custom webhook URL to send performance alerts
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Headers (JSON format)</label>
                      <textarea
                        value={JSON.stringify(config.notificationChannels.webhook.headers || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const headers = JSON.parse(e.target.value);
                            handleNotificationChange('webhook', 'headers', headers);
                          } catch (error) {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={4}
                        className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground font-mono text-sm"
                        placeholder='{\n  "Authorization": "Bearer token"\n}'
                      ></textarea>
                      <p className="text-xs text-foreground/60 mt-1">
                        Headers to include with webhook requests
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Recommendations</h3>
            
            <div className="space-y-4">
              {analytics.recommendations.map((rec, index) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex">
                    <div className="mr-3 text-gold">•</div>
                    <p>{rec}</p>
                  </div>
                </div>
              ))}
              
              {analytics.recommendations.length === 0 && (
                <div className="text-center py-8 text-foreground/60">
                  <p>No recommendations at this time. Your performance thresholds are well-configured!</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold text-foreground mb-4">Performance Score Threshold</h4>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span>Minimum Performance Score</span>
                  <span className="text-2xl font-bold text-foreground">{config.performanceScoreThreshold}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.performanceScoreThreshold}
                  onChange={(e) => handleConfigChange('performanceScoreThreshold', Number(e.target.value))}
                  className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-foreground/60 mt-2">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                <p className="text-sm text-foreground/60 mt-3">
                  Alert when overall performance score drops below this threshold
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold text-foreground mb-4">Global Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Global Alert Cooldown (minutes)</label>
                  <input
                    type="number"
                    value={config.alertCooldown}
                    onChange={(e) => handleConfigChange('alertCooldown', Number(e.target.value))}
                    min="1"
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Minimum time between all performance alerts
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reporting Frequency</label>
                  <select
                    value={config.reportingFrequency}
                    onChange={(e) => handleConfigChange('reportingFrequency', e.target.value)}
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded text-foreground"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <p className="text-xs text-foreground/60 mt-1">
                    How often to generate performance reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAlertConfiguration;