// lib/user-journey-analytics.ts

// Define types for user journey analytics
export interface UserJourneyEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  eventType: 'page_view' | 'click' | 'scroll' | 'form_interaction' | 'conversion';
  pageUrl: string;
  referrer?: string;
  element?: string;
  action?: string;
  value?: any;
  metadata?: Record<string, any>;
}

export interface UserJourney {
  id: string;
  userId: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  events: UserJourneyEvent[];
  path: string[]; // Ordered list of pages visited
  duration: number;
  isComplete: boolean;
  conversion?: {
    type: string;
    value?: number;
  };
  deviceInfo?: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  location?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
  };
}

export interface UserJourneyAnalytics {
  totalJourneys: number;
  avgDuration: number;
  conversionRate: number;
  topConversionPaths: { path: string[]; count: number; conversionRate: number }[];
  bounceRate: number;
  avgPagesPerJourney: number;
  mostVisitedPages: { page: string; visits: number }[];
  leastVisitedPages: { page: string; visits: number }[];
  userFlow: {
    from: string;
    to: string;
    count: number;
  }[];
  deviceBreakdown: { deviceType: string; count: number }[];
  geographicDistribution: { country: string; journeys: number }[];
  timeOfDayDistribution: { hour: number; journeys: number }[];
}

// In-memory storage for user journey data (in production, this would be in a database)
const userJourneys: Map<string, UserJourney> = new Map();

// Function to add a user journey
export const addUserJourney = (journey: Omit<UserJourney, 'id' | 'startTime'>): UserJourney => {
  const newJourney: UserJourney = {
    ...journey,
    id: `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now()
  };

  userJourneys.set(newJourney.id, newJourney);
  return newJourney;
};

// Function to add an event to an existing journey
export const addJourneyEvent = (journeyId: string, event: Omit<UserJourneyEvent, 'id' | 'timestamp'>): UserJourneyEvent | null => {
  const journey = userJourneys.get(journeyId);
  if (!journey) {
    return null;
  }

  const newEvent: UserJourneyEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  journey.events.push(newEvent);
  journey.path = [...new Set([...journey.path, event.pageUrl])]; // Add to path if not already there

  userJourneys.set(journeyId, journey);
  return newEvent;
};

// Function to get a user journey by ID
export const getUserJourney = (journeyId: string): UserJourney | undefined => {
  return userJourneys.get(journeyId);
};

// Function to get all user journeys
export const getAllUserJourneys = (): UserJourney[] => {
  return Array.from(userJourneys.values());
};

// Function to calculate user journey analytics
export const calculateUserJourneyAnalytics = (timeRange?: { start: number; end: number }): UserJourneyAnalytics => {
  const journeys = timeRange 
    ? getAllUserJourneys().filter(j => j.startTime >= timeRange.start && j.startTime <= timeRange.end)
    : getAllUserJourneys();

  if (journeys.length === 0) {
    return {
      totalJourneys: 0,
      avgDuration: 0,
      conversionRate: 0,
      topConversionPaths: [],
      bounceRate: 0,
      avgPagesPerJourney: 0,
      mostVisitedPages: [],
      leastVisitedPages: [],
      userFlow: [],
      deviceBreakdown: [],
      geographicDistribution: [],
      timeOfDayDistribution: []
    };
  }

  // Calculate total journeys
  const totalJourneys = journeys.length;
  
  // Calculate average duration
  const totalDuration = journeys.reduce((sum, journey) => sum + journey.duration, 0);
  const avgDuration = totalDuration / totalJourneys;
  
  // Calculate conversion rate
  const convertedJourneys = journeys.filter(j => j.conversion).length;
  const conversionRate = (convertedJourneys / totalJourneys) * 100;
  
  // Calculate bounce rate (journeys with only one page view)
  const bouncedJourneys = journeys.filter(j => j.path.length <= 1).length;
  const bounceRate = (bouncedJourneys / totalJourneys) * 100;
  
  // Calculate average pages per journey
  const totalPages = journeys.reduce((sum, journey) => sum + journey.path.length, 0);
  const avgPagesPerJourney = totalPages / totalJourneys;
  
  // Calculate most and least visited pages
  const pageVisits: Record<string, number> = {};
  journeys.forEach(journey => {
    journey.path.forEach(page => {
      pageVisits[page] = (pageVisits[page] || 0) + 1;
    });
  });
  
  const sortedPages = Object.entries(pageVisits)
    .map(([page, visits]) => ({ page, visits }))
    .sort((a, b) => b.visits - a.visits);
  
  const mostVisitedPages = sortedPages.slice(0, 10);
  const leastVisitedPages = sortedPages.slice(-10).reverse();
  
  // Calculate user flow (transitions between pages)
  const flowMap = new Map<string, number>();
  journeys.forEach(journey => {
    for (let i = 0; i < journey.path.length - 1; i++) {
      const from = journey.path[i];
      const to = journey.path[i + 1];
      const key = `${from}→${to}`;
      flowMap.set(key, (flowMap.get(key) || 0) + 1);
    }
  });
  
  const userFlow = Array.from(flowMap.entries())
    .map(([key, count]) => {
      const [from, to] = key.split('→');
      return { from, to, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  // Calculate device breakdown
  const deviceMap = new Map<string, number>();
  journeys.forEach(journey => {
    if (journey.deviceInfo) {
      // Simple device detection based on screen size
      const width = journey.deviceInfo.screenWidth;
      let deviceType = 'Desktop';
      if (width <= 768) deviceType = 'Mobile';
      else if (width <= 1024) deviceType = 'Tablet';
      
      const current = deviceMap.get(deviceType) || 0;
      deviceMap.set(deviceType, current + 1);
    }
  });
  
  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([deviceType, count]) => ({ deviceType, count }));
  
  // Calculate geographic distribution
  const geoMap = new Map<string, number>();
  journeys.forEach(journey => {
    if (journey.location?.country) {
      const current = geoMap.get(journey.location.country) || 0;
      geoMap.set(journey.location.country, current + 1);
    }
  });
  
  const geographicDistribution = Array.from(geoMap.entries())
    .map(([country, journeys]) => ({ country, journeys }))
    .sort((a, b) => b.journeys - a.journeys);
  
  // Calculate time of day distribution
  const hourMap = new Map<number, number>();
  journeys.forEach(journey => {
    const hour = new Date(journey.startTime).getHours();
    const current = hourMap.get(hour) || 0;
    hourMap.set(hour, current + 1);
  });
  
  const timeOfDayDistribution = Array.from(hourMap.entries())
    .map(([hour, journeys]) => ({ hour, journeys }))
    .sort((a, b) => a.hour - b.hour);
  
  // Calculate top conversion paths
  const conversionPaths: { path: string[]; count: number; conversionRate: number }[] = [];
  const pathMap = new Map<string, { count: number; conversions: number }>();
  
  journeys.forEach(journey => {
    const pathKey = journey.path.join(' → ');
    const current = pathMap.get(pathKey) || { count: 0, conversions: 0 };
    
    current.count++;
    if (journey.conversion) {
      current.conversions++;
    }
    
    pathMap.set(pathKey, current);
  });
  
  Array.from(pathMap.entries())
    .forEach(([pathKey, data]) => {
      const path = pathKey.split(' → ');
      const conversionRate = (data.conversions / data.count) * 100;
      
      conversionPaths.push({
        path,
        count: data.count,
        conversionRate
      });
    });
  
  const topConversionPaths = conversionPaths
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 10);

  return {
    totalJourneys,
    avgDuration,
    conversionRate,
    topConversionPaths,
    bounceRate,
    avgPagesPerJourney,
    mostVisitedPages,
    leastVisitedPages,
    userFlow,
    deviceBreakdown,
    geographicDistribution,
    timeOfDayDistribution
  };
};

// Function to generate mock user journey data for demo purposes
export const generateMockUserJourneyData = () => {
  // Clear existing data
  userJourneys.clear();
  
  // Generate mock user journeys
  for (let i = 0; i < 100; i++) {
    const now = Date.now();
    const startTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    const duration = Math.floor(Math.random() * 15 * 60 * 1000) + 30000; // 30 seconds to 15 minutes
    const pathLength = Math.floor(Math.random() * 8) + 1; // 1-8 pages
    
    // Generate a random path through the site
    const possiblePages = ['/', '/shop', '/product/123', '/product/456', '/cart', '/checkout', '/about', '/contact'];
    const path: string[] = [];
    
    // Start at home page
    path.push('/');
    
    // Add random pages to the path
    for (let j = 1; j < pathLength; j++) {
      const randomPage = possiblePages[Math.floor(Math.random() * possiblePages.length)];
      if (!path.includes(randomPage)) {
        path.push(randomPage);
      }
    }
    
    // Generate events for the journey
    const events: UserJourneyEvent[] = [];
    path.forEach((page, index) => {
      events.push({
        id: `event_${i}_${index}`,
        userId: `user_${Math.floor(Math.random() * 50)}`,
        sessionId: `session_${i}`,
        timestamp: startTime + (index * 30000), // Spread events over time
        eventType: index === 0 ? 'page_view' : Math.random() > 0.7 ? 'click' : 'page_view',
        pageUrl: page,
        referrer: index > 0 ? path[index - 1] : undefined,
        element: index > 0 ? 'button' : undefined,
        action: index > 0 ? 'click' : undefined
      });
    });
    
    // Randomly add a conversion event
    const hasConversion = Math.random() > 0.8; // 20% conversion rate
    if (hasConversion) {
      events.push({
        id: `event_${i}_conv`,
        userId: `user_${Math.floor(Math.random() * 50)}`,
        sessionId: `session_${i}`,
        timestamp: startTime + duration - 10000, // Near the end
        eventType: 'conversion',
        pageUrl: '/checkout',
        action: 'purchase',
        value: Math.floor(Math.random() * 1000) + 100 // Random value between 100-1100
      });
    }
    
    const journey: UserJourney = {
      id: `journey_${i}`,
      userId: `user_${Math.floor(Math.random() * 50)}`,
      sessionId: `session_${i}`,
      startTime,
      endTime: startTime + duration,
      events,
      path,
      duration,
      isComplete: true,
      conversion: hasConversion ? {
        type: 'purchase',
        value: Math.floor(Math.random() * 1000) + 100
      } : undefined,
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        screenWidth: [375, 768, 1024, 1440][Math.floor(Math.random() * 4)],
        screenHeight: [667, 1024, 768, 900][Math.floor(Math.random() * 4)],
        viewportWidth: [375, 768, 1024, 1440][Math.floor(Math.random() * 4)],
        viewportHeight: [667, 1024, 768, 900][Math.floor(Math.random() * 4)],
      },
      location: {
        ip: `192.168.1.${Math.floor(Math.random() * 254)}`,
        city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][Math.floor(Math.random() * 4)],
        region: 'Western Cape',
        country: 'ZA'
      }
    };
    
    userJourneys.set(journey.id, journey);
  }
};

// Function to get user journey by ID
export const getUserJourneyById = (id: string): UserJourney | undefined => {
  return userJourneys.get(id);
};

// Function to get user journeys by user ID
export const getUserJourneysByUser = (userId: string): UserJourney[] => {
  return Array.from(userJourneys.values()).filter(journey => journey.userId === userId);
};

// Function to get user journeys by session ID
export const getUserJourneysBySession = (sessionId: string): UserJourney[] => {
  return Array.from(userJourneys.values()).filter(journey => journey.sessionId === sessionId);
};

// Function to format duration in milliseconds to human-readable format
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};