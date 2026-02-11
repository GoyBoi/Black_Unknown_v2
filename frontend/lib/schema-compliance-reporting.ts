// lib/schema-compliance-reporting.ts

// Define types for schema compliance reporting
export interface SchemaComplianceReport {
  id: string;
  timestamp: number;
  reportDate: string;
  totalPages: number;
  compliantPages: number;
  nonCompliantPages: number;
  complianceRate: number; // Percentage
  errors: SchemaValidationError[];
  warnings: SchemaWarning[];
  schemaTypes: {
    type: string;
    total: number;
    compliant: number;
    nonCompliant: number;
  }[];
  topIssues: {
    issue: string;
    occurrences: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
  recommendations: string[];
  performanceMetrics: {
    validationTime: number; // in milliseconds
    pagesPerSecond: number;
  };
}

export interface SchemaValidationError {
  id: string;
  pageUrl: string;
  schemaType: string;
  property: string;
  errorType: 'missing_required' | 'invalid_format' | 'incorrect_type' | 'deprecated_property' | 'malformed_json';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedFix?: string;
}

export interface SchemaWarning {
  id: string;
  pageUrl: string;
  schemaType: string;
  property: string;
  warningType: 'recommended_missing' | 'deprecated_usage' | 'best_practice';
  message: string;
  suggestedFix?: string;
}

export interface SchemaComplianceConfig {
  enabled: boolean;
  notificationChannels: ('email' | 'dashboard' | 'slack' | 'discord' | 'webhook')[];
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  thresholds: {
    metric: string;
    threshold: number; // percentage
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export interface SchemaComplianceAnalytics {
  overallCompliance: number;
  totalErrors: number;
  totalWarnings: number;
  complianceTrend: {
    date: string;
    complianceRate: number;
  }[];
  topErrorTypes: {
    type: string;
    count: number;
  }[];
  schemaTypeCompliance: {
    type: string;
    complianceRate: number;
    total: number;
  }[];
  pagesWithIssues: {
    url: string;
    issues: number;
    complianceRate: number;
  }[];
  monthlyReports: SchemaComplianceReport[];
  errorFrequencyByPage: {
    page: string;
    errorCount: number;
    errorRate: number; // errors per page
  }[];
  validationPerformance: {
    avgValidationTime: number; // in milliseconds
    pagesPerSecond: number;
  };
  improvementSuggestions: string[];
  schemaCoverage: {
    type: string;
    coverage: number; // percentage of pages with this schema type
  }[];
}

// In-memory storage for schema compliance reports (in production, this would be in a database)
const schemaComplianceReports: SchemaComplianceReport[] = [];
const schemaComplianceConfig: SchemaComplianceConfig = {
  enabled: true,
  notificationChannels: ['dashboard'],
  reportFrequency: 'weekly',
  thresholds: [
    { metric: 'overall_compliance', threshold: 90, severity: 'high' }, // 90% compliance threshold
    { metric: 'critical_errors', threshold: 5, severity: 'critical' }, // Max 5 critical errors
    { metric: 'high_severity_errors', threshold: 20, severity: 'high' }, // Max 20 high severity errors
  ]
};

// Function to add a schema compliance report
export const addSchemaComplianceReport = (report: Omit<SchemaComplianceReport, 'id' | 'timestamp' | 'reportDate'>): SchemaComplianceReport => {
  const newReport: SchemaComplianceReport = {
    ...report,
    id: `schema_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    reportDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  schemaComplianceReports.unshift(newReport);

  // Check if any thresholds are exceeded
  checkSchemaComplianceThresholds(newReport);

  // Keep only the last 50 reports to prevent memory issues
  if (schemaComplianceReports.length > 50) {
    schemaComplianceReports.length = 50;
  }

  return newReport;
};

// Function to check if a report exceeds any thresholds
const checkSchemaComplianceThresholds = (report: SchemaComplianceReport) => {
  if (!schemaComplianceConfig.enabled) return;

  // Check overall compliance threshold
  const complianceThreshold = schemaComplianceConfig.thresholds.find(t => t.metric === 'overall_compliance');
  if (complianceThreshold && report.complianceRate < complianceThreshold.threshold) {
    // Create an alert for low compliance
    console.log(`Schema compliance below threshold: ${report.complianceRate}% < ${complianceThreshold.threshold}%`);
    // In a real implementation, this would trigger an alert
  }

  // Check critical errors threshold
  const criticalThreshold = schemaComplianceConfig.thresholds.find(t => t.metric === 'critical_errors');
  const criticalErrors = report.errors.filter(e => e.severity === 'critical').length;
  if (criticalThreshold && criticalErrors > criticalThreshold.threshold) {
    // Create an alert for too many critical errors
    console.log(`Too many critical errors: ${criticalErrors} > ${criticalThreshold.threshold}`);
    // In a real implementation, this would trigger an alert
  }

  // Check high severity errors threshold
  const highThreshold = schemaComplianceConfig.thresholds.find(t => t.metric === 'high_severity_errors');
  const highErrors = report.errors.filter(e => e.severity === 'high').length;
  if (highThreshold && highErrors > highThreshold.threshold) {
    // Create an alert for too many high severity errors
    console.log(`Too many high severity errors: ${highErrors} > ${highThreshold.threshold}`);
    // In a real implementation, this would trigger an alert
  }
};

// Function to calculate schema compliance analytics
export const calculateSchemaComplianceAnalytics = (timeRange?: { start: number; end: number }): SchemaComplianceAnalytics => {
  const reports = timeRange 
    ? schemaComplianceReports.filter(r => r.timestamp >= timeRange.start && r.timestamp <= timeRange.end)
    : [...schemaComplianceReports];

  if (reports.length === 0) {
    return {
      overallCompliance: 0,
      totalErrors: 0,
      totalWarnings: 0,
      complianceTrend: [],
      topErrorTypes: [],
      schemaTypeCompliance: [],
      pagesWithIssues: [],
      monthlyReports: [],
      errorFrequencyByPage: [],
      validationPerformance: {
        avgValidationTime: 0,
        pagesPerSecond: 0
      },
      improvementSuggestions: [],
      schemaCoverage: []
    };
  }

  // Calculate overall compliance
  const totalTotalPages = reports.reduce((sum, report) => sum + report.totalPages, 0);
  const totalCompliantPages = reports.reduce((sum, report) => sum + report.compliantPages, 0);
  const overallCompliance = totalTotalPages > 0 ? (totalCompliantPages / totalTotalPages) * 100 : 0;

  // Calculate total errors and warnings
  const totalErrors = reports.reduce((sum, report) => sum + report.errors.length, 0);
  const totalWarnings = reports.reduce((sum, report) => sum + report.warnings.length, 0);

  // Calculate compliance trend
  const complianceTrend = reports
    .map(report => ({
      date: report.reportDate,
      complianceRate: (report.compliantPages / report.totalPages) * 100
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate top error types
  const errorTypeCount = new Map<string, number>();
  reports.forEach(report => {
    report.errors.forEach(error => {
      const current = errorTypeCount.get(error.errorType) || 0;
      errorTypeCount.set(error.errorType, current + 1);
    });
  });

  const topErrorTypes = Array.from(errorTypeCount.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate schema type compliance
  const schemaTypeMap = new Map<string, { total: number; compliant: number; nonCompliant: number }>();
  reports.forEach(report => {
    report.schemaTypes.forEach(schemaType => {
      const current = schemaTypeMap.get(schemaType.type) || { total: 0, compliant: 0, nonCompliant: 0 };
      current.total += schemaType.total;
      current.compliant += schemaType.compliant;
      current.nonCompliant += schemaType.nonCompliant;
      schemaTypeMap.set(schemaType.type, current);
    });
  });

  const schemaTypeCompliance = Array.from(schemaTypeMap.entries())
    .map(([type, data]) => ({
      type,
      complianceRate: data.total > 0 ? (data.compliant / data.total) * 100 : 0,
      total: data.total
    }))
    .sort((a, b) => b.complianceRate - a.complianceRate);

  // Calculate pages with issues
  const pagesWithIssuesMap = new Map<string, number>();
  reports.forEach(report => {
    report.errors.forEach(error => {
      const current = pagesWithIssuesMap.get(error.pageUrl) || 0;
      pagesWithIssuesMap.set(error.pageUrl, current + 1);
    });
  });

  const pagesWithIssues = Array.from(pagesWithIssuesMap.entries())
    .map(([url, issues]) => ({
      url,
      issues,
      complianceRate: 0 // Would be calculated based on total schema compliance for the page
    }))
    .sort((a, b) => b.issues - a.issues)
    .slice(0, 10);

  // Calculate error frequency by page
  const errorFrequencyByPage = Array.from(pagesWithIssuesMap.entries())
    .map(([page, errorCount]) => ({
      page,
      errorCount,
      errorRate: errorCount // Would be calculated as errors per page view in a real implementation
    }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 10);

  // Calculate validation performance
  const totalValidationTime = reports.reduce((sum, report) => sum + report.performanceMetrics.validationTime, 0);
  const totalPagesValidated = reports.reduce((sum, report) => sum + report.totalPages, 0);
  const avgValidationTime = reports.length > 0 ? totalValidationTime / reports.length : 0;
  const pagesPerSecond = totalValidationTime > 0 ? totalPagesValidated / (totalValidationTime / 1000) : 0;

  // Calculate schema coverage
  const schemaCoverageMap = new Map<string, number>();
  reports.forEach(report => {
    report.schemaTypes.forEach(schemaType => {
      const current = schemaCoverageMap.get(schemaType.type) || 0;
      schemaCoverageMap.set(schemaType.type, current + schemaType.total);
    });
  });

  const schemaCoverage = Array.from(schemaCoverageMap.entries())
    .map(([type, total]) => ({
      type,
      coverage: (total / totalTotalPages) * 100
    }))
    .sort((a, b) => b.coverage - a.coverage);

  // Generate improvement suggestions
  const improvementSuggestions: string[] = [];
  
  if (overallCompliance < 80) {
    improvementSuggestions.push('Focus on resolving critical schema errors to improve overall compliance');
  }
  
  if (topErrorTypes.length > 0) {
    improvementSuggestions.push(`Address the most common error type: ${topErrorTypes[0].type}`);
  }
  
  if (schemaTypeCompliance.length > 0) {
    const lowestCompliance = schemaTypeCompliance[schemaTypeCompliance.length - 1];
    if (lowestCompliance.complianceRate < 50) {
      improvementSuggestions.push(`Improve compliance for ${lowestCompliance.type} schema type`);
    }
  }

  return {
    overallCompliance,
    totalErrors,
    totalWarnings,
    complianceTrend,
    topErrorTypes,
    schemaTypeCompliance,
    pagesWithIssues,
    monthlyReports: reports,
    errorFrequencyByPage,
    validationPerformance: {
      avgValidationTime,
      pagesPerSecond
    },
    improvementSuggestions,
    schemaCoverage
  };
};

// Function to get schema compliance reports
export const getSchemaComplianceReports = (limit?: number, dateRange?: { start: string; end: string }): SchemaComplianceReport[] => {
  let reports = [...schemaComplianceReports];

  // Apply date range filter if provided
  if (dateRange) {
    reports = reports.filter(report => 
      report.reportDate >= dateRange.start && report.reportDate <= dateRange.end
    );
  }

  // Sort by timestamp (newest first)
  reports.sort((a, b) => b.timestamp - a.timestamp);

  return limit ? reports.slice(0, limit) : reports;
};

// Function to get schema compliance report by ID
export const getSchemaComplianceReportById = (id: string): SchemaComplianceReport | undefined => {
  return schemaComplianceReports.find(report => report.id === id);
};

// Function to update schema compliance configuration
export const updateSchemaComplianceConfig = (newConfig: Partial<SchemaComplianceConfig>) => {
  Object.assign(schemaComplianceConfig, newConfig);
};

// Function to get current schema compliance configuration
export const getSchemaComplianceConfig = (): SchemaComplianceConfig => {
  return { ...schemaComplianceConfig };
};

// Function to format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return num.toFixed(2) + '%';
};

// Function to format timestamp to readable date
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Function to get severity color
export const getSeverityColor = (severity: string): string => {
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

// Function to get severity badge class
export const getSeverityBadgeClass = (severity: string): string => {
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

// Function to generate mock schema compliance data for demo purposes
export const generateMockSchemaComplianceData = () => {
  // Clear existing reports
  schemaComplianceReports.length = 0;
  
  // Generate mock schema compliance reports
  for (let i = 0; i < 30; i++) {
    const now = Date.now();
    const timestamp = now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Within last 30 days
    const date = new Date(timestamp).toISOString().split('T')[0];
    
    const totalPages = Math.floor(Math.random() * 100) + 50; // 50-150 pages
    const compliantPages = Math.floor(totalPages * (0.6 + Math.random() * 0.35)); // 60-95% compliance
    const nonCompliantPages = totalPages - compliantPages;
    const complianceRate = (compliantPages / totalPages) * 100;
    
    // Generate mock errors
    const errors: SchemaValidationError[] = [];
    const errorCount = Math.floor(Math.random() * 20) + 5; // 5-25 errors
    
    for (let j = 0; j < errorCount; j++) {
      const errorTypes: SchemaValidationError['errorType'][] = [
        'missing_required',
        'invalid_format',
        'incorrect_type',
        'deprecated_property',
        'malformed_json'
      ];
      const severities: SchemaValidationError['severity'][] = [
        'low', 'medium', 'high', 'critical'
      ];
      
      errors.push({
        id: `err_${i}_${j}`,
        pageUrl: [
          '/', 
          '/product/123', 
          '/product/456', 
          '/about', 
          '/contact'
        ][Math.floor(Math.random() * 5)],
        schemaType: ['Product', 'Organization', 'Article', 'BreadcrumbList'][Math.floor(Math.random() * 4)],
        property: [
          'name', 'image', 'description', 'offers', 'url', 'logo', 'address'
        ][Math.floor(Math.random() * 7)],
        errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
        message: [
          'Missing required property',
          'Invalid date format',
          'Incorrect value type',
          'Deprecated property used',
          'Malformed JSON-LD'
        ][Math.floor(Math.random() * 5)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        suggestedFix: 'Add the missing property with a valid value'
      });
    }
    
    // Generate mock warnings
    const warnings: SchemaWarning[] = [];
    const warningCount = Math.floor(Math.random() * 30) + 10; // 10-40 warnings
    
    for (let j = 0; j < warningCount; j++) {
      const warningTypes: SchemaWarning['warningType'][] = [
        'recommended_missing',
        'deprecated_usage',
        'best_practice'
      ];
      
      warnings.push({
        id: `warn_${i}_${j}`,
        pageUrl: [
          '/', 
          '/product/123', 
          '/product/456', 
          '/about', 
          '/contact'
        ][Math.floor(Math.random() * 5)],
        schemaType: ['Product', 'Organization', 'Article', 'BreadcrumbList'][Math.floor(Math.random() * 4)],
        property: [
          'gtin', 'mpn', 'sku', 'brand', 'category', 'logo', 'address'
        ][Math.floor(Math.random() * 7)],
        warningType: warningTypes[Math.floor(Math.random() * warningTypes.length)],
        message: [
          'Recommended property missing',
          'Best practice not followed',
          'Property could improve SEO'
        ][Math.floor(Math.random() * 3)],
        suggestedFix: 'Add the recommended property to improve SEO'
      });
    }
    
    // Generate mock schema types
    const schemaTypes = [
      { type: 'Product', total: Math.floor(totalPages * 0.4), compliant: Math.floor(compliantPages * 0.4), nonCompliant: Math.floor(nonCompliantPages * 0.4) },
      { type: 'Organization', total: Math.floor(totalPages * 0.3), compliant: Math.floor(compliantPages * 0.3), nonCompliant: Math.floor(nonCompliantPages * 0.3) },
      { type: 'Article', total: Math.floor(totalPages * 0.2), compliant: Math.floor(compliantPages * 0.2), nonCompliant: Math.floor(nonCompliantPages * 0.2) },
      { type: 'BreadcrumbList', total: Math.floor(totalPages * 0.1), compliant: Math.floor(compliantPages * 0.1), nonCompliant: Math.floor(nonCompliantPages * 0.1) }
    ];
    
    // Generate mock top issues
    const topIssues = [
      { issue: 'Missing required property: name', occurrences: 12, severity: 'high' as const },
      { issue: 'Invalid date format', occurrences: 8, severity: 'medium' as const },
      { issue: 'Missing image property', occurrences: 7, severity: 'medium' as const },
      { issue: 'Incorrect @type value', occurrences: 5, severity: 'high' as const },
      { issue: 'Missing price in Offer', occurrences: 4, severity: 'critical' as const }
    ];
    
    const report: SchemaComplianceReport = {
      id: `report_${i}`,
      timestamp,
      reportDate: date,
      totalPages,
      compliantPages,
      nonCompliantPages,
      complianceRate,
      errors,
      warnings,
      schemaTypes,
      topIssues,
      recommendations: [
        'Implement schema validation in your CI/CD pipeline',
        'Add missing required properties to non-compliant pages',
        'Consider using a schema validation library',
        'Train content editors on schema requirements'
      ],
      performanceMetrics: {
        validationTime: Math.floor(Math.random() * 5000) + 1000, // 1-6 seconds
        pagesPerSecond: Math.floor(Math.random() * 20) + 10 // 10-30 pages/sec
      }
    };
    
    schemaComplianceReports.push(report);
  }
  
  // Sort reports by date (newest first)
  schemaComplianceReports.sort((a, b) => b.timestamp - a.timestamp);
};