// components/ErrorTrendDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  calculateErrorTrendAnalysis,
  getErrorEvents,
  generateMockErrorTrendData,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  ErrorTrendAnalysisData
} from '@/lib/error-trend-analysis-dashboard';

const ErrorTrendDashboard = () => {
  const [analytics, setAnalytics] = useState<ErrorTrendAnalysisData | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'patterns' | 'correlations' | 'forecast'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    type: 'all',
    page: 'all'
  });

  // Load error trend data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockErrorTrendData();
      
      // Calculate analytics
      const analytics = calculateErrorTrendAnalysis();
      setAnalytics(analytics);
      
      // Get trends
      const trends = getErrorEvents(50);
      setTrends(trends);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

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
        <p>Unable to load error trend analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Error Trend Dashboard</h2>
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
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 rounded ${timeRange === 'quarter' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
            >
              Last Quarter
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
            analytics.weeklyChange > 0 ? 'text-red-500' : 
            analytics.weeklyChange < 0 ? 'text-green-500' : 'text-yellow-500'
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
          {(['overview', 'trends', 'patterns', 'correlations', 'forecast'] as const).map(tab => (
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
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(day.totalErrors / Math.max(...analytics.errorTrends.map(d => d.totalErrors))) * 100}%` }}
                      ></div>
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
                            style={{ width: `${(type.count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Error Pages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Error Pages</h3>
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
                            <span className="text-foreground/80 mr-2">{page.errorRate.toFixed(2)}%</span>
                            <div className="w-24 bg-foreground/20 rounded-full h-2">
                              <div
                                className="bg-gold h-2 rounded-full"
                                style={{ width: `${page.errorRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground/80">N/A</span>
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
            <h3 className="text-lg font-semibold mb-4">Detailed Error Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-96">
                <div className="flex items-end h-full space-x-1">
                  {analytics.errorTrends.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex items-end justify-center h-80 space-y-1">
                        <div 
                          className="w-1/4 bg-red-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.criticalErrors / Math.max(...analytics.errorTrends.map(d => d.criticalErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-orange-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.highSeverityErrors / Math.max(...analytics.errorTrends.map(d => d.highSeverityErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-yellow-500/50 rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${(day.mediumSeverityErrors / Math.max(...analytics.errorTrends.map(d => d.mediumSeverityErrors))) * 100}%` }}
                        ></div>
                        <div 
                          className="w-1/4 bg-blue-500/50 rounded-t hover:opacity-90 transition-opacity"
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
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-3">Errors by Time of Day</h4>
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
                <h4 className="font-medium mb-3">Error Frequency by Hour</h4>
                <div className="h-64">
                  <div className="flex items-end h-full space-x-1">
                    {analytics.errorFrequencyByHour.slice(0, 12).map((hourData, index) => (
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
          </div>
        )}

        {/* Correlations Tab */}
        {activeTab === 'correlations' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Correlations</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-background rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-3">Error Sources</h4>
                  <div className="space-y-3">
                    {Object.entries(analytics.errorSources).map(([source, count], index) => (
                      <div key={index} className="flex justify-between">
                        <span className="capitalize">{source}</span>
                        <div className="flex items-center">
                          <span className="text-foreground mr-2">{formatNumber(count)}</span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full"
                              style={{ width: `${(count / analytics.totalErrors) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-3">Error Types</h4>
                  <div className="space-y-3">
                    {analytics.errorsByType.map((type, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="capitalize">{type.type}</span>
                        <div className="flex items-center">
                          <span className="text-foreground mr-2">{formatNumber(type.count)}</span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full"
                              style={{ width: `${(type.count / analytics.totalErrors) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-3">Error Severity</h4>
                  <div className="space-y-3">
                    {Object.entries(analytics.errorsBySeverity).map(([severity, count], index) => (
                      <div key={index} className="flex justify-between">
                        <span className="capitalize">{severity}</span>
                        <div className="flex items-center">
                          <span className="text-foreground mr-2">{formatNumber(count)}</span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div
                              className="bg-gold h-2 rounded-full"
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
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Forecast</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-background p-4 rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-2">Predicted Errors</h4>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.errorPredictions.predictedErrors)}</p>
                  <p className="text-sm text-foreground/60">Next 7 days</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-2">Confidence Level</h4>
                  <p className="text-2xl font-bold text-foreground">{analytics.errorPredictions.confidence}%</p>
                  <p className="text-sm text-foreground/60">Model accuracy</p>
                </div>
                <div className="bg-background p-4 rounded-lg border border-foreground/10">
                  <h4 className="font-medium mb-2">Trend Direction</h4>
                  <p className="text-2xl font-bold text-foreground/60">N/A</p>
                  <p className="text-sm text-foreground/60">Based on historical data</p>
                </div>
              </div>

              <div className="h-80">
                <h4 className="font-medium mb-4">Forecast Visualization</h4>
                <div className="flex items-end h-64 space-x-1">
                  {analytics.errorTrends.map((dataPoint, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(dataPoint.totalErrors / Math.max(...analytics.errorTrends.map(d => d.totalErrors))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(dataPoint.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

export default ErrorTrendDashboard;