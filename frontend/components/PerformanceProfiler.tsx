// components/PerformanceProfiler.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  initPerformanceProfiling, 
  captureMetric, 
  measureTask, 
  measureFunction, 
  getPerformanceProfile,
  sendPerformanceToService
} from '@/lib/performance-profiling';

interface PerformanceProfilerProps {
  sessionId: string;
  children: React.ReactNode;
}

const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({ sessionId, children }) => {
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize performance profiling
    const profile = initPerformanceProfiling(sessionId);
    setProfile(profile);
    setIsLoading(false);

    // Capture initial metrics
    captureMetric(sessionId, 'initial_render', Date.now(), 'timestamp');

    // Set up periodic metrics collection
    const interval = setInterval(() => {
      const currentProfile = getPerformanceProfile(sessionId);
      if (currentProfile) {
        setMetrics([...currentProfile.metrics]);
      }
    }, 5000); // Update every 5 seconds

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, [sessionId]);

  // Function to measure a specific task
  const runTaskWithMeasurement = (taskName: string, task: () => any) => {
    return measureTask(sessionId, taskName, task);
  };

  // Function to measure a function
  const measureFunctionWithProfiling = <T extends (...args: any[]) => any>(fn: T, name?: string) => {
    return measureFunction(sessionId, fn, name);
  };

  // Function to send performance data to external service
  const reportPerformance = async () => {
    try {
      await sendPerformanceToService(sessionId);
      alert('Performance data reported successfully!');
    } catch (error) {
      console.error('Error reporting performance data:', error);
      alert('Error reporting performance data');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Performance overlay that can be toggled */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={reportPerformance}
          className="bg-gold text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gold/90 transition-colors"
        >
          Report Performance
        </button>
      </div>

      {/* Children wrapped with profiler context */}
      {children}
    </div>
  );
};

export default PerformanceProfiler;

// Export utility functions for direct use
export { 
  initPerformanceProfiling, 
  captureMetric, 
  measureTask, 
  measureFunction, 
  getPerformanceProfile,
  sendPerformanceToService
} from '@/lib/performance-profiling';