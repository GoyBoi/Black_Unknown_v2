// components/SessionReplayInterface.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSessionRecording } from '@/lib/session-recording';

interface SessionReplayInterfaceProps {
  sessionId: string;
}

const SessionReplayInterface: React.FC<SessionReplayInterfaceProps> = ({ sessionId }) => {
  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const replayRef = useRef<HTMLDivElement>(null);
  const playbackInterval = useRef<NodeJS.Timeout | null>(null);

  // Load session data
  useEffect(() => {
    const sessionData = getSessionRecording(sessionId);
    if (sessionData) {
      setSession(sessionData);
      setEvents(sessionData.events.sort((a: any, b: any) => a.timestamp - b.timestamp));
      setCurrentTime(sessionData.startTime);
    }
  }, [sessionId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current);
      }
    };
  }, []);

  // Playback controls
  const play = () => {
    if (!session || events.length === 0) return;

    setIsPlaying(true);
    const startTime = Date.now();
    const sessionStartTime = session.startTime;

    playbackInterval.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) * speed;
      const newTime = sessionStartTime + elapsed;

      setCurrentTime(newTime);

      // Find the next event to process
      const nextEventIndex = events.findIndex(event => 
        event.timestamp > currentTime && event.timestamp <= newTime
      );

      if (nextEventIndex !== -1) {
        setCurrentIndex(nextEventIndex);
        // Process the event (in a real implementation, this would update the UI)
        processEvent(events[nextEventIndex]);
      }

      // Stop if we've reached the end
      if (newTime >= events[events.length - 1].timestamp) {
        pause();
      }
    }, 1000 / 60); // ~60fps
  };

  const pause = () => {
    setIsPlaying(false);
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
      playbackInterval.current = null;
    }
  };

  const stop = () => {
    pause();
    setCurrentIndex(0);
    setCurrentTime(session?.startTime || 0);
  };

  const processEvent = (event: any) => {
    // In a real implementation, this would replay the event on the UI
    console.log('Replaying event:', event);
    
    if (replayRef.current) {
      switch (event.type) {
        case 'click':
          // Highlight the clicked element
          const clickIndicator = document.createElement('div');
          clickIndicator.style.position = 'absolute';
          clickIndicator.style.left = `${event.data.x}px`;
          clickIndicator.style.top = `${event.data.y}px`;
          clickIndicator.style.width = '20px';
          clickIndicator.style.height = '20px';
          clickIndicator.style.borderRadius = '50%';
          clickIndicator.style.backgroundColor = 'red';
          clickIndicator.style.pointerEvents = 'none';
          clickIndicator.style.zIndex = '9999';
          clickIndicator.style.opacity = '0.7';
          
          replayRef.current.appendChild(clickIndicator);
          
          // Remove the indicator after a short time
          setTimeout(() => {
            if (clickIndicator.parentNode) {
              clickIndicator.parentNode.removeChild(clickIndicator);
            }
          }, 1000);
          break;
          
        case 'scroll':
          // Scroll the replay area
          if (replayRef.current) {
            replayRef.current.scrollTo({
              left: event.data.x,
              top: event.data.y,
              behavior: 'smooth'
            });
          }
          break;
          
        case 'input':
          // Show input activity
          console.log(`Input detected on ${event.data.target} (${event.data.name})`);
          break;
          
        case 'navigation':
          // Show navigation event
          console.log(`Navigated from ${event.data.from} to ${event.data.to}`);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    }
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    if (!session) return '00:00';
    const elapsed = (timestamp - session.startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = session && events.length > 0
    ? ((currentTime - session.startTime) / (events[events.length - 1].timestamp - session.startTime)) * 100
    : 0;

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/20 overflow-hidden">
      <div className="p-4 border-b border-foreground/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Session Replay</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-foreground/80">{formatTime(currentTime)}</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={stop}
                className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50"
                disabled={!session}
              >
                ⏹
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 disabled:opacity-50"
                disabled={!session}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="bg-foreground/10 border border-foreground/20 rounded px-2 py-1 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full bg-foreground/10 rounded-full h-2">
          <div
            className="bg-gold h-2 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Session Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-foreground/60">Session ID:</span> {sessionId}</div>
            <div><span className="text-foreground/60">Start Time:</span> {session ? new Date(session.startTime).toLocaleString() : 'Loading...'}</div>
            <div><span className="text-foreground/60">Events:</span> {events.length}</div>
            <div><span className="text-foreground/60">Status:</span> {isPlaying ? 'Playing' : 'Paused'}</div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Event Timeline</h4>
          <div className="bg-foreground/5 rounded-lg p-4 max-h-60 overflow-y-auto">
            {events.length > 0 ? (
              <ul className="space-y-2">
                {events.map((event, index) => (
                  <li
                    key={event.id}
                    className={`p-2 rounded ${index <= currentIndex ? 'bg-gold/10 border-l-4 border-gold' : 'bg-foreground/10'}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{event.type}</span>
                      <span className="text-foreground/60 text-sm">{formatTime(event.timestamp)}</span>
                    </div>
                    <div className="text-sm text-foreground/80 mt-1 truncate">
                      {event.data.target ? `Target: ${event.data.target}` : 
                       event.data.name ? `Element: ${event.data.name}` : 
                       event.type === 'navigation' ? `From: ${event.data.from} → To: ${event.data.to}` : 
                       'Event details'}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/60 text-center py-4">No events to display</p>
            )}
          </div>
        </div>

        <div className="bg-foreground/5 rounded-lg p-4 min-h-[300px] relative overflow-hidden" ref={replayRef}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <h4 className="text-lg font-semibold mb-2">Session Replay Viewport</h4>
              <p className="text-foreground/80 max-w-md">
                This area would display the replay of user interactions. 
                During playback, user actions like clicks, scrolls, and navigation will be visualized.
              </p>
              {isPlaying && (
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-gold/20 text-gold rounded-full text-sm">
                  <span className="w-2 h-2 bg-gold rounded-full mr-2 animate-pulse"></span>
                  Playing session...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionReplayInterface;