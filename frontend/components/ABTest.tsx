// components/ABTest.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { assignUserToVariant, getActiveExperiments, trackConversion, getUserVariant } from '@/lib/ab-testing';

interface ABTestContextType {
  getVariant: (experimentId: string) => string | null;
  trackEvent: (experimentId: string, eventName: string) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

// Generate a unique user ID for the session
const generateUserId = (): string => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    let userId = localStorage.getItem('ab-test-user-id');
    if (!userId) {
      // Generate a new UUID-like ID
      userId = 'user-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('ab-test-user-id', userId);
    }
    return userId;
  }
  return 'server';
};

export const ABTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId] = useState<string>(() => generateUserId());

  const getVariant = (experimentId: string): string | null => {
    const experiments = getActiveExperiments();
    const experiment = experiments.find(exp => exp.id === experimentId);
    
    if (!experiment || !experiment.isActive) {
      return null;
    }

    // Check if user is already assigned to this experiment
    const assignedVariant = getUserVariant(userId, experimentId);
    if (assignedVariant) {
      return assignedVariant;
    }

    // Assign user to a variant
    return assignUserToVariant(userId, experiment);
  };

  const trackEvent = (experimentId: string, eventName: string) => {
    const variantId = getVariant(experimentId);
    if (variantId) {
      trackConversion(userId, experimentId, variantId, eventName);
    }
  };

  return (
    <ABTestContext.Provider value={{ getVariant, trackEvent }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = (): ABTestContextType => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

interface ABTestProps {
  experimentId: string;
  children: React.ReactNode;
}

// Component to wrap content that should be tested
export const ABTest: React.FC<ABTestProps> = ({ experimentId, children }) => {
  const { getVariant } = useABTest();
  const variant = getVariant(experimentId);

  // If no variant is assigned, show nothing or the control
  if (!variant) {
    return null;
  }

  // Render children with variant information
  return <div data-experiment={experimentId} data-variant={variant}>{children}</div>;
};

interface ABTestVariantProps {
  experimentId: string;
  variantId: string;
  children: React.ReactNode;
}

// Component to define specific variants
export const ABTestVariant: React.FC<ABTestVariantProps> = ({ experimentId, variantId, children }) => {
  const { getVariant } = useABTest();
  const currentVariant = getVariant(experimentId);

  // Only render if this variant is the one assigned to the user
  if (currentVariant === variantId) {
    return <>{children}</>;
  }

  return null;
};