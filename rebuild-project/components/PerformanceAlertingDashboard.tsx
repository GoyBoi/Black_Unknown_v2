// components/PerformanceAlertingDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  getPerformanceAlerts,
  resolvePerformanceAlert,
  calculatePerformanceAlertAnalytics,
  generateMockPerformanceData,
  getSeverityBadgeClass,
  formatTimestamp,
  PerformanceAlert,
  PerformanceAlertAnalytics
} from '@/lib/performance-alerting';

const PerformanceAlertingDashboard = () => {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceAlertAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'metrics' | 'configuration' | 'trends'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    resolved: 'all',
    metric: 'all'
  });

  // Load performance alert data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockPerformanceData();
      
      // Get alerts
      const allAlerts = getPerformanceAlerts();
      setAlerts(allAlerts);
      
      // Calculate analytics
      const analytics = calculatePerformanceAlertAnalytics();
      setAnalytics(analytics);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  // Resolve an alert
  const handleResolveAlert = (alertId: string) => {
    const success = resolvePerformanceAlert(alertId, 'admin');
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

  // Format duration from milliseconds to human-readable format
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
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
        <p>Unable to load performance alerting data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Performance Alerting Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and manage performance metric alerts</p>
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
          {(['overview', 'alerts', 'metrics', 'configuration', 'trends'] as const).map(tab => (
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
                        <div className="w-full bg-foreground/20 rounded-full h-3 mr-3">
                          <div 
                            className={`h-3 rounded-full ${
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
                <h3 className="text-lg font-semibold mb-4">Alerts by Metric</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {analytics.alertsByMetric.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{metric.metric}</span>
                      <div className="flex items-center flex-1 ml-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2.5 mr-3">
                          <div 
                            className="bg-gold h-2.5 rounded-full" 
                            style={{ width: `${(metric.count / analytics.totalAlerts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/80 w-10">{formatNumber(metric.count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Issues */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Trending Performance Issues</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="space-y-4">
                  {analytics.trendingIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-foreground/10 rounded-lg">
                      <div>
                        <h4 className="font-medium">{issue.metric} Performance</h4>
                        <p className="text-sm text-foreground/80">
                          {issue.direction === 'increasing' 
                            ? 'Degraded' 
                            : 'Improved'} by {Math.abs(issue.change).toFixed(2)}%
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        issue.direction === 'increasing' 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {issue.direction === 'increasing' ? '↑ Degrading' : '↓ Improving'}
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
              <h3 className="text-lg font-semibold">Performance Alerts</h3>
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
                  <option value="unresolved">Unresolved</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">Current Value</th>
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
                                           (filters.resolved === 'resolved' && alert.resolved) || 
                                           (filters.resolved === 'unresolved' && !alert.resolved);
                      return matchesSeverity && matchesStatus;
                    })
                    .map((alert, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium capitalize">{alert.metric}</td>
                        <td className="py-3 px-4">
                          <a href={alert.pageUrl} className="text-gold hover:underline truncate max-w-xs block">
                            {alert.pageUrl}
                          </a>
                        </td>
                        <td className="py-3 px-4">{alert.currentValue}</td>
                        <td className="py-3 px-4">{alert.threshold}</td>
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

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80 flex items-end justify-between space-x-1">
                {['LCP', 'CLS', 'FCP', 'FID', 'TTFB'].map((metric, index) => {
                  // Generate mock data for visualization
                  const values = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 50);
                  const maxValue = Math.max(...values);
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-foreground/60 mb-2">{metric}</div>
                      <div className="flex flex-col justify-end h-64 w-full">
                        {values.map((value, idx) => (
                          <div 
                            key={idx}
                            className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                            style={{ height: `${(value / maxValue) * 100}%` }}
                          ></div>
                        ))}
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
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Performance Thresholds</h4>
                  <div className="space-y-4">
                    {[
                      { metric: 'LCP', threshold: '2500ms', severity: 'high' },
                      { metric: 'CLS', threshold: '0.1', severity: 'high' },
                      { metric: 'FCP', threshold: '1800ms', severity: 'medium' },
                      { metric: 'FID', threshold: '100ms', severity: 'medium' },
                      { metric: 'TTFB', threshold: '200ms', severity: 'low' },
                      { metric: 'TBT', threshold: '300ms', severity: 'high' }
                    ].map((threshold, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background border border-foreground/20 rounded-lg">
                        <div>
                          <h5 className="font-medium capitalize">{threshold.metric}</h5>
                          <p className="text-sm text-foreground/60">Threshold: {threshold.threshold}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            threshold.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                            threshold.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                            threshold.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {threshold.severity}
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
                              index < 3 ? 'bg-gold' : 'bg-foreground/20'
                            }`}
                          >
                            <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                              index < 3 ? 'transform translate-x-4' : ''
                            }`}></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80">
                <div className="flex items-end h-full space-x-1">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                    // Generate mock trend data
                    const value = Math.floor(Math.random() * 100) + 20;
                    return (
                      <div key={day} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${value}%` }}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAlertingDashboard;