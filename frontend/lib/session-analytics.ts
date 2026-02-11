// lib/session-analytics.ts

// Define types for session analytics
export interface SessionEvent {
  id: string;
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'viewport' | 'mutation';
  timestamp: number;
  data: any;
}

export interface Session {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration: number;
  pageViews: number;
  events: SessionEvent[];
  deviceInfo: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  location: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  url: string;
  referrer?: string;
}

export interface SessionAnalyticsData {
  totalSessions: number;
  avgDuration: number;
  totalPageViews: number;
  avgPageViews: number;
  totalInteractions: number;
  avgInteractions: number;
  bounceRate: number;
  topPages: { url: string; views: number }[];
  peakHours: { hour: number; sessions: number }[];
  deviceBreakdown: { type: string; count: number }[];
  geographicDistribution: { country: string; sessions: number }[];
  conversionRate?: number;
}

// In-memory storage for session data (in production, this would be in a database)
const sessionData: Map<string, Session> = new Map();

// Function to add a session
export const addSession = (session: Session) => {
  sessionData.set(session.id, session);
};

// Function to get a session by ID
export const getSession = (sessionId: string): Session | undefined => {
  return sessionData.get(sessionId);
};

// Function to get all sessions
export const getAllSessions = (): Session[] => {
  return Array.from(sessionData.values());
};

// Function to calculate session analytics
export const calculateSessionAnalytics = (timeRange?: { start: number; end: number }): SessionAnalyticsData => {
  const sessions = timeRange 
    ? getAllSessions().filter(s => s.startTime >= timeRange.start && s.startTime <= timeRange.end)
    : getAllSessions();

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      avgDuration: 0,
      totalPageViews: 0,
      avgPageViews: 0,
      totalInteractions: 0,
      avgInteractions: 0,
      bounceRate: 0,
      topPages: [],
      peakHours: [],
      deviceBreakdown: [],
      geographicDistribution: [],
    };
  }

  // Calculate metrics
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
  const avgDuration = totalDuration / totalSessions;
  
  const totalPageViews = sessions.reduce((sum, session) => sum + session.pageViews, 0);
  const avgPageViews = totalPageViews / totalSessions;
  
  const totalInteractions = sessions.reduce((sum, session) => sum + session.events.length, 0);
  const avgInteractions = totalInteractions / totalSessions;
  
  // Calculate bounce rate (sessions with only 1 page view)
  const bouncedSessions = sessions.filter(s => s.pageViews <= 1).length;
  const bounceRate = (bouncedSessions / totalSessions) * 100;
  
  // Calculate top pages
  const pageViewMap = new Map<string, number>();
  sessions.forEach(session => {
    const current = pageViewMap.get(session.url) || 0;
    pageViewMap.set(session.url, current + 1);
  });
  
  const topPages = Array.from(pageViewMap.entries())
    .map(([url, views]) => ({ url, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Calculate peak hours
  const hourMap = new Map<number, number>();
  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    const current = hourMap.get(hour) || 0;
    hourMap.set(hour, current + 1);
  });
  
  const peakHours = Array.from(hourMap.entries())
    .map(([hour, sessions]) => ({ hour, sessions }))
    .sort((a, b) => b.sessions - a.sessions);
  
  // Calculate device breakdown
  const deviceMap = new Map<string, number>();
  sessions.forEach(session => {
    // Simplified device detection based on screen size
    const width = session.deviceInfo.screenWidth;
    let deviceType = 'Desktop';
    if (width <= 768) deviceType = 'Mobile';
    else if (width <= 1024) deviceType = 'Tablet';
    
    const current = deviceMap.get(deviceType) || 0;
    deviceMap.set(deviceType, current + 1);
  });
  
  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([type, count]) => ({ type, count }));
  
  // Calculate geographic distribution
  const geoMap = new Map<string, number>();
  sessions.forEach(session => {
    const country = session.location.country || 'Unknown';
    const current = geoMap.get(country) || 0;
    geoMap.set(country, current + 1);
  });
  
  const geographicDistribution = Array.from(geoMap.entries())
    .map(([country, sessions]) => ({ country, sessions }))
    .sort((a, b) => b.sessions - a.sessions);
  
  return {
    totalSessions,
    avgDuration,
    totalPageViews,
    avgPageViews,
    totalInteractions,
    avgInteractions,
    bounceRate,
    topPages,
    peakHours,
    deviceBreakdown,
    geographicDistribution,
  };
};

// Function to generate mock session data for demo purposes
export const generateMockSessionData = (): Session[] => {
  const mockSessions: Session[] = [];
  
  // Generate 50 mock sessions
  for (let i = 0; i < 50; i++) {
    const now = Date.now();
    const startTime = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last 7 days
    const duration = Math.floor(Math.random() * 10 * 60 * 1000) + 30000; // 30 seconds to 10 minutes
    const pageViews = Math.floor(Math.random() * 10) + 1;
    const eventsCount = Math.floor(Math.random() * 50) + 5;
    
    const events: SessionEvent[] = [];
    for (let j = 0; j < eventsCount; j++) {
      const eventType: ('click' | 'scroll' | 'input' | 'navigation' | 'viewport' | 'mutation')[] = 
        ['click', 'scroll', 'input', 'navigation', 'viewport', 'mutation'];
      const randomEventType = eventType[Math.floor(Math.random() * eventType.length)];
      
      events.push({
        id: `event_${i}_${j}`,
        type: randomEventType,
        timestamp: startTime + Math.floor(Math.random() * duration),
        data: getRandomEventData(randomEventType)
      });
    }
    
    mockSessions.push({
      id: `session_${i}`,
      userId: `user_${Math.floor(Math.random() * 100)}`,
      startTime,
      endTime: startTime + duration,
      duration,
      pageViews,
      events,
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        screenWidth: [375, 768, 1024, 1440][Math.floor(Math.random() * 4)], // Simulate different devices
        screenHeight: [667, 1024, 768, 900][Math.floor(Math.random() * 4)],
        viewportWidth: [375, 768, 1024, 1440][Math.floor(Math.random() * 4)],
        viewportHeight: [667, 1024, 768, 900][Math.floor(Math.random() * 4)],
      },
      location: {
        ip: `192.168.1.${Math.floor(Math.random() * 254)}`,
        city: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'][Math.floor(Math.random() * 4)],
        region: 'Western Cape',
        country: 'ZA'
      },
      url: ['/', '/shop', '/product/123', '/cart', '/checkout'][Math.floor(Math.random() * 5)],
      referrer: ['direct', 'google.com', 'facebook.com', 'twitter.com'][Math.floor(Math.random() * 4)]
    });
  }
  
  return mockSessions;
};

// Helper function to generate random event data
const getRandomEventData = (eventType: string) => {
  switch (eventType) {
    case 'click':
      return {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 800),
        target: ['button', 'link', 'image', 'text'][Math.floor(Math.random() * 4)],
        elementId: `element_${Math.floor(Math.random() * 100)}`
      };
    case 'scroll':
      return {
        x: Math.floor(Math.random() * 1000),
        y: Math.floor(Math.random() * 3000),
        direction: Math.random() > 0.5 ? 'down' : 'up'
      };
    case 'input':
      return {
        target: ['input', 'textarea', 'select'][Math.floor(Math.random() * 3)],
        elementId: `input_${Math.floor(Math.random() * 50)}`,
        valueLength: Math.floor(Math.random() * 100)
      };
    case 'navigation':
      return {
        from: ['/', '/shop', '/product/123', '/cart', '/checkout'][Math.floor(Math.random() * 5)],
        to: ['/', '/shop', '/product/123', '/cart', '/checkout'][Math.floor(Math.random() * 5)],
        timestamp: Date.now()
      };
    case 'viewport':
      return {
        width: Math.floor(Math.random() * 500) + 300,
        height: Math.floor(Math.random() * 500) + 300
      };
    case 'mutation':
      return {
        type: ['added', 'removed', 'changed'][Math.floor(Math.random() * 3)],
        element: `div.${['header', 'content', 'footer', 'sidebar'][Math.floor(Math.random() * 4)]}`,
        timestamp: Date.now()
      };
    default:
      return {};
  }
};

// Function to get session replay data for a specific session
export const getSessionReplayData = (sessionId: string) => {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  
  // Sort events by timestamp
  const sortedEvents = [...session.events].sort((a, b) => a.timestamp - b.timestamp);
  
  return {
    ...session,
    events: sortedEvents
  };
};

// Function to get session heatmap data
export const getSessionHeatmapData = (sessionId: string) => {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  
  // Group click events by coordinates
  const clickMap: { [key: string]: number } = {};
  
  session.events
    .filter(event => event.type === 'click')
    .forEach(event => {
      const coord = `${event.data.x},${event.data.y}`;
      clickMap[coord] = (clickMap[coord] || 0) + 1;
    });
  
  return clickMap;
};

// Function to get session timeline
export const getSessionTimeline = (sessionId: string) => {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }
  
  return session.events.sort((a, b) => a.timestamp - b.timestamp);
};

// Function to get user journey
export const getUserJourney = (userId: string) => {
  const userSessions = getAllSessions().filter(session => session.userId === userId);
  
  return userSessions
    .sort((a, b) => a.startTime - b.startTime)
    .map(session => ({
      sessionId: session.id,
      startTime: session.startTime,
      duration: session.duration,
      pageViews: session.pageViews,
      interactions: session.events.length,
      events: session.events
        .filter(event => event.type === 'navigation')
        .map(event => event.data.to || event.data.url)
    }));
};