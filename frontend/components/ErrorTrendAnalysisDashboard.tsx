// components/ErrorTrendAnalysisDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateErrorTrendAnalysis, 
  getErrorEvents, 
  generateMockErrorTrendData,
  formatTimestamp,
  formatNumber,
  formatPercentage,
  getSeverityColor,
  getSeverityBadgeClass,
  ErrorTrendAnalysisData
} from '@/lib/error-trend-analysis-dashboard';

const ErrorTrendAnalysisDashboard = () => {
  const [analytics, setAnalytics] = useState<ErrorTrendAnalysisData | null>(null);
  const [errorEvents, setErrorEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'errors' | 'pages' | 'times'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    resolved: 'all',
    page: 'all'
  });

  // Load error trend analysis data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockErrorTrendData();
      
      // Calculate analytics
      const analytics = calculateErrorTrendAnalysis();
      setAnalytics(analytics);
      
      // Get error events
      const events = getErrorEvents(50);
      setErrorEvents(events);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

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
        <p>Unable to load error trend analysis data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Error Trend Analysis Dashboard</h2>
            <p className="text-foreground/80 mt-1">Analyze error patterns and trends over time</p>
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
          <h3 className="text-foreground/60 text-sm">Total Errors</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalErrors)}</p>
          <p className="text-xs text-foreground/60">All time</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Error Rate</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.errorRate.toFixed(2)}‰</p>
          <p className="text-xs text-foreground/60">Per thousand page views</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Trend Direction</h3>
          <p className={`text-2xl font-bold ${
            analytics.trendDirection === 'increasing' ? 'text-red-500' : 
            analytics.trendDirection === 'decreasing' ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.trendDirection === 'increasing' ? '↗ Increasing' : 
             analytics.trendDirection === 'decreasing' ? '↘ Decreasing' : '→ Stable'}
          </p>
          <p className="text-xs text-foreground/60">Last period</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Weekly Change</h3>
          <p className={`text-2xl font-bold ${
            analytics.weeklyChange > 5 ? 'text-red-500' : 
            analytics.weeklyChange < -5 ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.weeklyChange > 0 ? '+' : ''}{analytics.weeklyChange.toFixed(2)}%
          </p>
          <p className="text-xs text-foreground/60">Compared to prev week</p>
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
          {(['overview', 'trends', 'errors', 'pages', 'times'] as const).map(tab => (
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
            {/* Error Trend Visualization */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Error Trend Over Time</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.errorTrends.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex items-end justify-center h-72 space-y-1">
                        <div 
                          className="w-1/5 bg-red-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.criticalErrors / Math.max(...analytics.errorTrends.map(d => d.criticalErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/5 bg-orange-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.highSeverityErrors / Math.max(...analytics.errorTrends.map(d => d.highSeverityErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/5 bg-yellow-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.mediumSeverityErrors / Math.max(...analytics.errorTrends.map(d => d.mediumSeverityErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/5 bg-blue-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.lowSeverityErrors / Math.max(...analytics.errorTrends.map(d => d.lowSeverityErrors))) * 100}%` }}
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

            {/* Error Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Errors by Severity</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.errorsBySeverity).map(([severity, count]) => (
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
                            style={{ width: `${(count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/80 w-12">{formatNumber(count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Errors by Type</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {analytics.errorsByType.map((type, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{type.type}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(type.count)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2.5">
                          <div 
                            className="bg-gold h-2.5 rounded-full" 
                            style={{ width: `${(type.count / analytics.errorsByType[0].count) * 100}%` }}
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
                      <th className="text-left py-2 px-4">Error Count</th>
                      <th className="text-left py-2 px-4">Error Rate</th>
                      <th className="text-left py-2 px-4">Trend</th>
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
                        <td className="py-3 px-4">{formatNumber(page.errorCount)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/80 mr-2">{page.errorRate.toFixed(2)}</span>
                            <div className="w-32 bg-foreground/20 rounded-full h-2">
                              <div 
                                className="bg-gold h-2 rounded-full" 
                                style={{ width: `${(page.errorCount / analytics.topAffectedPages[0].errorCount) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center ${
                            Math.random() > 0.5 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {Math.random() > 0.5 ? '↑' : '↓'} {(Math.random() * 10 + 5).toFixed(2)}%
                          </span>
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
            <h3 className="text-lg font-semibold mb-4">Error Trends by Time</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80">
                <div className="flex items-end h-full space-x-1">
                  {analytics.errorFrequencyByHour.map((hourData, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(hourData.errorCount / Math.max(...analytics.errorFrequencyByHour.map(h => h.errorCount))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {hourData.hour}:00
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Error Details</h3>
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
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="javascript">JavaScript</option>
                  <option value="network">Network</option>
                  <option value="resource">Resource</option>
                  <option value="promise">Promise</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Message</th>
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Severity</th>
                    <th className="text-left py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {errorEvents
                    .filter(event => {
                      const matchesSeverity = filters.severity === 'all' || event.severity === filters.severity;
                      const matchesType = filters.type === 'all' || event.errorType === filters.type;
                      return matchesSeverity && matchesType;
                    })
                    .map((event, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 max-w-xs truncate">{event.message}</td>
                        <td className="py-3 px-4">
                          <a href={event.pageUrl} className="text-gold hover:underline truncate max-w-xs block">
                            {event.pageUrl}
                          </a>
                        </td>
                        <td className="py-3 px-4 capitalize">{event.errorType}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(event.severity)}`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatTimestamp(event.timestamp)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Frequency by Page</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page URL</th>
                    <th className="text-left py-2 px-4">Error Count</th>
                    <th className="text-left py-2 px-4">Error Rate</th>
                    <th className="text-left py-2 px-4">Top Error Types</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.errorFrequencyByPage.map((pageData, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">
                        <a href={pageData.page} className="text-gold hover:underline truncate max-w-xs block">
                          {pageData.page}
                        </a>
                      </td>
                      <td className="py-3 px-4">{formatNumber(pageData.errorCount)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-foreground/80 mr-2">{pageData.errorRate.toFixed(2)}</span>
                          <div className="w-32 bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${(pageData.errorCount / analytics.errorFrequencyByPage[0].errorCount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {['javascript', 'network', 'resource'].map((type, idx) => (
                            <span key={idx} className="text-xs bg-foreground/10 px-2 py-1 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Times Tab */}
        {activeTab === 'times' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Distribution by Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-4">Errors by Hour</h4>
                <div className="h-64">
                  <div className="flex items-end h-full space-x-1">
                    {analytics.errorFrequencyByHour.map((hourData, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(hourData.errorCount / Math.max(...analytics.errorFrequencyByHour.map(h => h.errorCount))) * 100}%` }}
                        ></div>
                        <div className="text-xs text-foreground/60 mt-2">
                          {hourData.hour}:00
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-4">Error Sources</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.errorSources).map(([source, count], index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{source}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(count)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              source === 'frontend' ? 'bg-blue-500' :
                              source === 'backend' ? 'bg-purple-500' :
                              source === 'network' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorTrendAnalysisDashboard;