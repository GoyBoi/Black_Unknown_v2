// components/ErrorTrackingProvider.tsx
'use client';

import { useEffect } from 'react';
import { initErrorTracking } from '@/lib/error-tracking';

const ErrorTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize error tracking
    initErrorTracking();
  }, []);

  return <>{children}</>;
};

export default ErrorTrackingProvider;