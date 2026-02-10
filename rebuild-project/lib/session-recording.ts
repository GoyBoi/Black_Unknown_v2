// lib/session-recording.ts

// Define types for session recording
export interface SessionEvent {
  id: string;
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'viewport' | 'mutation';
  timestamp: number;
  data: any;
}

export interface SessionRecording {
  sessionId: string;
  userId?: string;
  startTime: number;
  events: SessionEvent[];
  isActive: boolean;
}

// In-memory storage for session recordings (in production, this would be sent to an external service)
const sessionRecordings: Map<string, SessionRecording> = new Map();

// Function to start a new session recording
export const startSessionRecording = (userId?: string): string => {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const session: SessionRecording = {
    sessionId,
    userId,
    startTime: Date.now(),
    events: [],
    isActive: true
  };
  
  sessionRecordings.set(sessionId, session);
  
  // Add initial viewport event
  if (typeof window !== 'undefined') {
    recordEvent(sessionId, {
      type: 'viewport',
      data: {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset
      }
    });
  }
  
  return sessionId;
};

// Function to record an event in a session
export const recordEvent = (sessionId: string, event: Omit<SessionEvent, 'id' | 'timestamp'>): void => {
  const session = sessionRecordings.get(sessionId);
  if (!session || !session.isActive) {
    return;
  }
  
  const sessionEvent: SessionEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    ...event
  };
  
  session.events.push(sessionEvent);
  
  // Limit the number of events to prevent memory issues
  if (session.events.length > 1000) {
    session.events.shift(); // Remove oldest event
  }
  
  sessionRecordings.set(sessionId, session);
};

// Function to stop a session recording
export const stopSessionRecording = (sessionId: string): SessionRecording | null => {
  const session = sessionRecordings.get(sessionId);
  if (!session) {
    return null;
  }
  
  session.isActive = false;
  return session;
};

// Function to get a session recording
export const getSessionRecording = (sessionId: string): SessionRecording | null => {
  return sessionRecordings.get(sessionId) || null;
};

// Function to initialize session recording listeners
export const initSessionRecording = (sessionId: string, userId?: string) => {
  if (typeof window === 'undefined') return;
  
  // Record clicks
  window.addEventListener('click', (event) => {
    recordEvent(sessionId, {
      type: 'click',
      data: {
        target: (event.target as HTMLElement).tagName,
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now()
      }
    });
  });

  // Record scrolls
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      recordEvent(sessionId, {
        type: 'scroll',
        data: {
          x: window.pageXOffset,
          y: window.pageYOffset
        }
      });
    }, 100); // Debounce scroll events
  });

  // Record viewport changes
  window.addEventListener('resize', () => {
    recordEvent(sessionId, {
      type: 'viewport',
      data: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  });

  // Record navigation events
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    recordEvent(sessionId, {
      type: 'navigation',
      data: {
        from: document.referrer,
        to: window.location.href,
        timestamp: Date.now()
      }
    });
  };

  // Record input events (with privacy considerations - only record that input happened, not the value)
  window.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      recordEvent(sessionId, {
        type: 'input',
        data: {
          target: target.tagName,
          name: target.name || target.id || 'unknown',
          type: target.type || 'text',
          timestamp: Date.now()
        }
      });
    }
  });

  // Record mutations (DOM changes)
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          recordEvent(sessionId, {
            type: 'mutation',
            data: {
              type: mutation.type,
              addedNodes: mutation.addedNodes.length,
              removedNodes: mutation.removedNodes.length,
              target: (mutation.target as HTMLElement).tagName,
              timestamp: Date.now()
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};

// Function to simulate sending session data to external service
export const sendSessionToService = async (sessionId: string) => {
  const session = sessionRecordings.get(sessionId);
  if (!session) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }

  // In a real implementation, this would send the session data to an external service
  console.log(`Sending session ${sessionId} to external service:`, {
    sessionId: session.sessionId,
    userId: session.userId,
    startTime: session.startTime,
    eventCount: session.events.length,
    duration: Date.now() - session.startTime
  });
  
  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 1000));
};