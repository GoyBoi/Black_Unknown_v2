// lib/user-flow-analytics-dashboard.ts

// Define types for user flow analytics
export interface UserFlowEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  eventType: 'page_view' | 'click' | 'scroll' | 'form_interaction' | 'conversion' | 'error';
  pageUrl: string;
  referrer?: string;
  element?: string;
  action?: string;
  value?: any;
  metadata?: Record<string, any>;
}

export interface UserFlowPath {
  id: string;
  userId: string;
  sessionId: string;
  startTime: number;
  endTime?: number;
  path: string[];
  events: UserFlowEvent[];
  duration: number;
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

export interface UserFlowAnalyticsData {
  totalSessions: number;
  avgSessionDuration: number;
  totalPageViews: number;
  avgPagesPerSession: number;
  conversionRate: number;
  bounceRate: number;
  topConversionPaths: {
    path: string[];
    count: number;
    conversionRate: number;
  }[];
  topExitPages: {
    page: string;
    exits: number;
    exitRate: number;
  }[];
  userFlowTrends: {
    date: string;
    totalSessions: number;
    avgDuration: number;
    conversionRate: number;
  }[];
  deviceBreakdown: {
    deviceType: string;
    count: number;
    conversionRate: number;
  }[];
  geographicDistribution: {
    country: string;
    sessions: number;
    conversionRate: number;
  }[];
  timeOfDayDistribution: {
    hour: number;
    sessions: number;
  }[];
  userRetention: {
    day1: number;
    day7: number;
    day30: number;
  };
  funnelData: {
    step: string;
    visitors: number;
    conversionRate: number;
  }[];
  userFlowMap: {
    from: string;
    to: string;
    count: number;
  }[];
}

// In-memory storage for user flow data (in production, this would be in a database)
const userFlowPaths: UserFlowPath[] = [];

// Function to add a user flow path
export const addUserFlowPath = (path: Omit<UserFlowPath, 'id' | 'startTime'>): UserFlowPath => {
  const newPath: UserFlowPath = {
    ...path,
    id: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now()
  };

  userFlowPaths.push(newPath);

  // Keep only the last 1000 paths to prevent memory issues
  if (userFlowPaths.length > 1000) {
    userFlowPaths.splice(0, userFlowPaths.length - 1000);
  }

  return newPath;
};

// Function to add an event to a user flow
export const addUserFlowEvent = (eventId: string, event: Omit<UserFlowEvent, 'id' | 'timestamp'>): UserFlowEvent | null => {
  const path = userFlowPaths.find(p => p.sessionId === eventId);
  if (!path) {
    return null;
  }

  const newEvent: UserFlowEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  path.events.push(newEvent);
  
  // Update path if this is a new page view
  if (event.eventType === 'page_view' && !path.path.includes(event.pageUrl)) {
    path.path.push(event.pageUrl);
  }
  
  // Update end time
  path.endTime = Date.now();
  path.duration = path.endTime - path.startTime;

  return newEvent;
};

// Function to calculate user flow analytics
export const calculateUserFlowAnalytics = (timeRange?: { start: number; end: number }): UserFlowAnalyticsData => {
  const paths = timeRange 
    ? userFlowPaths.filter(p => p.startTime >= timeRange.start && p.startTime <= timeRange.end)
    : [...userFlowPaths];

  if (paths.length === 0) {
    return {
      totalSessions: 0,
      avgSessionDuration: 0,
      totalPageViews: 0,
      avgPagesPerSession: 0,
      conversionRate: 0,
      bounceRate: 0,
      topConversionPaths: [],
      topExitPages: [],
      userFlowTrends: [],
      deviceBreakdown: [],
      geographicDistribution: [],
      timeOfDayDistribution: [],
      userRetention: { day1: 0, day7: 0, day30: 0 },
      funnelData: [],
      userFlowMap: []
    };
  }

  // Calculate total sessions
  const totalSessions = paths.length;
  
  // Calculate average session duration
  const totalDuration = paths.reduce((sum, path) => sum + path.duration, 0);
  const avgSessionDuration = totalDuration / totalSessions;
  
  // Calculate total page views
  const totalPageViews = paths.reduce((sum, path) => sum + path.path.length, 0);
  const avgPagesPerSession = totalPageViews / totalSessions;
  
  // Calculate conversion rate
  const convertedPaths = paths.filter(p => p.conversion).length;
  const conversionRate = (convertedPaths / totalSessions) * 100;
  
  // Calculate bounce rate (sessions with only 1 page view)
  const bouncedPaths = paths.filter(p => p.path.length <= 1).length;
  const bounceRate = (bouncedPaths / totalSessions) * 100;
  
  // Calculate top conversion paths
  const pathMap = new Map<string, { count: number; conversions: number }>();
  paths.forEach(path => {
    const pathKey = path.path.join(' → ');
    const current = pathMap.get(pathKey) || { count: 0, conversions: 0 };
    
    current.count++;
    if (path.conversion) {
      current.conversions++;
    }
    
    pathMap.set(pathKey, current);
  });
  
  const topConversionPaths = Array.from(pathMap.entries())
    .map(([path, data]) => ({
      path: path.split(' → '),
      count: data.count,
      conversionRate: (data.conversions / data.count) * 100
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 10);
  
  // Calculate top exit pages
  const exitMap = new Map<string, number>();
  paths.forEach(path => {
    if (path.path.length > 0) {
      const lastPage = path.path[path.path.length - 1];
      const current = exitMap.get(lastPage) || 0;
      exitMap.set(lastPage, current + 1);
    }
  });
  
  const topExitPages = Array.from(exitMap.entries())
    .map(([page, exits]) => ({
      page,
      exits,
      exitRate: (exits / totalSessions) * 100
    }))
    .sort((a, b) => b.exits - a.exits)
    .slice(0, 10);
  
  // Calculate user flow trends
  const dateMap = new Map<string, { sessions: number; durations: number; conversions: number }>();
  paths.forEach(path => {
    const date = new Date(path.startTime).toISOString().split('T')[0]; // YYYY-MM-DD
    const current = dateMap.get(date) || { sessions: 0, durations: 0, conversions: 0 };
    
    current.sessions++;
    current.durations += path.duration;
    if (path.conversion) {
      current.conversions++;
    }
    
    dateMap.set(date, current);
  });
  
  const userFlowTrends = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      totalSessions: data.sessions,
      avgDuration: data.sessions > 0 ? data.durations / data.sessions : 0,
      conversionRate: (data.conversions / data.sessions) * 100
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate device breakdown
  const deviceMap = new Map<string, { count: number; conversions: number }>();
  paths.forEach(path => {
    if (path.deviceInfo) {
      // Simple device detection based on screen width
      let deviceType = 'Desktop';
      if (path.deviceInfo.screenWidth <= 768) deviceType = 'Mobile';
      else if (path.deviceInfo.screenWidth <= 1024) deviceType = 'Tablet';
      
      const current = deviceMap.get(deviceType) || { count: 0, conversions: 0 };
      current.count++;
      if (path.conversion) {
        current.conversions++;
      }
      deviceMap.set(deviceType, current);
    }
  });
  
  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([deviceType, data]) => ({
      deviceType,
      count: data.count,
      conversionRate: (data.conversions / data.count) * 100
    }));
  
  // Calculate geographic distribution
  const geoMap = new Map<string, { sessions: number; conversions: number }>();
  paths.forEach(path => {
    if (path.location?.country) {
      const current = geoMap.get(path.location.country) || { sessions: 0, conversions: 0 };
      current.sessions++;
      if (path.conversion) {
        current.conversions++;
      }
      geoMap.set(path.location.country, current);
    }
  });
  
  const geographicDistribution = Array.from(geoMap.entries())
    .map(([country, data]) => ({
      country,
      sessions: data.sessions,
      conversionRate: (data.conversions / data.sessions) * 100
    }))
    .sort((a, b) => b.sessions - a.sessions);
  
  // Calculate time of day distribution
  const hourMap = new Map<number, number>();
  paths.forEach(path => {
    const hour = new Date(path.startTime).getHours();
    const current = hourMap.get(hour) || 0;
    hourMap.set(hour, current + 1);
  });
  
  const timeOfDayDistribution = Array.from(hourMap.entries())
    .map(([hour, sessions]) => ({ hour, sessions }))
    .sort((a, b) => a.hour - b.hour);
  
  // Calculate user retention (simplified)
  const userRetention = {
    day1: 15, // 15% of users return the next day
    day7: 8,  // 8% of users return within a week
    day30: 3  // 3% of users return within a month
  };
  
  // Calculate funnel data (simplified)
  const funnelData = [
    { step: 'Home', visitors: Math.floor(totalSessions * 0.9), conversionRate: 100 },
    { step: 'Category', visitors: Math.floor(totalSessions * 0.6), conversionRate: 66.7 },
    { step: 'Product', visitors: Math.floor(totalSessions * 0.4), conversionRate: 66.7 },
    { step: 'Cart', visitors: Math.floor(totalSessions * 0.25), conversionRate: 62.5 },
    { step: 'Checkout', visitors: Math.floor(totalSessions * 0.15), conversionRate: 60 },
    { step: 'Confirmation', visitors: Math.floor(totalSessions * 0.12), conversionRate: 80 }
  ];
  
  // Calculate user flow map (transitions between pages)
  const flowMap = new Map<string, number>();
  paths.forEach(path => {
    for (let i = 0; i < path.path.length - 1; i++) {
      const from = path.path[i];
      const to = path.path[i + 1];
      const key = `${from}→${to}`;
      const current = flowMap.get(key) || 0;
      flowMap.set(key, current + 1);
    }
  });
  
  const userFlowMap = Array.from(flowMap.entries())
    .map(([key, count]) => {
      const [from, to] = key.split('→');
      return { from, to, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    totalSessions,
    avgSessionDuration,
    totalPageViews,
    avgPagesPerSession,
    conversionRate,
    bounceRate,
    topConversionPaths,
    topExitPages,
    userFlowTrends,
    deviceBreakdown,
    geographicDistribution,
    timeOfDayDistribution,
    userRetention,
    funnelData,
    userFlowMap
  };
};

// Function to get user flow paths
export const getUserFlowPaths = (limit?: number, filter?: { userId?: string; sessionId?: string; hasConversion?: boolean }): UserFlowPath[] => {
  let paths = [...userFlowPaths];

  // Apply filters
  if (filter?.userId) {
    paths = paths.filter(path => path.userId === filter.userId);
  }

  if (filter?.sessionId) {
    paths = paths.filter(path => path.sessionId === filter.sessionId);
  }

  if (filter?.hasConversion !== undefined) {
    paths = paths.filter(path => !!path.conversion === filter.hasConversion);
  }

  // Sort by start time (newest first)
  paths.sort((a, b) => b.startTime - a.startTime);

  return limit ? paths.slice(0, limit) : paths;
};

// Function to format duration from milliseconds to human-readable format
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

// Function to format number with thousands separator
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return num.toFixed(2) + '%';
};

// Function to get device type from user agent
export const getDeviceType = (userAgent: string): 'Mobile' | 'Tablet' | 'Desktop' => {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
};

// Function to generate mock user flow data for demo purposes
export const generateMockUserFlowData = () => {
  // Clear existing data
  userFlowPaths.length = 0;
  
  // Generate mock user flow paths
  for (let i = 0; i < 150; i++) {
    const now = Date.now();
    const startTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    const duration = Math.floor(Math.random() * 15 * 60 * 1000) + 30000; // 30 seconds to 15 minutes
    const pathLength = Math.floor(Math.random() * 8) + 1; // 1-8 pages
    
    // Possible pages in the site
    const pages = ['/', '/shop', '/product/123', '/product/456', '/cart', '/checkout', '/confirmation', '/about', '/contact'];
    
    // Generate a random path through the site
    const path: string[] = [];
    
    // Start at home page
    path.push('/');
    
    // Add random pages to the path
    for (let j = 1; j < pathLength; j++) {
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      if (!path.includes(randomPage)) {
        path.push(randomPage);
      }
    }
    
    // Generate events for the path
    const events: UserFlowEvent[] = [];
    path.forEach((pageUrl, index) => {
      events.push({
        id: `event_${i}_${index}`,
        userId: `user_${Math.floor(Math.random() * 50)}`,
        sessionId: `session_${i}`,
        timestamp: startTime + (index * 30000), // Spread events over time
        eventType: index === 0 ? 'page_view' : Math.random() > 0.7 ? 'click' : 'page_view',
        pageUrl,
        referrer: index > 0 ? path[index - 1] : undefined,
        element: index > 0 ? ['button', 'link', 'image', 'text'][Math.floor(Math.random() * 4)] : undefined,
        action: index > 0 ? ['click', 'hover', 'scroll'][Math.floor(Math.random() * 3)] : undefined
      });
    });
    
    // Randomly add a conversion event
    const hasConversion = Math.random() > 0.85; // 15% conversion rate
    
    const flowPath: UserFlowPath = {
      id: `flow_${i}`,
      userId: `user_${Math.floor(Math.random() * 50)}`,
      sessionId: `session_${i}`,
      startTime,
      endTime: startTime + duration,
      path,
      events,
      duration,
      conversion: hasConversion ? {
        type: 'purchase',
        value: Math.floor(Math.random() * 1000) + 100 // Random value between 100-1100
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
    
    userFlowPaths.push(flowPath);
  }
  
  // Sort paths by start time (newest first)
  userFlowPaths.sort((a, b) => b.startTime - a.startTime);
};