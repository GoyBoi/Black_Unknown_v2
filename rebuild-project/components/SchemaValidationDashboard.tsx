// components/SchemaValidationDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  validateSchema,
  generateValidationReport,
  SchemaValidationResult,
  SchemaValidationError
} from '@/lib/schema-validation';

const SchemaValidationDashboard = () => {
  const [validationResults, setValidationResults] = useState<SchemaValidationResult[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'errors' | 'compliance' | 'trends'>('overview');
  const [filters, setFilters] = useState({
    status: 'all',
    errorType: 'all',
    pageType: 'all'
  });

  // Load schema validation data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock validation results
      const mockResults: SchemaValidationResult[] = [
        {
          id: 'result_1',
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
          ],
          timestamp: Date.now() - 3600000, // 1 hour ago
          validatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'result_2',
          url: '/about',
          schemaType: 'Organization',
          isValid: true,
          errors: [],
          warnings: [],
          timestamp: Date.now() - 7200000, // 2 hours ago
          validatedAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'result_3',
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
          warnings: [],
          timestamp: Date.now() - 10800000, // 3 hours ago
          validatedAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: 'result_4',
          url: '/shop',
          schemaType: 'CollectionPage',
          isValid: true,
          errors: [],
          warnings: [],
          timestamp: Date.now() - 14400000, // 4 hours ago
          validatedAt: new Date(Date.now() - 14400000).toISOString()
        },
        {
          id: 'result_5',
          url: '/contact',
          schemaType: 'ContactPage',
          isValid: false,
          errors: [
            {
              id: 'err_4',
              type: 'missing_property',
              property: 'contactPoint',
              message: 'Missing required contact information',
              severity: 'critical',
              suggestedFix: 'Add contactPoint with phone, email, or address'
            }
          ],
          warnings: [],
          timestamp: Date.now() - 18000000, // 5 hours ago
          validatedAt: new Date(Date.now() - 18000000).toISOString()
        }
      ];
      
      setValidationResults(mockResults);
      
      // Generate mock analytics
      const mockAnalytics = {
        totalValidations: 1240,
        compliantPages: 980,
        nonCompliantPages: 260,
        complianceRate: 79.0,
        criticalErrors: 15,
        highSeverityErrors: 42,
        mediumSeverityErrors: 85,
        lowSeverityErrors: 118,
        topErrorTypes: [
          { type: 'Missing required property', count: 85 },
          { type: 'Invalid date format', count: 42 },
          { type: 'Missing image property', count: 38 },
          { type: 'Incorrect @type value', count: 25 },
          { type: 'Missing price in Offer', count: 18 }
        ],
        schemaTypeDistribution: [
          { type: 'Product', compliant: 65, nonCompliant: 12 },
          { type: 'Organization', compliant: 22, nonCompliant: 3 },
          { type: 'Article', compliant: 8, nonCompliant: 5 },
          { type: 'BreadcrumbList', compliant: 15, nonCompliant: 7 }
        ],
        validationTrends: [
          { date: '2026-01-15', compliant: 85, nonCompliant: 15, total: 100 },
          { date: '2026-01-16', compliant: 82, nonCompliant: 18, total: 100 },
          { date: '2026-01-17', compliant: 88, nonCompliant: 12, total: 100 },
          { date: '2026-01-18', compliant: 90, nonCompliant: 10, total: 100 },
          { date: '2026-01-19', compliant: 87, nonCompliant: 13, total: 100 },
          { date: '2026-01-20', compliant: 92, nonCompliant: 8, total: 100 },
          { date: '2026-01-21', compliant: 95, nonCompliant: 5, total: 100 }
        ]
      };
      
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-foreground/60';
    }
  };

  // Get severity badge class
  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-foreground/10 text-foreground/60';
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
        <p>Unable to load schema validation data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Schema Validation Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and validate structured data compliance</p>
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
          <h3 className="text-foreground/60 text-sm">Total Validations</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalValidations)}</p>
          <p className="text-xs text-foreground/60">All time</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Compliance Rate</h3>
          <p className={`text-2xl font-bold ${
            analytics.complianceRate >= 90 ? 'text-green-500' : 
            analytics.complianceRate >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.complianceRate.toFixed(1)}%
          </p>
          <p className="text-xs text-foreground/60">Valid schemas</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Compliant Pages</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.compliantPages)}</p>
          <p className="text-xs text-foreground/60">Valid structured data</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Non-Compliant</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.nonCompliantPages)}</p>
          <p className="text-xs text-foreground/60">Need attention</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Critical Errors</h3>
          <p className="text-2xl font-bold text-red-500">{formatNumber(analytics.criticalErrors)}</p>
          <p className="text-xs text-foreground/60">Require immediate fix</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'pages', 'errors', 'compliance', 'trends'] as const).map(tab => (
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
                  {analytics.validationTrends.map((day: any, index: number) => {
                    const compliancePercentage = (day.compliant / day.total) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${compliancePercentage}%` }}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
                <div className="space-y-3">
                  {analytics.topErrorTypes.map((error: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground/80 truncate max-w-[70%]">{error.type}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(error.count)}</span>
                        <div className="w-24 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(error.count / analytics.topErrorTypes[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-4">Schema Type Distribution</h3>
                <div className="space-y-4">
                  {analytics.schemaTypeDistribution.map((type: any, index: number) => {
                    const total = type.compliant + type.nonCompliant;
                    const complianceRate = total > 0 ? (type.compliant / total) * 100 : 0;
                    
                    return (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-foreground/80">{type.type}</span>
                          <span className="text-foreground/60">{complianceRate.toFixed(1)}%</span>
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
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Page Validation Status</h3>
              <div className="flex space-x-3">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="valid">Valid</option>
                  <option value="invalid">Invalid</option>
                </select>
                <select
                  value={filters.pageType}
                  onChange={(e) => setFilters({...filters, pageType: e.target.value})}
                  className="bg-foreground/10 border border-foreground/20 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="product">Product</option>
                  <option value="organization">Organization</option>
                  <option value="article">Article</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Page URL</th>
                    <th className="text-left py-2 px-4">Schema Type</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Errors</th>
                    <th className="text-left py-2 px-4">Warnings</th>
                    <th className="text-left py-2 px-4">Last Validated</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults
                    .filter(result => {
                      const matchesStatus = filters.status === 'all' || 
                                          (filters.status === 'valid' && result.isValid) || 
                                          (filters.status === 'invalid' && !result.isValid);
                      const matchesType = filters.pageType === 'all' || result.schemaType.toLowerCase() === filters.pageType;
                      return matchesStatus && matchesType;
                    })
                    .map((result, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <a href={result.url} className="text-gold hover:underline truncate max-w-xs block">
                            {result.url}
                          </a>
                        </td>
                        <td className="py-3 px-4 capitalize">{result.schemaType}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            result.isValid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {result.isValid ? 'Valid' : 'Invalid'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{result.errors.length}</td>
                        <td className="py-3 px-4">{result.warnings.length}</td>
                        <td className="py-3 px-4">{new Date(result.timestamp).toLocaleDateString()}</td>
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
                    <th className="text-left py-2 px-4">Suggested Fix</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.flatMap(result => 
                    result.errors.map((error, errorIndex) => (
                      <tr key={`${result.id}-${errorIndex}`} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <a href={result.url} className="text-gold hover:underline">
                            {result.url}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{error.property}</td>
                        <td className="py-3 px-4 capitalize">{error.type}</td>
                        <td className="py-3 px-4">{error.message}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityBadgeClass(error.severity)}`}>
                            {error.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground/80">{error.suggestedFix}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Compliance Standards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { standard: 'Schema.org Product', compliance: 85, description: 'Product schema compliance' },
                { standard: 'Schema.org Organization', compliance: 92, description: 'Organization schema compliance' },
                { standard: 'Open Graph', compliance: 78, description: 'OG tags compliance' },
                { standard: 'Twitter Cards', compliance: 70, description: 'Twitter card compliance' },
                { standard: 'JSON-LD Format', compliance: 95, description: 'JSON-LD syntax compliance' },
                { standard: 'Rich Snippets', compliance: 82, description: 'Rich snippets eligibility' }
              ].map((standard, index) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{standard.standard}</h4>
                    <span className={`text-sm font-medium ${
                      standard.compliance >= 90 ? 'text-green-500' : 
                      standard.compliance >= 70 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {standard.compliance}%
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">{standard.description}</p>
                  <div className="w-full bg-foreground/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        standard.compliance >= 90 ? 'bg-green-500' : 
                        standard.compliance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${standard.compliance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Validation Trends</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="h-80">
                <div className="flex items-end h-full space-x-1">
                  {analytics.validationTrends.map((day: any, index: number) => {
                    const compliancePercentage = (day.compliant / day.total) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${compliancePercentage}%` }}
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

export default SchemaValidationDashboard;