// components/PerformanceObserver.tsx
'use client';

import { useEffect } from 'react';
import { reportWebVitals, sendToAnalytics } from '@/lib/performance';

const PerformanceObserver = () => {
  useEffect(() => {
    // Report web vitals
    reportWebVitals(sendToAnalytics);

    // Log performance metrics periodically
    const interval = setInterval(() => {
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        
        // Send performance data to analytics
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
          // In a real implementation, you would send this data to your analytics service
          console.log('Navigation Timing:', {
            dnsTime: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            connectTime: navEntry.connectEnd - navEntry.connectStart,
            responseTime: navEntry.responseEnd - navEntry.responseStart,
            domLoadTime: navEntry.domContentLoadedEventEnd - navEntry.startTime,
            pageLoadTime: navEntry.loadEventEnd - navEntry.startTime,
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default PerformanceObserver;