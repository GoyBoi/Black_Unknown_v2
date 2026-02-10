// components/BundleSizeMonitoringDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateBundleSizeMonitoring, 
  getBundleSizeAlerts, 
  resolveBundleSizeAlert, 
  generateMockBundleSizeData,
  formatBytes,
  formatPercentage,
  getSeverityColor,
  getSeverityBadgeClass,
  BundleSizeMonitoringData
} from '@/lib/bundle-size-monitoring';

const BundleSizeMonitoringDashboard = () => {
  const [analytics, setAnalytics] = useState<BundleSizeMonitoringData | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'chunks' | 'assets' | 'alerts' | 'optimization'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    resolved: 'all',
    chunk: 'all'
  });

  // Load bundle size monitoring data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockBundleSizeData();
      
      // Calculate analytics
      const analytics = calculateBundleSizeMonitoring();
      setAnalytics(analytics);
      
      // Get alerts
      const alerts = getBundleSizeAlerts(50);
      setAlerts(alerts);
      
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
          alerts: analytics.alerts.map(a => 
            a.id === alertId ? { ...a, resolved: true, resolvedAt: Date.now() } : a
          )
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
        <p>Unable to load bundle size monitoring data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Bundle Size Monitoring</h2>
            <p className="text-foreground/80 mt-1">Monitor and optimize your application bundle size</p>
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
          <h3 className="text-foreground/60 text-sm">Total Bundle Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analytics.totalSize)}</p>
          <p className="text-xs text-foreground/60">Uncompressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Gzipped Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analytics.totalGzipSize)}</p>
          <p className="text-xs text-foreground/60">Compressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Size Change</h3>
          <p className={`text-2xl font-bold ${
            analytics.sizeChange > 5 ? 'text-red-500' : 
            analytics.sizeChange < -5 ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.sizeChange > 0 ? '+' : ''}{analytics.sizeChange.toFixed(2)}%
          </p>
          <p className="text-xs text-foreground/60">Compared to prev period</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Trend</h3>
          <p className={`text-2xl font-bold ${
            analytics.sizeTrend === 'increasing' ? 'text-red-500' : 
            analytics.sizeTrend === 'decreasing' ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.sizeTrend === 'increasing' ? '↗ Increasing' : 
             analytics.sizeTrend === 'decreasing' ? '↘ Decreasing' : '→ Stable'}
          </p>
          <p className="text-xs text-foreground/60">Size direction</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Performance Score</h3>
          <p className={`text-2xl font-bold ${
            analytics.performanceScore >= 90 ? 'text-green-500' : 
            analytics.performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.performanceScore}/100
          </p>
          <p className="text-xs text-foreground/60">Bundle optimization</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'chunks', 'assets', 'alerts', 'optimization'] as const).map(tab => (
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
            {/* Bundle Size Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bundle Size Trend</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.sizeHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(day.size / Math.max(...analytics.sizeHistory.map(d => d.size))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Largest Chunks */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Largest Chunks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topLargestChunks.map((chunk, index) => (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">{chunk.name}</h4>
                      <span className={`text-sm font-medium ${
                        chunk.size > 300000 ? 'text-red-500' : 
                        chunk.size > 200000 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {formatBytes(chunk.size)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Gzipped:</span>
                        <span>{formatBytes(chunk.gzipSize)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Brotli:</span>
                        <span>{formatBytes(chunk.brotliSize)}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Compression</span>
                          <span>{formatPercentage((chunk.size - chunk.gzipSize) / chunk.size * 100)} saved</span>
                        </div>
                        <div className="w-full bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${((chunk.size - chunk.gzipSize) / chunk.size) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Opportunities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Optimization Opportunities</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="space-y-4">
                  {analytics.optimizationOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg border border-foreground/10">
                      <div>
                        <h4 className="font-medium">{opportunity.type}</h4>
                        <p className="text-sm text-foreground/80">{opportunity.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gold">Save {formatBytes(opportunity.potentialSavings)}</p>
                        <p className="text-xs text-foreground/60">Potential savings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chunks Tab */}
        {activeTab === 'chunks' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Chunks</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Chunk Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Brotli</th>
                    <th className="text-left py-2 px-4">Assets</th>
                    <th className="text-left py-2 px-4">Compression</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.chunks.map((chunk, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-medium">{chunk.name}</td>
                      <td className={`py-3 px-4 font-medium ${
                        chunk.size > 300000 ? 'text-red-500' : 
                        chunk.size > 200000 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {formatBytes(chunk.size)}
                      </td>
                      <td className="py-3 px-4">{formatBytes(chunk.gzipSize)}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.brotliSize)}</td>
                      <td className="py-3 px-4">{chunk.assets.length}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-foreground/80 mr-2">
                            {formatPercentage(((chunk.size - chunk.gzipSize) / chunk.size) * 100)}
                          </span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${((chunk.size - chunk.gzipSize) / chunk.size) * 100}%` }}
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
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Assets</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Asset Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Brotli</th>
                    <th className="text-left py-2 px-4">Chunk</th>
                    <th className="text-left py-2 px-4">Compression</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topLargestAssets.map((asset, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-mono text-sm">{asset.name}</td>
                      <td className={`py-3 px-4 font-medium ${
                        asset.size > 100000 ? 'text-red-500' : 
                        asset.size > 50000 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {formatBytes(asset.size)}
                      </td>
                      <td className="py-3 px-4">{formatBytes(asset.gzipSize)}</td>
                      <td className="py-3 px-4">{formatBytes(asset.brotliSize)}</td>
                      <td className="py-3 px-4">{asset.chunkId}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-foreground/80 mr-2">
                            {formatPercentage(((asset.size - asset.gzipSize) / asset.size) * 100)}
                          </span>
                          <div className="w-20 bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${((asset.size - asset.gzipSize) / asset.size) * 100}%` }}
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
                        <td className="py-3 px-4">{formatBytes(alert.currentValue)}</td>
                        <td className="py-3 px-4">{formatBytes(alert.threshold)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(alert.timestamp).toLocaleString()}</td>
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

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-4">
              {analytics.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      suggestion.priority === 'critical' ? 'bg-red-500/20 text-red-500' :
                      suggestion.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-foreground/80 mb-3">{suggestion.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Estimated savings: {formatBytes(suggestion.estimatedSavings)}</span>
                    <span>Impact: {suggestion.impact}</span>
                    <span>Effort: {suggestion.implementationEffort}</span>
                  </div>
                </div>
              ))}
              
              {analytics.optimizationSuggestions.length === 0 && (
                <div className="text-center py-8 text-foreground/60">
                  <p>No optimization suggestions at this time. Your bundle is well-optimized!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleSizeMonitoringDashboard;