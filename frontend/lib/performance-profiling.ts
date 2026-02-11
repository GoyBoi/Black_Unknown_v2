// lib/performance-profiling.ts

// Define types for performance metrics
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  pageUrl: string;
  userAgent: string;
  navigationType: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export interface PerformanceProfile {
  sessionId: string;
  startTime: number;
  endTime?: number;
  metrics: PerformanceMetric[];
  navigationEntries: PerformanceNavigationTiming[];
  resourceEntries: PerformanceResourceTiming[];
  paintTimings: PerformancePaintTiming[];
  longTasks: PerformanceEntry[];
  lcp?: number;
  fcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
}

// In-memory storage for performance profiles (in production, this would be sent to an external service)
const performanceProfiles: Map<string, PerformanceProfile> = new Map();

// Function to start performance profiling
export const startPerformanceProfiling = (sessionId: string): PerformanceProfile => {
  const profile: PerformanceProfile = {
    sessionId,
    startTime: Date.now(),
    metrics: [],
    navigationEntries: [],
    resourceEntries: [],
    paintTimings: [],
    longTasks: [],
  };

  // Capture initial performance entries
  if (typeof performance !== 'undefined') {
    // Get navigation entries
    const navEntries = performance.getEntriesByType('navigation');
    profile.navigationEntries = navEntries as PerformanceNavigationTiming[];

    // Get resource entries
    const resourceEntries = performance.getEntriesByType('resource');
    profile.resourceEntries = resourceEntries as PerformanceResourceTiming[];

    // Get paint timings
    const paintEntries = performance.getEntriesByType('paint');
    profile.paintTimings = paintEntries as PerformancePaintTiming[];

    // Calculate core web vitals if available
    const navEntry = navEntries[0] as PerformanceNavigationTiming;
    if (navEntry) {
      profile.ttfb = navEntry.responseStart - navEntry.requestStart;
    }
  }

  performanceProfiles.set(sessionId, profile);
  return profile;
};

// Function to capture a specific metric
export const captureMetric = (sessionId: string, name: string, value: number, unit: string): void => {
  const profile = performanceProfiles.get(sessionId);
  if (!profile) {
    console.warn(`Performance profile for session ${sessionId} not found`);
    return;
  }

  const metric: PerformanceMetric = {
    id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    value,
    unit,
    timestamp: Date.now(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    navigationType: typeof performance !== 'undefined' && performance.getEntriesByType('navigation').length > 0
      ? (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type
      : 'navigate',
    connectionType: typeof navigator !== 'undefined' && (navigator as any).connection
      ? (navigator as any).connection.effectiveType
      : undefined,
    deviceMemory: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined,
    hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined,
  };

  profile.metrics.push(metric);
  performanceProfiles.set(sessionId, profile);
};

// Function to measure a specific task
export const measureTask = (sessionId: string, taskName: string, task: () => any): any => {
  const start = performance.now();
  const result = task();
  const end = performance.now();
  
  captureMetric(sessionId, `task_${taskName}_duration`, end - start, 'ms');
  
  return result;
};

// Function to measure function execution time
export const measureFunction = <T extends (...args: any[]) => any>(
  sessionId: string,
  fn: T,
  name?: string
): T => {
  return function (...args: Parameters<T>): ReturnType<T> {
    const functionName = name || fn.name || 'anonymous';
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    
    captureMetric(sessionId, `function_${functionName}_execution_time`, end - start, 'ms');
    
    return result;
  } as T;
};

// Function to get performance profile
export const getPerformanceProfile = (sessionId: string): PerformanceProfile | null => {
  return performanceProfiles.get(sessionId) || null;
};

// Function to stop performance profiling
export const stopPerformanceProfiling = (sessionId: string): PerformanceProfile | null => {
  const profile = performanceProfiles.get(sessionId);
  if (!profile) {
    return null;
  }

  profile.endTime = Date.now();
  return profile;
};

// Function to calculate Core Web Vitals
export const calculateCoreWebVitals = (sessionId: string): {
  lcp?: number;
  fcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
} => {
  const profile = performanceProfiles.get(sessionId);
  if (!profile) {
    return {};
  }

  // Calculate Largest Contentful Paint (LCP)
  if (typeof PerformanceObserver !== 'undefined') {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      captureMetric(sessionId, 'largest_contentful_paint', lastEntry.startTime, 'ms');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Calculate Cumulative Layout Shift (CLS)
  let cls = 0;
  if (typeof PerformanceObserver !== 'undefined') {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry instanceof LayoutShift) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
      }
      captureMetric(sessionId, 'cumulative_layout_shift', cls, '');
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Calculate First Input Delay (FID) - captured when user interacts
  if (typeof PerformanceObserver !== 'undefined') {
    const fidObserver = new PerformanceObserver((list) => {
      const firstInput = list.getEntries()[0] as PerformanceEventTiming;
      if (firstInput) {
        captureMetric(sessionId, 'first_input_delay', firstInput.processingStart - firstInput.startTime, 'ms');
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  return {
    lcp: profile.lcp,
    fcp: profile.fcp,
    cls,
    fid: profile.fid,
    ttfb: profile.ttfb
  };
};

// Function to simulate sending performance data to external service
export const sendPerformanceToService = async (sessionId: string) => {
  const profile = performanceProfiles.get(sessionId);
  if (!profile) {
    throw new Error(`Performance profile with ID ${sessionId} not found`);
  }

  // In a real implementation, this would send the performance data to an external service
  console.log(`Sending performance profile ${sessionId} to external service:`, {
    sessionId: profile.sessionId,
    startTime: profile.startTime,
    endTime: profile.endTime,
    metricCount: profile.metrics.length,
    duration: (profile.endTime || Date.now()) - profile.startTime
  });
  
  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to initialize performance profiling
export const initPerformanceProfiling = (sessionId: string): PerformanceProfile => {
  const profile = startPerformanceProfiling(sessionId);

  // Monitor long tasks
  if (typeof PerformanceObserver !== 'undefined') {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        profile.longTasks.push(entry);
        captureMetric(sessionId, 'long_task_duration', entry.duration, 'ms');
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }

  return profile;
};