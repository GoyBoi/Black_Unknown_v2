// lib/ab-testing.ts

// Define experiment types
export interface Experiment {
  id: string;
  name: string;
  variants: Variant[];
  trafficAllocation: number; // Percentage of traffic (0-100)
  isActive: boolean;
}

export interface Variant {
  id: string;
  name: string;
  weight: number; // Weight for randomization (should sum to 100 with other variants)
}

export interface UserExperimentAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  timestamp: number;
}

// In-memory storage for assignments (in production, this would be a database)
const userAssignments: UserExperimentAssignment[] = [];

// Function to assign a user to a variant
export const assignUserToVariant = (userId: string, experiment: Experiment): string => {
  // Check if user is already assigned to this experiment
  const existingAssignment = userAssignments.find(
    assignment => assignment.userId === userId && assignment.experimentId === experiment.id
  );

  if (existingAssignment) {
    return existingAssignment.variantId;
  }

  // Check if user should be included in this experiment based on traffic allocation
  const shouldInclude = Math.random() * 100 < experiment.trafficAllocation;
  if (!shouldInclude) {
    // Return control variant or null
    return experiment.variants[0].id;
  }

  // Randomly assign user to a variant based on weights
  const totalWeight = experiment.variants.reduce((sum, variant) => sum + variant.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const variant of experiment.variants) {
    if (random < variant.weight) {
      const assignment: UserExperimentAssignment = {
        userId,
        experimentId: experiment.id,
        variantId: variant.id,
        timestamp: Date.now(),
      };
      
      userAssignments.push(assignment);
      return variant.id;
    }
    random -= variant.weight;
  }

  // Fallback to first variant
  return experiment.variants[0].id;
};

// Function to get active experiments
export const getActiveExperiments = (): Experiment[] => {
  // In a real implementation, this would fetch from a database or config
  return [
    {
      id: 'homepage-hero-section',
      name: 'Homepage Hero Section',
      trafficAllocation: 50,
      isActive: true,
      variants: [
        { id: 'control', name: 'Original Version', weight: 50 },
        { id: 'variant-a', name: 'Bold Headline', weight: 50 },
      ],
    },
    {
      id: 'product-card-layout',
      name: 'Product Card Layout',
      trafficAllocation: 30,
      isActive: true,
      variants: [
        { id: 'control', name: 'Original Layout', weight: 50 },
        { id: 'variant-b', name: 'Compact Layout', weight: 50 },
      ],
    },
  ];
};

// Function to track conversion events
export const trackConversion = (userId: string, experimentId: string, variantId: string, eventName: string) => {
  // In a real implementation, this would send data to an analytics service
  console.log(`Conversion tracked: ${eventName}`, {
    userId,
    experimentId,
    variantId,
    timestamp: new Date().toISOString()
  });
};

// Function to get user's variant for an experiment
export const getUserVariant = (userId: string, experimentId: string): string | null => {
  const assignment = userAssignments.find(
    a => a.userId === userId && a.experimentId === experimentId
  );
  
  return assignment ? assignment.variantId : null;
};