// components/ErrorNotificationConfig.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  setNotificationConfig, 
  getNotificationConfig, 
  NotificationConfig,
  testNotificationSystem
} from '@/lib/error-notification';

const ErrorNotificationConfig = () => {
  const [config, setConfig] = useState<NotificationConfig>({
    channels: ['dashboard'],
    emailSettings: {
      recipients: [],
      subjectTemplate: 'Error Alert: {{message}}'
    },
    slackSettings: {
      webhookUrl: ''
    },
    discordSettings: {
      webhookUrl: ''
    },
    webhookSettings: {
      url: ''
    },
    filters: {
      minSeverity: 'high'
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'channels' | 'filters' | 'settings'>('channels');

  // Load current configuration
  useEffect(() => {
    const currentConfig = getNotificationConfig();
    setConfig(currentConfig);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const recipients = e.target.value.split(',').map(email => email.trim()).filter(email => email);
    setConfig(prev => ({
      ...prev,
      emailSettings: {
        ...prev.emailSettings!,
        recipients
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      setNotificationConfig(config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await testNotificationSystem();
      setTestResult(success ? 'Test notification sent successfully!' : 'Failed to send test notification');
    } catch (error) {
      console.error('Error testing notification system:', error);
      setTestResult('Error testing notification system');
    } finally {
      setIsTesting(false);
    }
  };

  const toggleChannel = (channel: 'email' | 'slack' | 'discord' | 'webhook' | 'dashboard') => {
    setConfig(prev => {
      const newChannels = [...prev.channels];
      const index = newChannels.indexOf(channel);
      
      if (index > -1) {
        newChannels.splice(index, 1);
      } else {
        newChannels.push(channel);
      }
      
      return { ...prev, channels: newChannels };
    });
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Error Notification System</h2>
        <p className="text-foreground/80">
          Configure how and when you want to be notified about errors in your application
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-foreground/20 mb-6">
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'channels' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('filters')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'filters' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'settings' 
              ? 'border-b-2 border-gold text-gold' 
              : 'text-foreground/60 hover:text-foreground'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Channels Tab */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  config.channels.includes('dashboard') 
                    ? 'border-gold bg-gold/10' 
                    : 'border-foreground/20 hover:bg-foreground/5'
                }`}
                onClick={() => toggleChannel('dashboard')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    config.channels.includes('dashboard') 
                      ? 'border-gold bg-gold' 
                      : 'border-foreground/50'
                  }`}>
                    {config.channels.includes('dashboard') && (
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
                  config.channels.includes('email') 
                    ? 'border-gold bg-gold/10' 
                    : 'border-foreground/20 hover:bg-foreground/5'
                }`}
                onClick={() => toggleChannel('email')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    config.channels.includes('email') 
                      ? 'border-gold bg-gold' 
                      : 'border-foreground/50'
                  }`}>
                    {config.channels.includes('email') && (
                      <span className="text-black text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-sm text-foreground/60">Send error notifications via email</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  config.channels.includes('slack') 
                    ? 'border-gold bg-gold/10' 
                    : 'border-foreground/20 hover:bg-foreground/5'
                }`}
                onClick={() => toggleChannel('slack')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    config.channels.includes('slack') 
                      ? 'border-gold bg-gold' 
                      : 'border-foreground/50'
                  }`}>
                    {config.channels.includes('slack') && (
                      <span className="text-black text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Slack</h4>
                    <p className="text-sm text-foreground/60">Send notifications to Slack</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  config.channels.includes('discord') 
                    ? 'border-gold bg-gold/10' 
                    : 'border-foreground/20 hover:bg-foreground/5'
                }`}
                onClick={() => toggleChannel('discord')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    config.channels.includes('discord') 
                      ? 'border-gold bg-gold' 
                      : 'border-foreground/50'
                  }`}>
                    {config.channels.includes('discord') && (
                      <span className="text-black text-xs">✓</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">Discord</h4>
                    <p className="text-sm text-foreground/60">Send notifications to Discord</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border cursor-pointer ${
                  config.channels.includes('webhook') 
                    ? 'border-gold bg-gold/10' 
                    : 'border-foreground/20 hover:bg-foreground/5'
                }`}
                onClick={() => toggleChannel('webhook')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    config.channels.includes('webhook') 
                      ? 'border-gold bg-gold' 
                      : 'border-foreground/50'
                  }`}>
                    {config.channels.includes('webhook') && (
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

          {/* Channel Settings */}
          <div className="space-y-4">
            {config.channels.includes('email') && (
              <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <h4 className="font-semibold mb-3">Email Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Recipient Emails</label>
                    <input
                      type="text"
                      value={config.emailSettings?.recipients.join(', ') || ''}
                      onChange={handleEmailRecipientsChange}
                      placeholder="email1@example.com, email2@example.com"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                    <p className="text-xs text-foreground/60 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject Template</label>
                    <input
                      type="text"
                      value={config.emailSettings?.subjectTemplate || ''}
                      onChange={(e) => handleInputChange('emailSettings', {
                        ...config.emailSettings,
                        subjectTemplate: e.target.value
                      })}
                      placeholder="Error Alert: {{message}}"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {config.channels.includes('slack') && (
              <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <h4 className="font-semibold mb-3">Slack Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <input
                      type="text"
                      value={config.slackSettings?.webhookUrl || ''}
                      onChange={(e) => handleInputChange('slackSettings', {
                        ...config.slackSettings,
                        webhookUrl: e.target.value
                      })}
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Channel (optional)</label>
                    <input
                      type="text"
                      value={config.slackSettings?.channel || ''}
                      onChange={(e) => handleInputChange('slackSettings', {
                        ...config.slackSettings,
                        channel: e.target.value
                      })}
                      placeholder="#errors"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {config.channels.includes('discord') && (
              <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <h4 className="font-semibold mb-3">Discord Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <input
                      type="text"
                      value={config.discordSettings?.webhookUrl || ''}
                      onChange={(e) => handleInputChange('discordSettings', {
                        ...config.discordSettings,
                        webhookUrl: e.target.value
                      })}
                      placeholder="https://discord.com/api/webhooks/..."
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Username (optional)</label>
                    <input
                      type="text"
                      value={config.discordSettings?.username || ''}
                      onChange={(e) => handleInputChange('discordSettings', {
                        ...config.discordSettings,
                        username: e.target.value
                      })}
                      placeholder="Error Bot"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {config.channels.includes('webhook') && (
              <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <h4 className="font-semibold mb-3">Webhook Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <input
                      type="text"
                      value={config.webhookSettings?.url || ''}
                      onChange={(e) => handleInputChange('webhookSettings', {
                        ...config.webhookSettings,
                        url: e.target.value
                      })}
                      placeholder="https://your-webhook-url.com"
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Headers (JSON format)</label>
                    <textarea
                      value={JSON.stringify(config.webhookSettings?.headers || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const headers = JSON.parse(e.target.value);
                          handleInputChange('webhookSettings', {
                            ...config.webhookSettings,
                            headers
                          });
                        } catch (error) {
                          // Invalid JSON, don't update
                        }
                      }}
                      rows={4}
                      className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded font-mono text-sm"
                      placeholder='{\n  "Authorization": "Bearer token"\n}'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Filters</h3>
            <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Severity Level</label>
                  <select
                    value={config.filters?.minSeverity || 'high'}
                    onChange={(e) => handleInputChange('filters', {
                      ...config.filters,
                      minSeverity: e.target.value as any
                    })}
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <p className="text-xs text-foreground/60 mt-1">
                    Only notify for errors at or above this severity level
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Include Messages (optional)</label>
                  <input
                    type="text"
                    value={config.filters?.includeMessages?.join(', ') || ''}
                    onChange={(e) => {
                      const messages = e.target.value.split(',').map(msg => msg.trim()).filter(msg => msg);
                      handleInputChange('filters', {
                        ...config.filters,
                        includeMessages: messages
                      });
                    }}
                    placeholder="Error message keywords to include"
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Only notify for errors containing these keywords (comma separated)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Exclude Messages (optional)</label>
                  <input
                    type="text"
                    value={config.filters?.excludeMessages?.join(', ') || ''}
                    onChange={(e) => {
                      const messages = e.target.value.split(',').map(msg => msg.trim()).filter(msg => msg);
                      handleInputChange('filters', {
                        ...config.filters,
                        excludeMessages: messages
                      });
                    }}
                    placeholder="Error message keywords to exclude"
                    className="w-full p-2 bg-foreground/10 border border-foreground/20 rounded"
                  />
                  <p className="text-xs text-foreground/60 mt-1">
                    Don't notify for errors containing these keywords (comma separated)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Error Notifications</h4>
                    <p className="text-sm text-foreground/60">Receive notifications for application errors</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={config.channels.length > 0}
                      onChange={() => {
                        if (config.channels.length > 0) {
                          setConfig(prev => ({ ...prev, channels: [] }));
                        } else {
                          setConfig(prev => ({ ...prev, channels: ['dashboard'] }));
                        }
                      }}
                      className="sr-only"
                      id="notification-toggle"
                    />
                    <label
                      htmlFor="notification-toggle"
                      className={`block h-6 w-12 rounded-full cursor-pointer ${
                        config.channels.length > 0 ? 'bg-gold' : 'bg-foreground/20'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          config.channels.length > 0 ? 'transform translate-x-6' : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <button
            onClick={handleTest}
            disabled={isTesting}
            className={`px-4 py-2 rounded-lg font-medium ${
              isTesting 
                ? 'bg-foreground/20 text-foreground/50 cursor-not-allowed' 
                : 'bg-foreground/10 hover:bg-foreground/20'
            }`}
          >
            {isTesting ? 'Testing...' : 'Test Notification'}
          </button>
          {testResult && (
            <p className={`mt-2 text-sm ${testResult.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {testResult}
            </p>
          )}
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-lg font-medium ${
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

export default ErrorNotificationConfig;