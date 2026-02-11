// components/SchemaComplianceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateSchemaCompliance,
  getSchemaComplianceReports,
  validateSchema,
  SchemaComplianceData,
  SchemaComplianceReport,
  SchemaValidationError
} from '@/lib/schema-compliance';

const SchemaComplianceDashboard = () => {
  const [complianceData, setComplianceData] = useState<SchemaComplianceData | null>(null);
  const [reports, setReports] = useState<SchemaComplianceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'errors' | 'types' | 'trends'>('overview');

  // Load schema compliance data
  useEffect(() => {
    const loadComplianceData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll create mock data
      const mockComplianceData: SchemaComplianceData = {
        totalUrls: 125,
        compliantUrls: 98,
        nonCompliantUrls: 27,
        complianceRate: 78.4,
        totalErrors: 42,
        criticalErrors: 8,
        warnings: 15,
        topErrorTypes: [
          { type: 'Missing required property: name', count: 12 },
          { type: 'Invalid date format', count: 8 },
          { type: 'Missing image property', count: 7 },
          { type: 'Incorrect @type value', count: 5 },
          { type: 'Missing price in Offer', count: 4 }
        ],
        schemaTypeDistribution: [
          { type: 'Product', compliant: 65, nonCompliant: 12 },
          { type: 'Organization', compliant: 22, nonCompliant: 3 },
          { type: 'Article', compliant: 8, nonCompliant: 5 },
          { type: 'BreadcrumbList', compliant: 15, nonCompliant: 7 }
        ],
        reportsByDay: [
          { date: '2026-01-15', compliant: 85, nonCompliant: 15, total: 100 },
          { date: '2026-01-16', compliant: 82, nonCompliant: 18, total: 100 },
          { date: '2026-01-17', compliant: 88, nonCompliant: 12, total: 100 },
          { date: '2026-01-18', compliant: 90, nonCompliant: 10, total: 100 },
          { date: '2026-01-19', compliant: 87, nonCompliant: 13, total: 100 },
          { date: '2026-01-20', compliant: 92, nonCompliant: 8, total: 100 },
          { date: '2026-01-21', compliant: 95, nonCompliant: 5, total: 100 }
        ]
      };
      
      setComplianceData(mockComplianceData);
      
      // Generate mock reports
      const mockReports: SchemaComplianceReport[] = [
        {
          id: 'report_1',
          timestamp: Date.now(),
          url: '/product/hand-knitted-cardigan',
          schemaType: 'Product',
          isValid: false,
          errors: [
            {
              id: 'err_1',
              type: 'missing_property',
              property: 'gtin',
              message: 'Missing required property: gtin',
              severity: 'warning',
              suggestedFix: 'Add gtin property with product identifier'
            },
            {
              id: 'err_2',
              type: 'invalid_format',
              property: 'offers.price',
              message: 'Price should be a string with currency symbol',
              severity: 'error',
              suggestedFix: 'Format price as "129.99" instead of 129.99'
            }
          ],
          warnings: [
            {
              id: 'warn_1',
              type: 'missing_property',
              property: 'mpn',
              message: 'Recommended property mpn is missing',
              suggestedFix: 'Add mpn property with manufacturer part number'
            }
          ]
        },
        {
          id: 'report_2',
          timestamp: Date.now() - 86400000, // 1 day ago
          url: '/about',
          schemaType: 'Organization',
          isValid: true,
          errors: [],
          warnings: []
        },
        {
          id: 'report_3',
          timestamp: Date.now() - 172800000, // 2 days ago
          url: '/blog/new-collection-launch',
          schemaType: 'Article',
          isValid: false,
          errors: [
            {
              id: 'err_3',
              type: 'invalid_date',
              property: 'datePublished',
              message: 'Invalid date format',
              severity: 'error',
              suggestedFix: 'Use ISO 8601 format (YYYY-MM-DD)'
            }
          ],
          warnings: []
        }
      ];
      
      setReports(mockReports);
      setIsLoading(false);
    };

    loadComplianceData();
  }, [timeRange]);

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Get color based on compliance rate
  const getComplianceColor = (rate: number): string => {
    if (rate >= 90) return 'text-green-500';
    if (rate >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get status badge class
  const getStatusBadgeClass = (isValid: boolean): string => {
    return isValid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!complianceData) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>Unable to load schema compliance data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Schema Compliance Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and maintain schema.org structured data compliance</p>
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
          <h3 className="text-foreground/60 text-sm">Total URLs</h3>
          <p className="text-2xl font-bold text-foreground">{complianceData.totalUrls}</p>
          <p className="text-xs text-foreground/60">Pages scanned</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Compliance Rate</h3>
          <p className={`text-2xl font-bold ${getComplianceColor(complianceData.complianceRate)}`}>
            {formatPercentage(complianceData.complianceRate)}
          </p>
          <p className="text-xs text-foreground/60">Valid schemas</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Compliant Pages</h3>
          <p className="text-2xl font-bold text-foreground">{complianceData.compliantUrls}</p>
          <p className="text-xs text-foreground/60">Valid structured data</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Non-Compliant</h3>
          <p className="text-2xl font-bold text-foreground">{complianceData.nonCompliantUrls}</p>
          <p className="text-xs text-foreground/60">Need attention</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Errors</h3>
          <p className="text-2xl font-bold text-foreground">{complianceData.totalErrors}</p>
          <p className="text-xs text-foreground/60">Issues found</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'pages', 'errors', 'types', 'trends'] as const).map(tab => (
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
                <div className="h-64 flex items-end justify-between space-x-1">
                  {complianceData.reportsByDay.map((day, index) => {
                    const heightPercentage = (day.compliant / day.total) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                        <div className="text-xs text-foreground/60 mt-2">
                          {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Error Types */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <h4 className="font-medium text-foreground mb-3">Most Common Errors</h4>
                  <div className="space-y-3">
                    {complianceData.topErrorTypes.map((error, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-foreground/80">{error.type}</span>
                        <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-sm">
                          {error.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <h4 className="font-medium text-foreground mb-3">Schema Type Distribution</h4>
                  <div className="space-y-4">
                    {complianceData.schemaTypeDistribution.map((type, index) => {
                      const total = type.compliant + type.nonCompliant;
                      const complianceRate = total > 0 ? (type.compliant / total) * 100 : 0;
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-foreground/80">{type.type}</span>
                            <span className="text-foreground/60">{formatPercentage(complianceRate)}</span>
                          </div>
                          <div className="w-full bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${complianceRate}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-foreground/60 mt-1">
                            <span>{type.compliant} compliant</span>
                            <span>{type.nonCompliant} non-compliant</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Page Compliance Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page URL</th>
                    <th className="text-left py-2 px-4">Schema Type</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Errors</th>
                    <th className="text-left py-2 px-4">Warnings</th>
                    <th className="text-left py-2 px-4">Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">
                        <a href={report.url} className="text-gold hover:underline">
                          {report.url}
                        </a>
                      </td>
                      <td className="py-3 px-4">{report.schemaType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(report.isValid)}`}>
                          {report.isValid ? 'Compliant' : 'Non-Compliant'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{report.errors.length}</td>
                      <td className="py-3 px-4">{report.warnings.length}</td>
                      <td className="py-3 px-4">
                        {new Date(report.timestamp).toLocaleDateString()}
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
            <h3 className="text-lg font-semibold mb-4">Schema Validation Errors</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">Property</th>
                    <th className="text-left py-2 px-4">Error Type</th>
                    <th className="text-left py-2 px-4">Message</th>
                    <th className="text-left py-2 px-4">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.flatMap(report => 
                    report.errors.map((error, errorIndex) => (
                      <tr key={`${report.id}-${errorIndex}`} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <a href={report.url} className="text-gold hover:underline">
                            {report.url}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{error.property}</td>
                        <td className="py-3 px-4">{error.type}</td>
                        <td className="py-3 px-4">{error.message}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            error.severity === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {error.severity}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Schema Type Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceData.schemaTypeDistribution.map((type, index) => {
                const total = type.compliant + type.nonCompliant;
                const complianceRate = total > 0 ? (type.compliant / total) * 100 : 0;
                
                return (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-foreground">{type.type}</h4>
                      <span className={`text-sm font-medium ${getComplianceColor(complianceRate)}`}>
                        {formatPercentage(complianceRate)}
                      </span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gold h-2 rounded-full" 
                        style={{ width: `${complianceRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/80">
                      <span>{type.compliant} compliant</span>
                      <span>{type.nonCompliant} non-compliant</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Compliance Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80">
                <div className="flex items-end h-full space-x-1">
                  {complianceData.reportsByDay.map((day, index) => {
                    const complianceRate = (day.compliant / day.total) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${complianceRate}%` }}
                        ></div>
                        <div className="text-xs text-foreground/60 mt-2">
                          {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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

export default SchemaComplianceDashboard;