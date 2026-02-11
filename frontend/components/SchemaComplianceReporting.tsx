// components/SchemaComplianceReporting.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateSchemaComplianceAnalytics, 
  getSchemaComplianceReports, 
  generateMockSchemaComplianceData,
  formatBytes,
  formatPercentage,
  formatTimestamp,
  getSeverityColor,
  getSeverityBadgeClass,
  SchemaComplianceAnalytics
} from '@/lib/schema-compliance-reporting';

const SchemaComplianceReporting = () => {
  const [analytics, setAnalytics] = useState<SchemaComplianceAnalytics | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'errors' | 'types' | 'trends'>('overview');
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
        <p>Unable to load schema compliance reporting data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Schema Compliance Reporting</h2>
            <p className="text-foreground/80 mt-1">Monitor and report on structured data compliance</p>
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
          <p className="text-xs text-foreground/60">Validation issues</p>
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
          <p className="text-xs text-foreground/60">Per report</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Schema Coverage</h3>
          <p className="text-2xl font-bold text-foreground">
            {analytics.schemaCoverage.length > 0 ? formatPercentage(analytics.schemaCoverage[0].coverage) : '0%'}
          </p>
          <p className="text-xs text-foreground/60">Most common type</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'reports', 'errors', 'types', 'trends'] as const).map(tab => (
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
                  {analytics.complianceTrend.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${day.complianceRate}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Error Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
                <div className="space-y-3">
                  {analytics.topErrorTypes.map((error, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{error.type}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(error.count)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2.5">
                          <div 
                            className="bg-gold h-2.5 rounded-full" 
                            style={{ width: `${(error.count / analytics.topErrorTypes[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Schema Type Compliance</h3>
                <div className="space-y-4">
                  {analytics.schemaTypeCompliance.map((type, index) => (
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
                        <span>{formatNumber(type.compliant)} compliant</span>
                        <span>{formatNumber(type.total - type.compliant)} non-compliant</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <ul className="space-y-3">
                  {analytics.improvementSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
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
                  {reports.map((report, index) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schema Validation Errors</h3>
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
                  value={filters.schemaType}
                  onChange={(e) => setFilters({...filters, schemaType: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Product">Product</option>
                  <option value="Organization">Organization</option>
                  <option value="Article">Article</option>
                  <option value="BreadcrumbList">BreadcrumbList</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">Schema Type</th>
                    <th className="text-left py-2 px-4">Property</th>
                    <th className="text-left py-2 px-4">Error Type</th>
                    <th className="text-left py-2 px-4">Message</th>
                    <th className="text-left py-2 px-4">Severity</th>
                    <th className="text-left py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.flatMap(report => 
                    report.errors.map((error: any, errorIndex: number) => ({
                      ...error,
                      reportDate: report.reportDate,
                      errorIndex
                    }))
                  )
                  .filter(error => {
                    const matchesSeverity = filters.severity === 'all' || error.severity === filters.severity;
                    const matchesType = filters.schemaType === 'all' || error.schemaType === filters.schemaType;
                    return matchesSeverity && matchesType;
                  })
                  .slice(0, 50) // Limit to first 50 errors
                  .map((error, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">
                        <a href={error.pageUrl} className="text-gold hover:underline truncate max-w-xs block">
                          {error.pageUrl}
                        </a>
                      </td>
                      <td className="py-3 px-4 capitalize">{error.schemaType}</td>
                      <td className="py-3 px-4 font-mono text-sm">{error.property}</td>
                      <td className="py-3 px-4 capitalize">{error.errorType}</td>
                      <td className="py-3 px-4 truncate max-w-xs">{error.message}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(error.severity)}`}>
                          {error.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">{error.reportDate}</td>
                    </tr>
                  ))}
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
              {analytics.schemaTypeCompliance.map((type, index) => (
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
                    <span>{formatNumber(type.compliant)} compliant</span>
                    <span>{formatNumber(type.total - type.compliant)} non-compliant</span>
                  </div>
                </div>
              ))}
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
                  {analytics.errorFrequencyByPage.slice(0, 15).map((pageData, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(pageData.errorCount / Math.max(...analytics.errorFrequencyByPage.map(p => p.errorCount))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2 truncate max-w-[60px]">
                        {pageData.page.split('/').pop() || pageData.page}
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

export default SchemaComplianceReporting;