// components/BundleSizeAlertsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  getBundleSizeAlerts, 
  resolveBundleSizeAlert, 
  calculateBundleSizeAlertAnalytics, 
  generateMockBundleSizeData,
  formatBytes,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  BundleSizeAlert,
  BundleSizeAnalytics
} from '@/lib/bundle-size-alerts';

const BundleSizeAlertsDashboard = () => {
  const [alerts, setAlerts] = useState<BundleSizeAlert[]>([]);
  const [analytics, setAnalytics] = useState<BundleSizeAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'chunks' | 'configuration' | 'trends'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    resolved: 'all',
    chunk: 'all'
  });

  // Load bundle size alert data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockBundleSizeData();
      
      // Get alerts
      const allAlerts = getBundleSizeAlerts();
      setAlerts(allAlerts);
      
      // Calculate analytics
      const analytics = calculateBundleSizeAlertAnalytics();
      setAnalytics(analytics);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  // Resolve an alert
  const handleResolveAlert = (alertId: string) => {
    const success = resolveBundleSizeAlert(alertId, 'admin');
    if (success) {
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true, resolvedAt: Date.now() } : alert
      ));
      
      if (analytics) {
        setAnalytics({
          ...analytics,
          activeAlerts: analytics.activeAlerts - 1,
          resolvedAlerts: analytics.resolvedAlerts + 1
        });
      }
    }
  };

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>Unable to load bundle size alert data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Bundle Size Alerts</h2>
            <p className="text-foreground/80 mt-1">Monitor and manage bundle size thresholds</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 rounded ${timeRange === 'day' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
            >
              Last Day
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
            >
              Last Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
            >
              Last Month
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 border-b border-foreground/10">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Alerts</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalAlerts)}</p>
          <p className="text-xs text-foreground/60">All time</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Active Alerts</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.activeAlerts)}</p>
          <p className="text-xs text-foreground/60">Need attention</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Resolved</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.resolvedAlerts)}</p>
          <p className="text-xs text-foreground/60">Fixed issues</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Resolution</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.resolutionTime.avg.toFixed(1)}m</p>
          <p className="text-xs text-foreground/60">Time to fix</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Critical Alerts</h3>
          <p className="text-2xl font-bold text-red-500">{formatNumber(analytics.alertsBySeverity.critical)}</p>
          <p className="text-xs text-foreground/60">Require immediate action</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'alerts', 'chunks', 'configuration', 'trends'] as const).map(tab => (
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Alert Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Alerts by Severity</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.alertsBySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <span className="capitalize">{severity}</span>
                      <div className="flex items-center flex-1 ml-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2.5 mr-3">
                          <div 
                            className={`h-2.5 rounded-full ${
                              severity === 'critical' ? 'bg-red-500' :
                              severity === 'high' ? 'bg-orange-500' :
                              severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${(count / analytics.totalAlerts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/80 w-12">{formatNumber(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Top Chunks by Alerts</h3>
                <div className="space-y-3">
                  {analytics.alertsByChunk.map((chunk, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground/80 truncate max-w-[60%]">{chunk.chunkName}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(chunk.count)}</span>
                        <div className="w-24 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(chunk.count / analytics.alertsByChunk[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Issues */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Trending Bundle Issues</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="space-y-4">
                  {analytics.trendingIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-foreground/10 rounded-lg">
                      <div>
                        <h4 className="font-medium">{issue.chunkName} Bundle</h4>
                        <p className="text-sm text-foreground/80">
                          {issue.direction === 'increasing' 
                            ? 'Growing' 
                            : 'Shrinking'} by {Math.abs(issue.change).toFixed(2)}%
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        issue.direction === 'increasing' 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {issue.direction === 'increasing' ? '↑ Growing' : '↓ Shrinking'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bundle Size Alerts</h3>
              <div className="flex space-x-3">
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({...filters, severity: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filters.resolved}
                  onChange={(e) => setFilters({...filters, resolved: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Chunk</th>
                    <th className="text-left py-2 px-4">Current Size</th>
                    <th className="text-left py-2 px-4">Threshold</th>
                    <th className="text-left py-2 px-4">Severity</th>
                    <th className="text-left py-2 px-4">Time</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts
                    .filter(alert => {
                      const matchesSeverity = filters.severity === 'all' || alert.severity === filters.severity;
                      const matchesStatus = filters.resolved === 'all' || 
                                           (filters.resolved === 'active' && !alert.resolved) || 
                                           (filters.resolved === 'resolved' && alert.resolved);
                      return matchesSeverity && matchesStatus;
                    })
                    .map((alert, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium">{alert.chunkName}</td>
                        <td className="py-3 px-4">{formatBytes(alert.currentSize)}</td>
                        <td className="py-3 px-4">{formatBytes(alert.thresholdSize)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatTimestamp(alert.timestamp)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            alert.resolved ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {alert.resolved ? 'Resolved' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {!alert.resolved && (
                            <button
                              onClick={() => handleResolveAlert(alert.id)}
                              className="text-sm bg-gold text-black px-3 py-1 rounded hover:bg-gold/90"
                            >
                              Resolve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chunks Tab */}
        {activeTab === 'chunks' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Chunks</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['main.js', 'vendors.js', 'pages-home.js', 'pages-product.js', 'ui-components.js', 'utils.js'].map((chunk, index) => {
                  // Generate mock data for each chunk
                  const size = Math.floor(Math.random() * 500000) + 100000; // 100KB to 600KB
                  const threshold = Math.floor(Math.random() * 400000) + 200000; // 200KB to 600KB
                  const isOver = size > threshold;
                  
                  return (
                    <div key={index} className="bg-background p-4 rounded-lg border border-foreground/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-foreground">{chunk}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isOver ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                        }`}>
                          {isOver ? 'OVER LIMIT' : 'OK'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Size:</span>
                          <span className={isOver ? 'text-red-500 font-medium' : 'text-foreground'}>
                            {formatBytes(size)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/60">Threshold:</span>
                          <span className="text-foreground">{formatBytes(threshold)}</span>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-foreground/20 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${isOver ? 'bg-red-500' : 'bg-gold'}`}
                              style={{ width: `${Math.min((size / threshold) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-foreground/60 mt-1">
                            <span>0KB</span>
                            <span>{formatBytes(threshold)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'configuration' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Alert Configuration</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-6 space-y-6">
              <div>
                <h4 className="font-medium mb-3">Bundle Size Thresholds</h4>
                <div className="space-y-4">
                  {[
                    { chunk: 'Main Bundle', threshold: '300KB', severity: 'high' },
                    { chunk: 'Vendor Bundle', threshold: '500KB', severity: 'medium' },
                    { chunk: 'Home Page Bundle', threshold: '250KB', severity: 'medium' },
                    { chunk: 'Product Page Bundle', threshold: '350KB', severity: 'high' },
                    { chunk: 'UI Components', threshold: '400KB', severity: 'high' }
                  ].map((config, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-background border border-foreground/20 rounded-lg">
                      <div>
                        <h5 className="font-medium">{config.chunk}</h5>
                        <p className="text-sm text-foreground/60">Threshold: {config.threshold}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          config.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                          config.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          config.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {config.severity}
                        </span>
                        <button className="text-gold hover:underline text-sm">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Notification Channels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Email', 'Slack', 'Discord', 'Dashboard', 'Webhook'].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background border border-foreground/20 rounded-lg">
                      <span>{channel}</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id={`channel-${index}`}
                          className="sr-only"
                        />
                        <label 
                          htmlFor={`channel-${index}`} 
                          className={`block h-6 w-10 rounded-full cursor-pointer ${
                            index < 4 ? 'bg-gold' : 'bg-foreground/20'
                          }`}
                        >
                          <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            index < 4 ? 'transform translate-x-4' : ''
                          }`}></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Size Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80 flex items-end justify-between space-x-1">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  // Generate mock trend data
                  const value = Math.floor(Math.random() * 400) + 100; // 100-500KB
                  return (
                    <div key={day} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(value / 500) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleSizeAlertsDashboard;