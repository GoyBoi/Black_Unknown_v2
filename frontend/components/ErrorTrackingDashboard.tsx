// components/ErrorTrackingDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateErrorAnalytics, 
  getErrorReports, 
  getRecentErrors, 
  getTopErrorPages, 
  getErrorFrequencyByHour,
  generateMockErrorData,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  ErrorAnalytics,
  ErrorReport
} from '@/lib/error-tracking-dashboard';

const ErrorTrackingDashboard = () => {
  const [analytics, setAnalytics] = useState<ErrorAnalytics | null>(null);
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<{ page: string; count: number }[]>([]);
  const [hourlyErrors, setHourlyErrors] = useState<{ hour: number; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'errors' | 'pages' | 'trends' | 'sources'>('overview');

  // Load error tracking data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockErrorData();
      
      // Calculate analytics
      const analytics = calculateErrorAnalytics();
      setAnalytics(analytics);
      
      // Get reports
      const reports = getErrorReports(20);
      setReports(reports);
      
      // Get recent errors
      const recent = getRecentErrors(10);
      setRecentErrors(recent);
      
      // Get top error pages
      const topPages = getTopErrorPages(10);
      setTopPages(topPages);
      
      // Get hourly error distribution
      const hourly = getErrorFrequencyByHour();
      setHourlyErrors(hourly);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get color based on error rate
  const getErrorRateColor = (rate: number): string => {
    if (rate < 10) return 'text-green-500';
    if (rate < 50) return 'text-yellow-500';
    return 'text-red-500';
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
        <p>Unable to load error tracking data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Error Tracking Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and analyze application errors</p>
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
          <p className="text-xs text-foreground/60">All severity levels</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Error Rate</h3>
          <p className={`text-2xl font-bold ${getErrorRateColor(analytics.errorRate)}`}>
            {analytics.errorRate.toFixed(2)}‰
          </p>
          <p className="text-xs text-foreground/60">Per thousand page views</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Critical Errors</h3>
          <p className="text-2xl font-bold text-red-500">{formatNumber(analytics.criticalErrors)}</p>
          <p className="text-xs text-foreground/60">Require immediate attention</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Resolved</h3>
          <p className="text-2xl font-bold text-green-500">{formatNumber(analytics.resolvedErrors)}</p>
          <p className="text-xs text-foreground/60">Fixed issues</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Resolution</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.avgResolutionTime.toFixed(1)}h</p>
          <p className="text-xs text-foreground/60">Time to fix</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'errors', 'pages', 'trends', 'sources'] as const).map(tab => (
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
            {/* Error Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Error Distribution by Severity</h3>
                <div className="space-y-3">
                  {analytics.errorDistribution.bySeverity.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="capitalize">{item.severity}</span>
                      <div className="flex items-center flex-1 ml-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2.5 mr-3">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.severity === 'critical' ? 'bg-red-500' :
                              item.severity === 'high' ? 'bg-orange-500' :
                              item.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${(item.count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/80 w-12">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Error Sources</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.errorSources).map(([source, count], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="capitalize">{source}</span>
                      <div className="flex items-center flex-1 ml-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2.5 mr-3">
                          <div 
                            className={`h-2.5 rounded-full ${
                              source === 'frontend' ? 'bg-blue-500' :
                              source === 'backend' ? 'bg-purple-500' :
                              source === 'network' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/80 w-12">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Error Messages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Error Messages</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-3 px-4">Message</th>
                      <th className="text-left py-3 px-4">Count</th>
                      <th className="text-left py-3 px-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topErrorMessages.slice(0, 5).map((error, index) => (
                      <tr key={index} className="border-b border-foreground/10">
                        <td className="py-3 px-4">{error.message}</td>
                        <td className="py-3 px-4">{formatNumber(error.count)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">
                            High
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

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
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
                  {recentErrors.map((error, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 max-w-xs truncate">{error.message}</td>
                      <td className="py-3 px-4">
                        <a href={error.url} className="text-gold hover:underline truncate max-w-xs">
                          {error.url}
                        </a>
                      </td>
                      <td className="py-3 px-4 capitalize">{error.errorType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(error.severity)}`}>
                          {error.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatTimestamp(error.timestamp)}</td>
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
            <h3 className="text-lg font-semibold mb-4">Error Distribution by Page</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page URL</th>
                    <th className="text-left py-2 px-4">Error Count</th>
                    <th className="text-left py-2 px-4">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.errorDistribution.byPage.map((page, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">
                        <a href={page.page} className="text-gold hover:underline">
                          {page.page}
                        </a>
                      </td>
                      <td className="py-3 px-4">{formatNumber(page.count)}</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(page.count / analytics.totalErrors) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80 flex items-end justify-between space-x-1">
                {hourlyErrors.map((hourData, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                      style={{ height: `${(hourData.count / Math.max(...hourlyErrors.map(h => h.count))) * 100}%` }}
                    ></div>
                    <div className="text-xs text-foreground/60 mt-2">
                      {hourData.hour}:00
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(analytics.errorSources).map(([source, count], index) => {
                const percentage = (count / analytics.totalErrors) * 100;
                return (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium capitalize">{source}</h4>
                      <span className="text-lg font-bold text-foreground">{formatNumber(count)}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          source === 'frontend' ? 'bg-blue-500' :
                          source === 'backend' ? 'bg-purple-500' :
                          source === 'network' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-foreground/60 mt-1">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorTrackingDashboard;