// components/PerformanceAlertVisualization.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculatePerformanceAlertVisualization, 
  getPerformanceAlerts, 
  resolvePerformanceAlert, 
  generateMockPerformanceData,
  formatDuration,
  formatBytes,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  PerformanceAlertVisualizationData
} from '@/lib/performance-alert-visualization';

const PerformanceAlertVisualization = () => {
  const [analytics, setAnalytics] = useState<PerformanceAlertVisualizationData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'metrics' | 'trends' | 'configuration'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    resolved: 'all',
    metric: 'all'
  });

  // Load performance alert visualization data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockPerformanceData();
      
      // Calculate analytics
      const analytics = calculatePerformanceAlertVisualization();
      setAnalytics(analytics);
      
      // Get alerts
      const alerts = getPerformanceAlerts(50);
      setAlerts(alerts);
      
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

  // Format percentage
  const formatPercentage = (num: number): string => {
    return num.toFixed(2) + '%';
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
        <p>Unable to load performance alert visualization data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Performance Alert Visualization</h2>
            <p className="text-foreground/80 mt-1">Visualize and manage performance metric alerts</p>
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
          <p className="text-xs text-foreground/60">All metrics</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Active Alerts</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.activeAlerts)}</p>
          <p className="text-xs text-foreground/60">Need attention</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Performance Score</h3>
          <p className={`text-2xl font-bold ${
            analytics.performanceScore >= 90 ? 'text-green-500' : 
            analytics.performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.performanceScore}/100
          </p>
          <p className="text-xs text-foreground/60">Core Web Vitals</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Resolution</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.resolutionMetrics.avgResolutionTime.toFixed(1)}m</p>
          <p className="text-xs text-foreground/60">Time to fix</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Resolution Rate</h3>
          <p className="text-2xl font-bold text-foreground">{formatPercentage(analytics.resolutionMetrics.resolutionRate)}</p>
          <p className="text-xs text-foreground/60">Issues fixed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'alerts', 'metrics', 'trends', 'configuration'] as const).map(tab => (
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
            {/* Performance Metrics Visualization */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { metric: 'LCP', value: 2400, threshold: 2500, description: 'Largest Contentful Paint' },
                  { metric: 'CLS', value: 0.08, threshold: 0.1, description: 'Cumulative Layout Shift' },
                  { metric: 'FCP', value: 1600, threshold: 1800, description: 'First Contentful Paint' },
                  { metric: 'FID', value: 95, threshold: 100, description: 'First Input Delay' }
                ].map((item, index) => (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium capitalize">{item.metric}</h4>
                      <span className={`text-sm font-medium ${
                        item.value <= item.threshold ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.metric === 'CLS' ? item.value.toFixed(3) : formatDuration(item.value)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 mb-3">{item.description}</p>
                    <div className="w-full bg-foreground/20 rounded-full h-2 mb-1">
                      <div 
                        className={`h-2 rounded-full ${
                          item.value <= item.threshold ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((item.value / item.threshold) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-foreground/60">
                      <span>0</span>
                      <span>{formatDuration(item.threshold)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(metric.count)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2.5">
                          <div 
                            className="bg-gold h-2.5 rounded-full" 
                            style={{ width: `${(metric.count / Math.max(...analytics.alertsByMetric.map(m => m.count))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Affected Pages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Affected Pages</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Page URL</th>
                      <th className="text-left py-2 px-4">Alert Count</th>
                      <th className="text-left py-2 px-4">Performance Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topAffectedPages.map((page, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <a href={page.page} className="text-gold hover:underline truncate max-w-xs block">
                            {page.page}
                          </a>
                        </td>
                        <td className="py-3 px-4">{formatNumber(page.alertCount)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/80 mr-2">78%</span>
                            <div className="w-32 bg-foreground/20 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: '78%' }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={filters.metric}
                  onChange={(e) => setFilters({...filters, metric: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Metrics</option>
                  <option value="lcp">LCP</option>
                  <option value="cls">CLS</option>
                  <option value="fcp">FCP</option>
                  <option value="fid">FID</option>
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
                                           (filters.resolved === 'active' && !alert.resolved) || 
                                           (filters.resolved === 'resolved' && alert.resolved);
                      const matchesMetric = filters.metric === 'all' || alert.metric === filters.metric;
                      return matchesSeverity && matchesStatus && matchesMetric;
                    })
                    .map((alert, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium capitalize">{alert.metric}</td>
                        <td className="py-3 px-4">
                          <a href={alert.pageUrl} className="text-gold hover:underline truncate max-w-xs block">
                            {alert.pageUrl}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          {alert.metric === 'cls' 
                            ? alert.currentValue.toFixed(3) 
                            : formatDuration(alert.currentValue)}
                        </td>
                        <td className="py-3 px-4">
                          {alert.metric === 'cls' 
                            ? alert.threshold.toFixed(3) 
                            : formatDuration(alert.threshold)}
                        </td>
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
            <h3 className="text-lg font-semibold mb-4">Metric Thresholds</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Metric</th>
                      <th className="text-left py-2 px-4">Current Avg</th>
                      <th className="text-left py-2 px-4">Threshold</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.metricThresholds.map((metric, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium capitalize">{metric.metric}</td>
                        <td className="py-3 px-4">
                          {metric.metric === 'cls' 
                            ? metric.currentAvg.toFixed(3) 
                            : formatDuration(metric.currentAvg)}
                        </td>
                        <td className="py-3 px-4">
                          {metric.metric === 'cls' 
                            ? metric.threshold.toFixed(3) 
                            : formatDuration(metric.threshold)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            metric.currentAvg <= metric.threshold 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {metric.currentAvg <= metric.threshold ? 'Good' : 'Exceeds Threshold'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/80 mr-2">+2.3%</span>
                            <div className="w-24 bg-foreground/20 rounded-full h-2">
                              <div 
                                className={`${metric.currentAvg <= metric.threshold ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`}
                                style={{ width: `${Math.min((metric.currentAvg / metric.threshold) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  {analytics.performanceTrends.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex items-end justify-center h-64 space-y-1">
                        <div 
                          className="w-1/4 bg-red-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.lcp / 4000) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-yellow-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.cls / 0.3) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-blue-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.fcp / 3000) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-purple-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.fid / 300) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
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
                  <h4 className="font-medium mb-3">Metric Thresholds</h4>
                  <div className="space-y-4">
                    {[
                      { metric: 'LCP', threshold: '2500ms', current: '2400ms', severity: 'high' },
                      { metric: 'CLS', threshold: '0.1', current: '0.08', severity: 'high' },
                      { metric: 'FCP', threshold: '1800ms', current: '1600ms', severity: 'medium' },
                      { metric: 'FID', threshold: '100ms', current: '95ms', severity: 'medium' },
                      { metric: 'TTFB', threshold: '200ms', current: '180ms', severity: 'low' }
                    ].map((config, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-background border border-foreground/20 rounded-lg">
                        <div>
                          <h5 className="font-medium capitalize">{config.metric}</h5>
                          <p className="text-sm text-foreground/60">
                            Current: {config.current}, Threshold: {config.threshold}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAlertVisualization;