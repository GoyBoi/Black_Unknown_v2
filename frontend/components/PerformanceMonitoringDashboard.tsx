// components/PerformanceMonitoringDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculatePerformanceAnalytics, 
  getPerformanceReports, 
  collectCoreWebVitals,
  getPerformanceRecommendations,
  PerformanceAnalytics
} from '@/lib/performance-monitoring';

const PerformanceMonitoringDashboard = () => {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'reports' | 'recommendations'>('overview');

  // Load performance data
  useEffect(() => {
    const loadPerformanceData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll create mock data
      const mockAnalytics: PerformanceAnalytics = {
        avgLcp: 2400, // 2.4s
        avgCls: 0.08, // 0.08
        avgFcp: 1600, // 1.6s
        avgFid: 120, // 120ms
        avgTtfb: 180, // 180ms
        avgInp: 250, // 250ms
        goodLcp: 65, // 65% good
        needsImprovementLcp: 25, // 25% needs improvement
        poorLcp: 10, // 10% poor
        goodCls: 85, // 85% good
        needsImprovementCls: 10, // 10% needs improvement
        poorCls: 5, // 5% poor
        goodFcp: 70, // 70% good
        needsImprovementFcp: 20, // 20% needs improvement
        poorFcp: 10, // 10% poor
        totalReports: 1240,
        reportsByDay: [
          { date: '2026-01-15', count: 45, avgLcp: 2300, avgCls: 0.07, avgFcp: 1500 },
          { date: '2026-01-16', count: 52, avgLcp: 2500, avgCls: 0.09, avgFcp: 1650 },
          { date: '2026-01-17', count: 48, avgLcp: 2200, avgCls: 0.06, avgFcp: 1450 },
          { date: '2026-01-18', count: 55, avgLcp: 2600, avgCls: 0.11, avgFcp: 1700 },
          { date: '2026-01-19', count: 60, avgLcp: 2400, avgCls: 0.08, avgFcp: 1600 },
          { date: '2026-01-20', count: 58, avgLcp: 2350, avgCls: 0.07, avgFcp: 1550 },
          { date: '2026-01-21', count: 62, avgLcp: 2450, avgCls: 0.09, avgFcp: 1620 },
        ]
      };
      
      setAnalytics(mockAnalytics);
      
      // Generate mock reports
      const mockReports = Array.from({ length: 20 }, (_, i) => ({
        id: `report_${i}`,
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000),
        pageUrl: ['/product/123', '/shop', '/cart', '/checkout', '/about'][i % 5],
        coreWebVitals: {
          lcp: Math.floor(Math.random() * 3000) + 500,
          cls: Math.random() * 0.3,
          fcp: Math.floor(Math.random() * 2000) + 300,
          fid: Math.floor(Math.random() * 300) + 50,
          ttfb: Math.floor(Math.random() * 500) + 50,
          inp: Math.floor(Math.random() * 500) + 100
        },
        deviceInfo: {
          type: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
          connection: ['4G', '3G', 'Slow 2G'][Math.floor(Math.random() * 3)]
        }
      }));
      
      setReports(mockReports);
      setIsLoading(false);
    };

    loadPerformanceData();
  }, [timeRange]);

  // Format time in milliseconds to a readable format
  const formatTime = (ms: number): string => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Get color based on performance score
  const getPerformanceColor = (score: number, metric: 'lcp' | 'cls' | 'fcp' | 'fid' | 'ttfb' | 'inp'): string => {
    if (metric === 'cls') {
      // For CLS, lower is better
      if (score <= 0.1) return 'text-green-500';
      if (score <= 0.25) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      // For other metrics, lower is better
      if (
        (metric === 'lcp' && score <= 2500) ||
        (metric === 'fcp' && score <= 1800) ||
        (metric === 'fid' && score <= 100) ||
        (metric === 'ttfb' && score <= 200) ||
        (metric === 'inp' && score <= 200)
      ) {
        return 'text-green-500';
      } else if (
        (metric === 'lcp' && score <= 4000) ||
        (metric === 'fcp' && score <= 3000) ||
        (metric === 'fid' && score <= 300) ||
        (metric === 'ttfb' && score <= 500) ||
        (metric === 'inp' && score <= 500)
      ) {
        return 'text-yellow-500';
      } else {
        return 'text-red-500';
      }
    }
  };

  // Get performance status text
  const getPerformanceStatus = (score: number, metric: 'lcp' | 'cls' | 'fcp' | 'fid' | 'ttfb' | 'inp'): string => {
    if (metric === 'cls') {
      // For CLS, lower is better
      if (score <= 0.1) return 'Good';
      if (score <= 0.25) return 'Needs Improvement';
      return 'Poor';
    } else {
      // For other metrics, lower is better
      if (
        (metric === 'lcp' && score <= 2500) ||
        (metric === 'fcp' && score <= 1800) ||
        (metric === 'fid' && score <= 100) ||
        (metric === 'ttfb' && score <= 200) ||
        (metric === 'inp' && score <= 200)
      ) {
        return 'Good';
      } else if (
        (metric === 'lcp' && score <= 4000) ||
        (metric === 'fcp' && score <= 3000) ||
        (metric === 'fid' && score <= 300) ||
        (metric === 'ttfb' && score <= 500) ||
        (metric === 'inp' && score <= 500)
      ) {
        return 'Needs Improvement';
      } else {
        return 'Poor';
      }
    }
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
        <p>Unable to load performance analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Performance Monitoring Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor Core Web Vitals and other performance metrics</p>
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

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'metrics', 'reports', 'recommendations'] as const).map(tab => (
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
          <div>
            {/* Core Web Vitals Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Largest Contentful Paint (LCP)</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    analytics.avgLcp <= 2500 ? 'bg-green-500/20 text-green-500' : 
                    analytics.avgLcp <= 4000 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {getPerformanceStatus(analytics.avgLcp, 'lcp')}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${getPerformanceColor(analytics.avgLcp, 'lcp')}`}>
                  {formatTime(analytics.avgLcp)}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-foreground/80 mb-1">
                    <span>Good</span>
                    <span>{analytics.goodLcp.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-foreground/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${analytics.goodLcp}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Cumulative Layout Shift (CLS)</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    analytics.avgCls <= 0.1 ? 'bg-green-500/20 text-green-500' : 
                    analytics.avgCls <= 0.25 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {getPerformanceStatus(analytics.avgCls, 'cls')}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${getPerformanceColor(analytics.avgCls, 'cls')}`}>
                  {analytics.avgCls.toFixed(3)}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-foreground/80 mb-1">
                    <span>Good</span>
                    <span>{analytics.goodCls.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-foreground/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${analytics.goodCls}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">First Contentful Paint (FCP)</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    analytics.avgFcp <= 1800 ? 'bg-green-500/20 text-green-500' : 
                    analytics.avgFcp <= 3000 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {getPerformanceStatus(analytics.avgFcp, 'fcp')}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${getPerformanceColor(analytics.avgFcp, 'fcp')}`}>
                  {formatTime(analytics.avgFcp)}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-foreground/80 mb-1">
                    <span>Good</span>
                    <span>{analytics.goodFcp.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-foreground/20 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${analytics.goodFcp}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Trend */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analytics.reportsByDay.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="text-xs text-foreground/60 mb-2">{day.date.split('-')[2]}</div>
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(day.avgLcp / 4000) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-2">{formatTime(day.avgLcp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Device and Connection Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Device Performance</h3>
                <div className="space-y-4">
                  {['Desktop', 'Mobile', 'Tablet'].map((device, index) => {
                    // In a real implementation, we would calculate actual device performance
                    const avgLcp = [2200, 2800, 2400][index];
                    const avgCls = [0.07, 0.12, 0.09][index];
                    
                    return (
                      <div key={device} className="flex justify-between items-center">
                        <span>{device}</span>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-xs text-foreground/60">LCP</div>
                            <div className={`font-medium ${getPerformanceColor(avgLcp, 'lcp')}`}>
                              {formatTime(avgLcp)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/60">CLS</div>
                            <div className={`font-medium ${getPerformanceColor(avgCls, 'cls')}`}>
                              {avgCls.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Connection Performance</h3>
                <div className="space-y-4">
                  {['4G', '3G', 'Slow 2G'].map((connection, index) => {
                    // In a real implementation, we would calculate actual connection performance
                    const avgLcp = [2000, 3200, 4500][index];
                    const avgTtfb = [120, 350, 800][index];
                    
                    return (
                      <div key={connection} className="flex justify-between items-center">
                        <span>{connection}</span>
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-xs text-foreground/60">LCP</div>
                            <div className={`font-medium ${getPerformanceColor(avgLcp, 'lcp')}`}>
                              {formatTime(avgLcp)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-foreground/60">TTFB</div>
                            <div className={`font-medium ${getPerformanceColor(avgTtfb, 'ttfb')}`}>
                              {formatTime(avgTtfb)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Metric</th>
                    <th className="text-left py-2 px-4">Average</th>
                    <th className="text-left py-2 px-4">Good</th>
                    <th className="text-left py-2 px-4">Needs Improvement</th>
                    <th className="text-left py-2 px-4">Poor</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/10">
                    <td className="py-3 px-4 font-medium">Largest Contentful Paint (LCP)</td>
                    <td className={`py-3 px-4 font-medium ${getPerformanceColor(analytics.avgLcp, 'lcp')}`}>
                      {formatTime(analytics.avgLcp)}
                    </td>
                    <td className="py-3 px-4">{analytics.goodLcp.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.needsImprovementLcp.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.poorLcp.toFixed(1)}%</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analytics.avgLcp <= 2500 ? 'bg-green-500/20 text-green-500' : 
                        analytics.avgLcp <= 4000 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {getPerformanceStatus(analytics.avgLcp, 'lcp')}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-3 px-4 font-medium">Cumulative Layout Shift (CLS)</td>
                    <td className={`py-3 px-4 font-medium ${getPerformanceColor(analytics.avgCls, 'cls')}`}>
                      {analytics.avgCls.toFixed(3)}
                    </td>
                    <td className="py-3 px-4">{analytics.goodCls.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.needsImprovementCls.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.poorCls.toFixed(1)}%</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analytics.avgCls <= 0.1 ? 'bg-green-500/20 text-green-500' : 
                        analytics.avgCls <= 0.25 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {getPerformanceStatus(analytics.avgCls, 'cls')}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-3 px-4 font-medium">First Contentful Paint (FCP)</td>
                    <td className={`py-3 px-4 font-medium ${getPerformanceColor(analytics.avgFcp, 'fcp')}`}>
                      {formatTime(analytics.avgFcp)}
                    </td>
                    <td className="py-3 px-4">{analytics.goodFcp.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.needsImprovementFcp.toFixed(1)}%</td>
                    <td className="py-3 px-4">{analytics.poorFcp.toFixed(1)}%</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analytics.avgFcp <= 1800 ? 'bg-green-500/20 text-green-500' : 
                        analytics.avgFcp <= 3000 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {getPerformanceStatus(analytics.avgFcp, 'fcp')}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-foreground/10">
                    <td className="py-3 px-4 font-medium">First Input Delay (FID)</td>
                    <td className={`py-3 px-4 font-medium ${getPerformanceColor(analytics.avgFid, 'fid')}`}>
                      {formatTime(analytics.avgFid)}
                    </td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analytics.avgFid <= 100 ? 'bg-green-500/20 text-green-500' : 
                        analytics.avgFid <= 300 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {getPerformanceStatus(analytics.avgFid, 'fid')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Time to First Byte (TTFB)</td>
                    <td className={`py-3 px-4 font-medium ${getPerformanceColor(analytics.avgTtfb, 'ttfb')}`}>
                      {formatTime(analytics.avgTtfb)}
                    </td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        analytics.avgTtfb <= 200 ? 'bg-green-500/20 text-green-500' : 
                        analytics.avgTtfb <= 500 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {getPerformanceStatus(analytics.avgTtfb, 'ttfb')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Reports ({analytics.totalReports} collected)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">LCP</th>
                    <th className="text-left py-2 px-4">CLS</th>
                    <th className="text-left py-2 px-4">FCP</th>
                    <th className="text-left py-2 px-4">Device</th>
                    <th className="text-left py-2 px-4">Connection</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">{new Date(report.timestamp).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <a href={report.pageUrl} className="text-gold hover:underline">
                          {report.pageUrl}
                        </a>
                      </td>
                      <td className={`py-3 px-4 font-medium ${getPerformanceColor(report.coreWebVitals.lcp, 'lcp')}`}>
                        {formatTime(report.coreWebVitals.lcp)}
                      </td>
                      <td className={`py-3 px-4 font-medium ${getPerformanceColor(report.coreWebVitals.cls, 'cls')}`}>
                        {report.coreWebVitals.cls.toFixed(3)}
                      </td>
                      <td className={`py-3 px-4 font-medium ${getPerformanceColor(report.coreWebVitals.fcp, 'fcp')}`}>
                        {formatTime(report.coreWebVitals.fcp)}
                      </td>
                      <td className="py-3 px-4">{report.deviceInfo.type}</td>
                      <td className="py-3 px-4">{report.deviceInfo.connection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance Recommendations</h3>
            <div className="space-y-4">
              {getPerformanceRecommendations(analytics).map((rec, index) => (
                <div key={index} className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                  <div className="flex">
                    <div className="mr-3 text-gold">•</div>
                    <p>{rec}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-semibold mb-3">Performance Best Practices</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Optimize images with modern formats (WebP, AVIF) and proper sizing</span>
                </li>
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Implement lazy loading for off-screen images and components</span>
                </li>
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Reduce JavaScript bundle size and defer non-critical scripts</span>
                </li>
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Preload critical resources and use resource hints</span>
                </li>
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Optimize server response times and implement caching strategies</span>
                </li>
                <li className="flex items-start">
                  <div className="text-gold mr-2">•</div>
                  <span>Minimize layout shifts by reserving space for content</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitoringDashboard;