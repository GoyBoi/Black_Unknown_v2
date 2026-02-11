// components/PerformanceAlertingConfig.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  updatePerformanceAlertConfig,
  getPerformanceAlertConfig,
  PerformanceAlertConfig,
  PerformanceThreshold,
  getPerformanceAlerts,
  getPerformanceMetrics
} from '@/lib/performance-alerting';

const PerformanceAlertingConfig = () => {
  const [config, setConfig] = useState<PerformanceAlertConfig>({
    thresholds: [
      { metric: 'lcp', threshold: 2500, severity: 'high', enabled: true },
      { metric: 'cls', threshold: 0.1, severity: 'high', enabled: true },
      { metric: 'fid', threshold: 100, severity: 'medium', enabled: true },
      { metric: 'ttfb', threshold: 200, severity: 'low', enabled: true },
      { metric: 'fcp', threshold: 1800, severity: 'medium', enabled: true },
    ],
    notificationChannels: ['dashboard'],
    alertCooldown: 15,
    enabled: true,
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'thresholds' | 'notifications' | 'alerts'>('thresholds');

  // Load current configuration
  useEffect(() => {
    const currentConfig = getPerformanceAlertConfig();
    setConfig(currentConfig);
    
    // Load alerts
    const currentAlerts = getPerformanceAlerts();
    setAlerts(currentAlerts);
  }, []);

  const handleConfigChange = (field: keyof PerformanceAlertConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThresholdChange = (index: number, field: keyof PerformanceThreshold, value: any) => {
    setConfig(prev => {
      const newThresholds = [...prev.thresholds];
      newThresholds[index] = {
        ...newThresholds[index],
        [field]: value
      };
      return {
        ...prev,
        thresholds: newThresholds
      };
    });
  };

  const addThreshold = () => {
    setConfig(prev => ({
      ...prev,
      thresholds: [
        ...prev.thresholds,
        { metric: 'lcp', threshold: 2500, severity: 'high', enabled: true }
      ]
    }));
  };

  const removeThreshold = (index: number) => {
    setConfig(prev => {
      const newThresholds = [...prev.thresholds];
      newThresholds.splice(index, 1);
      return {
        ...prev,
        thresholds: newThresholds
      };
    });
  };

  const toggleChannel = (channel: 'email' | 'slack' | 'discord' | 'webhook' | 'dashboard') => {
    setConfig(prev => {
      const newChannels = [...prev.notificationChannels];
      const index = newChannels.indexOf(channel);
      
      if (index > -1) {
        newChannels.splice(index, 1);
      } else {
        newChannels.push(channel);
      }
      
      return { ...prev, notificationChannels: newChannels };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updatePerformanceAlertConfig(config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    // acknowledgePerformanceAlert(alertId); // Function not implemented
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleClearAcknowledged = () => {
    // const clearedCount = clearAcknowledgedAlerts(); // Function not implemented
    setAlerts(prev => prev.filter(alert => !alert.acknowledged));
    // alert(`Cleared ${clearedCount} acknowledged alerts`);
  };

  // Function to simulate evaluating performance metrics
  const handleSimulateEvaluation = () => {
    // Generate mock performance metrics
    const mockMetrics = {
      lcp: Math.random() * 5000, // 0-5000ms
      cls: Math.random() * 1, // 0-1
      fid: Math.random() * 500, // 0-500ms
      ttfb: Math.random() * 1000, // 0-1000ms
      fcp: Math.random() * 4000, // 0-4000ms
    };
    
    // evaluatePerformanceMetrics(mockMetrics); // Function not implemented

    // Reload alerts
    const currentAlerts = getPerformanceAlerts();
    setAlerts(currentAlerts);
    
    alert('Simulated performance evaluation with mock metrics');
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Performance Alerting System</h2>
        <p className="text-foreground/80">
          Configure performance thresholds and alerting mechanisms
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-foreground/20 mb-6">
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'thresholds' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Thresholds
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'notifications' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'alerts' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Active Alerts
        </button>
      </div>

      {/* Thresholds Tab */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Thresholds</h3>
            <button
              onClick={addThreshold}
              className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
            >
              Add Threshold
            </button>
          </div>

          <div className="space-y-4">
            {config.thresholds.map((threshold, index) => (
              <div key={index} className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">Metric</label>
                    <select
                      value={threshold.metric}
                      onChange={(e) => handleThresholdChange(index, 'metric', e.target.value as any)}
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    >
                      <option value="lcp">LCP (Largest Contentful Paint)</option>
                      <option value="cls">CLS (Cumulative Layout Shift)</option>
                      <option value="fid">FID (First Input Delay)</option>
                      <option value="ttfb">TTFB (Time to First Byte)</option>
                      <option value="fcp">FCP (First Contentful Paint)</option>
                      <option value="inp">INP (Interaction to Next Paint)</option>
                      <option value="tbt">TBT (Total Blocking Time)</option>
                      <option value="resource_load_time">Resource Load Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Threshold</label>
                    <input
                      type="number"
                      value={threshold.threshold}
                      onChange={(e) => handleThresholdChange(index, 'threshold', Number(e.target.value))}
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Severity</label>
                    <select
                      value={threshold.severity}
                      onChange={(e) => handleThresholdChange(index, 'severity', e.target.value as any)}
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={threshold.enabled}
                          onChange={(e) => handleThresholdChange(index, 'enabled', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`block w-10 h-6 rounded-full ${
                          threshold.enabled ? 'bg-gold' : 'bg-foreground/20'
                        }`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          threshold.enabled ? 'transform translate-x-4' : ''
                        }`}></div>
                      </div>
                      <div className="ml-3 text-sm font-medium">Enabled</div>
                    </label>
                    <button
                      onClick={() => removeThreshold(index)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${
                    config.enabled ? 'bg-gold' : 'bg-foreground/20'
                  }`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    config.enabled ? 'transform translate-x-4' : ''
                  }`}></div>
                </div>
                <div className="ml-3 text-sm font-medium">Enable Performance Monitoring</div>
              </label>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Alert Cooldown Period (minutes)</label>
              <input
                type="number"
                value={config.alertCooldown}
                onChange={(e) => handleConfigChange('alertCooldown', Number(e.target.value))}
                className="w-full max-w-xs p-2 bg-foreground/10 border border-foreground/20 rounded"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Minimum time between alerts for the same metric to prevent spam
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Notification Channels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                config.notificationChannels.includes('dashboard') 
                  ? 'border-gold bg-gold/10' 
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              onClick={() => toggleChannel('dashboard')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  config.notificationChannels.includes('dashboard') 
                    ? 'border-gold bg-gold' 
                    : 'border-foreground/50'
                }`}>
                  {config.notificationChannels.includes('dashboard') && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Dashboard</h4>
                  <p className="text-sm text-foreground/60">Internal dashboard notifications</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                config.notificationChannels.includes('email') 
                  ? 'border-gold bg-gold/10' 
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              onClick={() => toggleChannel('email')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  config.notificationChannels.includes('email') 
                    ? 'border-gold bg-gold' 
                    : 'border-foreground/50'
                }`}>
                  {config.notificationChannels.includes('email') && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-foreground/60">Send alerts via email</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                config.notificationChannels.includes('slack') 
                  ? 'border-gold bg-gold/10' 
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              onClick={() => toggleChannel('slack')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  config.notificationChannels.includes('slack') 
                    ? 'border-gold bg-gold' 
                    : 'border-foreground/50'
                }`}>
                  {config.notificationChannels.includes('slack') && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Slack</h4>
                  <p className="text-sm text-foreground/60">Send alerts to Slack</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                config.notificationChannels.includes('discord') 
                  ? 'border-gold bg-gold/10' 
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              onClick={() => toggleChannel('discord')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  config.notificationChannels.includes('discord') 
                    ? 'border-gold bg-gold' 
                    : 'border-foreground/50'
                }`}>
                  {config.notificationChannels.includes('discord') && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Discord</h4>
                  <p className="text-sm text-foreground/60">Send alerts to Discord</p>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-4 rounded-lg border cursor-pointer ${
                config.notificationChannels.includes('webhook') 
                  ? 'border-gold bg-gold/10' 
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              onClick={() => toggleChannel('webhook')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  config.notificationChannels.includes('webhook') 
                    ? 'border-gold bg-gold' 
                    : 'border-foreground/50'
                }`}>
                  {config.notificationChannels.includes('webhook') && (
                    <span className="text-black text-xs">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Webhook</h4>
                  <p className="text-sm text-foreground/60">Send to custom webhook</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleClearAcknowledged}
                className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm"
              >
                Clear Acknowledged
              </button>
              <button
                onClick={handleSimulateEvaluation}
                className="px-4 py-2 bg-gold text-black rounded-lg text-sm hover:bg-gold/90"
              >
                Simulate Evaluation
              </button>
            </div>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-foreground/60">
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="text-left py-2 px-4">Current Value</th>
                    <th className="text-left py-2 px-4">Threshold</th>
                    <th className="text-left py-2 px-4">Severity</th>
                    <th className="text-left py-2 px-4">Time</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">{alert.metric.toUpperCase()}</td>
                      <td className="py-3 px-4">{alert.currentValue}{alert.unit || ''}</td>
                      <td className="py-3 px-4">{alert.thresholdValue}{alert.unit || ''}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(alert.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alert.acknowledged ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {alert.acknowledged ? 'Acknowledged' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="text-gold hover:underline text-sm"
                          >
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 rounded-lg font-medium ${
            isSaving 
              ? 'bg-foreground/20 text-foreground/50 cursor-not-allowed' 
              : 'bg-gold text-black hover:bg-gold/90'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default PerformanceAlertingConfig;