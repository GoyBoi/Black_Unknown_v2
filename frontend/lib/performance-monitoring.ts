// lib/performance-monitoring.ts

// Define types for performance monitoring
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  pageUrl: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface PerformanceReport {
  id: string;
  timestamp: number;
  metrics: PerformanceMetric[];
  coreWebVitals: {
    lcp?: number; // Largest Contentful Paint
    cls?: number; // Cumulative Layout Shift
    fcp?: number; // First Contentful Paint
    fid?: number; // First Input Delay
    ttfb?: number; // Time to First Byte
    inp?: number; // Interaction to Next Paint (new metric)
  };
  pageUrl: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface PerformanceAnalytics {
  avgLcp: number;
  avgCls: number;
  avgFcp: number;
  avgFid: number;
  avgTtfb: number;
  avgInp: number;
  goodLcp: number; // Percentage of good LCP scores
  needsImprovementLcp: number;
  poorLcp: number;
  goodCls: number;
  needsImprovementCls: number;
  poorCls: number;
  goodFcp: number;
  needsImprovementFcp: number;
  poorFcp: number;
  totalReports: number;
  reportsByDay: { date: string; count: number; avgLcp: number; avgCls: number; avgFcp: number }[];
}

// In-memory storage for performance reports (in production, this would be in a database)
const performanceReports: PerformanceReport[] = [];

// Function to add a performance report
export const addPerformanceReport = (report: Omit<PerformanceReport, 'id' | 'timestamp'>): PerformanceReport => {
  const newReport: PerformanceReport = {
    ...report,
    id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  performanceReports.unshift(newReport);

  // Keep only the last 1000 reports to prevent memory issues
  if (performanceReports.length > 1000) {
    performanceReports.length = 1000;
  }

  return newReport;
};

// Function to get all performance reports
export const getPerformanceReports = (limit?: number): PerformanceReport[] => {
  return limit ? performanceReports.slice(0, limit) : [...performanceReports];
};

// Function to calculate performance analytics
export const calculatePerformanceAnalytics = (timeRange?: { start: number; end: number }): PerformanceAnalytics => {
  const reports = timeRange 
    ? performanceReports.filter(r => r.timestamp >= timeRange.start && r.timestamp <= timeRange.end)
    : [...performanceReports];

  if (reports.length === 0) {
    return {
      avgLcp: 0,
      avgCls: 0,
      avgFcp: 0,
      avgFid: 0,
      avgTtfb: 0,
      avgInp: 0,
      goodLcp: 0,
      needsImprovementLcp: 0,
      poorLcp: 0,
      goodCls: 0,
      needsImprovementCls: 0,
      poorCls: 0,
      goodFcp: 0,
      needsImprovementFcp: 0,
      poorFcp: 0,
      totalReports: 0,
      reportsByDay: []
    };
  }

  // Calculate averages
  const totalLcp = reports.reduce((sum, r) => sum + (r.coreWebVitals.lcp || 0), 0);
  const avgLcp = totalLcp / reports.filter(r => r.coreWebVitals.lcp !== undefined).length;
  
  const totalCls = reports.reduce((sum, r) => sum + (r.coreWebVitals.cls || 0), 0);
  const avgCls = totalCls / reports.filter(r => r.coreWebVitals.cls !== undefined).length;
  
  const totalFcp = reports.reduce((sum, r) => sum + (r.coreWebVitals.fcp || 0), 0);
  const avgFcp = totalFcp / reports.filter(r => r.coreWebVitals.fcp !== undefined).length;
  
  const totalFid = reports.reduce((sum, r) => sum + (r.coreWebVitals.fid || 0), 0);
  const avgFid = totalFid / reports.filter(r => r.coreWebVitals.fid !== undefined).length;
  
  const totalTtfb = reports.reduce((sum, r) => sum + (r.coreWebVitals.ttfb || 0), 0);
  const avgTtfb = totalTtfb / reports.filter(r => r.coreWebVitals.ttfb !== undefined).length;
  
  const totalInp = reports.reduce((sum, r) => sum + (r.coreWebVitals.inp || 0), 0);
  const avgInp = totalInp / reports.filter(r => r.coreWebVitals.inp !== undefined).length;

  // Calculate good/needs improvement/poor percentages for each metric
  // LCP thresholds: Good: <=2.5s, Needs Improvement: 2.5-4s, Poor: >4s
  const lcpGood = reports.filter(r => r.coreWebVitals.lcp !== undefined && r.coreWebVitals.lcp <= 2500).length;
  const lcpNeedsImprovement = reports.filter(r => 
    r.coreWebVitals.lcp !== undefined && 
    r.coreWebVitals.lcp > 2500 && 
    r.coreWebVitals.lcp <= 4000
  ).length;
  const lcpPoor = reports.filter(r => r.coreWebVitals.lcp !== undefined && r.coreWebVitals.lcp > 4000).length;
  
  // CLS thresholds: Good: <=0.1, Needs Improvement: 0.1-0.25, Poor: >0.25
  const clsGood = reports.filter(r => r.coreWebVitals.cls !== undefined && r.coreWebVitals.cls <= 0.1).length;
  const clsNeedsImprovement = reports.filter(r => 
    r.coreWebVitals.cls !== undefined && 
    r.coreWebVitals.cls > 0.1 && 
    r.coreWebVitals.cls <= 0.25
  ).length;
  const clsPoor = reports.filter(r => r.coreWebVitals.cls !== undefined && r.coreWebVitals.cls > 0.25).length;
  
  // FCP thresholds: Good: <=1.8s, Needs Improvement: 1.8-3s, Poor: >3s
  const fcpGood = reports.filter(r => r.coreWebVitals.fcp !== undefined && r.coreWebVitals.fcp <= 1800).length;
  const fcpNeedsImprovement = reports.filter(r => 
    r.coreWebVitals.fcp !== undefined && 
    r.coreWebVitals.fcp > 1800 && 
    r.coreWebVitals.fcp <= 3000
  ).length;
  const fcpPoor = reports.filter(r => r.coreWebVitals.fcp !== undefined && r.coreWebVitals.fcp > 3000).length;

  // Calculate reports by day for trend analysis
  const reportsByDayMap = new Map<string, { count: number; totalLcp: number; totalCls: number; totalFcp: number; reportCount: number }>();
  
  reports.forEach(report => {
    const date = new Date(report.timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    const existing = reportsByDayMap.get(date) || { count: 0, totalLcp: 0, totalCls: 0, totalFcp: 0, reportCount: 0 };
    
    existing.count++;
    existing.reportCount++;
    
    if (report.coreWebVitals.lcp !== undefined) {
      existing.totalLcp += report.coreWebVitals.lcp;
    }
    
    if (report.coreWebVitals.cls !== undefined) {
      existing.totalCls += report.coreWebVitals.cls;
    }
    
    if (report.coreWebVitals.fcp !== undefined) {
      existing.totalFcp += report.coreWebVitals.fcp;
    }
    
    reportsByDayMap.set(date, existing);
  });
  
  const reportsByDay = Array.from(reportsByDayMap.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      avgLcp: data.totalLcp / data.reportCount,
      avgCls: data.totalCls / data.reportCount,
      avgFcp: data.totalFcp / data.reportCount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    avgLcp,
    avgCls,
    avgFcp,
    avgFid,
    avgTtfb,
    avgInp,
    goodLcp: (lcpGood / reports.length) * 100,
    needsImprovementLcp: (lcpNeedsImprovement / reports.length) * 100,
    poorLcp: (lcpPoor / reports.length) * 100,
    goodCls: (clsGood / reports.length) * 100,
    needsImprovementCls: (clsNeedsImprovement / reports.length) * 100,
    poorCls: (clsPoor / reports.length) * 100,
    goodFcp: (fcpGood / reports.length) * 100,
    needsImprovementFcp: (fcpNeedsImprovement / reports.length) * 100,
    poorFcp: (fcpPoor / reports.length) * 100,
    totalReports: reports.length,
    reportsByDay
  };
};

// Function to measure performance of a specific task
export const measurePerformance = async <T>(
  task: () => Promise<T> | T, 
  name: string,
  pageUrl: string = typeof window !== 'undefined' ? window.location.href : 'server'
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await Promise.resolve(task());
  const end = performance.now();
  
  // Add to metrics
  const metric: PerformanceMetric = {
    id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    value: end - start,
    unit: 'ms',
    timestamp: Date.now(),
    pageUrl,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    connectionType: typeof navigator !== 'undefined' && (navigator as any).connection 
      ? (navigator as any).connection.effectiveType 
      : undefined,
    deviceMemory: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined,
    hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined
  };
  
  // In a real implementation, we would store this metric
  // For now, we'll just return the result and duration
  return { result, duration: end - start };
};

// Function to collect Core Web Vitals
export const collectCoreWebVitals = (): Promise<PerformanceReport> => {
  return new Promise((resolve) => {
    // Use the Web Vitals library to measure Core Web Vitals
    // In a real implementation, we would use the web-vitals library
    // For this example, we'll simulate the collection
    
    // Simulate collecting metrics after the page has loaded
    setTimeout(() => {
      const simulatedMetrics = {
        lcp: Math.floor(Math.random() * 3000) + 500, // 500-3500ms
        cls: Math.random() * 0.3, // 0-0.3
        fcp: Math.floor(Math.random() * 2000) + 300, // 300-2300ms
        fid: Math.floor(Math.random() * 300) + 50, // 50-350ms
        ttfb: Math.floor(Math.random() * 500) + 50, // 50-550ms
        inp: Math.floor(Math.random() * 500) + 100 // 100-600ms
      };
      
      const report: PerformanceReport = {
        id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        metrics: [],
        coreWebVitals: simulatedMetrics,
        pageUrl: typeof window !== 'undefined' ? window.location.href : 'server',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        connectionType: typeof navigator !== 'undefined' && (navigator as any).connection 
          ? (navigator as any).connection.effectiveType 
          : undefined,
        deviceMemory: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined,
        hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined
      };
      
      resolve(report);
    }, 1000); // Simulate delay for metrics collection
  });
};

// Function to get performance recommendations based on metrics
export const getPerformanceRecommendations = (analytics: PerformanceAnalytics): string[] => {
  const recommendations: string[] = [];
  
  // LCP recommendations
  if (analytics.avgLcp > 2500) {
    recommendations.push('LCP is too high (>2.5s). Consider optimizing largest contentful paint by optimizing images, deferring non-critical JavaScript, or using a CDN.');
  }
  
  // CLS recommendations
  if (analytics.avgCls > 0.1) {
    recommendations.push('CLS is too high (>0.1). Prevent unexpected layout shifts by reserving space for images/video, avoiding inserting content above existing elements, and using font-display: swap.');
  }
  
  // FCP recommendations
  if (analytics.avgFcp > 1800) {
    recommendations.push('FCP is too high (>1.8s). Optimize first contentful paint by reducing render-blocking resources, optimizing CSS delivery, and improving server response time.');
  }
  
  // FID recommendations
  if (analytics.avgFid > 100) {
    recommendations.push('FID is too high (>100ms). Reduce main thread work by breaking up long tasks, optimizing JavaScript execution, and reducing unused code.');
  }
  
  // TTFB recommendations
  if (analytics.avgTtfb > 200) {
    recommendations.push('TTFB is too high (>200ms). Optimize server response time by using a CDN, optimizing server infrastructure, or enabling caching.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Performance metrics are looking good! Continue monitoring to maintain optimal performance.');
  }
  
  return recommendations;
};

// Function to generate performance report summary
export const generatePerformanceReport = (analytics: PerformanceAnalytics): string => {
  return `
Performance Report Summary:
- Total Reports: ${analytics.totalReports}
- Average LCP: ${analytics.avgLcp.toFixed(0)}ms (${analytics.goodLcp.toFixed(1)}% good)
- Average CLS: ${analytics.avgCls.toFixed(3)} (${analytics.goodCls.toFixed(1)}% good)
- Average FCP: ${analytics.avgFcp.toFixed(0)}ms (${analytics.goodFcp.toFixed(1)}% good)
- Average FID: ${analytics.avgFid.toFixed(0)}ms
- Average TTFB: ${analytics.avgTtfb.toFixed(0)}ms
  `;
};