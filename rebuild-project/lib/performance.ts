// lib/performance.ts
import { ReportHandler } from 'web-vitals';

export const sendToAnalytics = (metric: any) => {
  // Send metric to analytics endpoint
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id, // ID unique to current page load
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // Values must be integers
      non_interaction: true, // Use non-interaction event to avoid affecting bounce rate
    });
  }
};

export const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
      if (getCLS) getCLS(onPerfEntry);
      if (getFID) getFID(onPerfEntry);
      if (getFCP) getFCP(onPerfEntry);
      if (getLCP) getLCP(onPerfEntry);
      if (getTTFB) getTTFB(onPerfEntry);
    }).catch(err => {
      console.error('Error importing web-vitals:', err);
    });
  }
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (typeof PerformanceObserver !== 'undefined') {
    // Check if longtask is supported before observing
    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
    if (supportedEntryTypes.includes('longtask')) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log long tasks (>50ms) which may cause jank
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
          }
        });
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }

    // Check if largest-contentful-paint is supported before observing
    if (supportedEntryTypes.includes('largest-contentful-paint')) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP entry:', lastEntry);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
};

// Calculate performance metrics
export const getPerformanceMetrics = () => {
  if (typeof performance !== 'undefined') {
    const timing = performance.timing;
    return {
      // Page load time
      loadTime: timing.loadEventEnd - timing.navigationStart,
      // DNS lookup time
      dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
      // TCP connection time
      tcpTime: timing.connectEnd - timing.connectStart,
      // Time to first byte
      ttfb: timing.responseStart - timing.requestStart,
      // Dom loading time
      domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
    };
  }
  return null;
};