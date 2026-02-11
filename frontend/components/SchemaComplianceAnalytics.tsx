// components/SchemaComplianceAnalytics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  calculateSchemaComplianceAnalytics,
  getSchemaComplianceReports,
  generateMockSchemaComplianceData,
  formatBytes,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  SchemaComplianceAnalyticsData
} from '@/lib/schema-compliance-analytics';

const SchemaComplianceAnalytics = () => {
  const [analytics, setAnalytics] = useState<SchemaComplianceAnalyticsData | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'pages' | 'types' | 'trends'>('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    schemaType: 'all',
    status: 'all'
  });

  // Load schema compliance analytics data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockSchemaComplianceData();
      
      // Calculate analytics
      const analytics = calculateSchemaComplianceAnalytics();
      setAnalytics(analytics);
      
      // Get reports
      const reports = getSchemaComplianceReports(10);
      setReports(reports);
      
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
        <p>Unable to load schema compliance analytics data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Schema Compliance Analytics</h2>
            <p className="text-foreground/80 mt-1">Analyze structured data compliance across your site</p>
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
          <h3 className="text-foreground/60 text-sm">Overall Compliance</h3>
          <p className={`text-2xl font-bold ${
            analytics.overallCompliance >= 90 ? 'text-green-500' : 
            analytics.overallCompliance >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {formatPercentage(analytics.overallCompliance)}
          </p>
          <p className="text-xs text-foreground/60">Across all pages</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Errors</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalErrors)}</p>
          <p className="text-xs text-foreground/60">Schema validation issues</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Warnings</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalWarnings)}</p>
          <p className="text-xs text-foreground/60">Recommendations</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Validation Time</h3>
          <p className="text-2xl font-bold text-foreground">
            {analytics.validationPerformance.avgValidationTime.toFixed(0)}ms
          </p>
          <p className="text-xs text-foreground/60">Per page</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Pages/Sec</h3>
          <p className="text-2xl font-bold text-foreground">
            {analytics.validationPerformance.pagesPerSecond.toFixed(1)}
          </p>
          <p className="text-xs text-foreground/60">Validation speed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'reports', 'pages', 'types', 'trends'] as const).map(tab => (
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
            {/* Compliance Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Compliance Trend</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.complianceTrend.length > 0 ? (
                    analytics.complianceTrend.map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${day.complianceRate}%` }}
                        ></div>
                        <div className="text-xs text-foreground/60 mt-2">
                          {(() => {
                            try {
                              return new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                            } catch (e) {
                              return day.date; // fallback to raw date string if parsing fails
                            }
                          })()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/60">
                      No compliance trend data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Top Error Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
                <div className="space-y-3">
                  {analytics.topErrorTypes.length > 0 ? (
                    analytics.topErrorTypes.map((error, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="capitalize">{error.type}</span>
                        <div className="flex items-center">
                          <span className="text-foreground mr-2">{formatNumber(error.count)}</span>
                          <div className="w-32 bg-foreground/20 rounded-full h-2.5">
                            <div
                              className="bg-red-500 h-2.5 rounded-full"
                              style={{ 
                                width: `${analytics.topErrorTypes.length > 0 && analytics.topErrorTypes[0].count > 0 
                                  ? (error.count / analytics.topErrorTypes[0].count) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-foreground/60 italic">
                      No error type data available
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Schema Type Compliance</h3>
                <div className="space-y-4">
                  {analytics.schemaTypeCompliance.length > 0 ? (
                    analytics.schemaTypeCompliance.map((type, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="capitalize">{type.type}</span>
                          <span className={`font-medium ${
                            type.complianceRate >= 90 ? 'text-green-500' :
                            type.complianceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {formatPercentage(type.complianceRate)}
                          </span>
                        </div>
                        <div className="w-full bg-foreground/20 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              type.complianceRate >= 90 ? 'bg-green-500' :
                              type.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${type.complianceRate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-foreground/60 mt-1">
                          <span>{formatNumber(Math.floor((type.complianceRate / 100) * type.total))} compliant</span>
                          <span>{formatNumber(type.total - Math.floor((type.complianceRate / 100) * type.total))} non-compliant</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-foreground/60 italic">
                      No schema type compliance data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <ul className="space-y-3">
                  {analytics.improvementSuggestions.length > 0 ? (
                    analytics.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-foreground/60 italic">
                      No improvement suggestions available
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Compliance Reports</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Pages</th>
                    <th className="text-left py-2 px-4">Compliant</th>
                    <th className="text-left py-2 px-4">Errors</th>
                    <th className="text-left py-2 px-4">Warnings</th>
                    <th className="text-left py-2 px-4">Compliance</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((report, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">{report.reportDate}</td>
                        <td className="py-3 px-4">{formatNumber(report.totalPages)}</td>
                        <td className="py-3 px-4">{formatNumber(report.compliantPages)}</td>
                        <td className="py-3 px-4">{formatNumber(report.errors.length)}</td>
                        <td className="py-3 px-4">{formatNumber(report.warnings.length)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              report.complianceRate >= 90 ? 'text-green-500' :
                              report.complianceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {formatPercentage(report.complianceRate)}
                            </span>
                            <div className="ml-2 w-24 bg-foreground/20 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  report.complianceRate >= 90 ? 'bg-green-500' :
                                  report.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${report.complianceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-sm text-gold hover:underline">View Report</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-foreground/60">
                        No compliance reports available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Pages with Most Issues</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page URL</th>
                    <th className="text-left py-2 px-4">Issues</th>
                    <th className="text-left py-2 px-4">Compliance Rate</th>
                    <th className="text-left py-2 px-4">Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.pagesWithIssues.length > 0 ? (
                    analytics.pagesWithIssues.map((page, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <a href={page.url} className="text-gold hover:underline truncate max-w-xs block">
                            {page.url}
                          </a>
                        </td>
                        <td className="py-3 px-4">{formatNumber(page.issues)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              page.complianceRate >= 90 ? 'text-green-500' :
                              page.complianceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {formatPercentage(page.complianceRate)}
                            </span>
                            <div className="ml-2 w-24 bg-foreground/20 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  page.complianceRate >= 90 ? 'bg-green-500' :
                                  page.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${page.complianceRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">Just now</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center text-foreground/60">
                        No pages with issues available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Schema Type Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.schemaTypeCompliance.length > 0 ? (
                analytics.schemaTypeCompliance.map((type, index) => (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium capitalize">{type.type}</h4>
                      <span className={`text-lg font-bold ${
                        type.complianceRate >= 90 ? 'text-green-500' :
                        type.complianceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {formatPercentage(type.complianceRate)}
                      </span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2.5 mb-3">
                      <div
                        className={`h-2.5 rounded-full ${
                          type.complianceRate >= 90 ? 'bg-green-500' :
                          type.complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${type.complianceRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/60">
                      <span>{formatNumber(Math.floor((type.complianceRate / 100) * type.total))} compliant</span>
                      <span>{formatNumber(type.total - Math.floor((type.complianceRate / 100) * type.total))} non-compliant</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-foreground/60">
                  No schema type compliance data available
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Error Frequency by Page</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80">
                <div className="flex items-end h-full space-x-1">
                  {analytics.errorFrequencyByPage.length > 0 ? (
                    analytics.errorFrequencyByPage.slice(0, 15).map((pageData, index) => {
                      // Calculate max error count to avoid division by zero
                      const maxErrorCount = Math.max(...analytics.errorFrequencyByPage.map(p => p.errorCount));
                      const heightPercentage = maxErrorCount > 0 ? (pageData.errorCount / maxErrorCount) * 100 : 0;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                            style={{ height: `${heightPercentage}%` }}
                          ></div>
                          <div className="text-xs text-foreground/60 mt-2 truncate max-w-[60px]">
                            {pageData.page.split('/').pop() || pageData.page}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/60">
                      No error frequency data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaComplianceAnalytics;