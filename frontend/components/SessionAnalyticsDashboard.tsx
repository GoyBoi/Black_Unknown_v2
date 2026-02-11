// components/SessionAnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateSessionAnalytics, 
  generateMockSessionData, 
  SessionAnalyticsData,
  getAllSessions,
  getSession,
  getSessionHeatmapData,
  getSessionTimeline,
  getUserJourney
} from '@/lib/session-analytics';

const SessionAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<SessionAnalyticsData | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    setIsLoading(true);
    
    // Generate mock data for demo
    const mockSessions = generateMockSessionData();
    mockSessions.forEach(session => addSession(session));
    
    // Calculate analytics
    const data = calculateSessionAnalytics();
    setAnalytics(data);
    
    // Get all sessions
    const allSessions = getAllSessions();
    setSessions(allSessions);
    
    setIsLoading(false);
  }, [timeRange]);

  // Format time duration
  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Get color based on value
  const getValueColor = (value: number, max: number): string => {
    const percentage = (value / max) * 100;
    if (percentage > 75) return 'text-green-500';
    if (percentage > 50) return 'text-yellow-500';
    return 'text-foreground/60';
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Session Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded ${timeRange === 'day' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last Day
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded ${timeRange === 'month' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last Month
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Total Sessions</h3>
              <p className="text-2xl font-bold text-foreground">{analytics.totalSessions}</p>
              <p className="text-xs text-foreground/60">Users engaged</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Avg. Duration</h3>
              <p className="text-2xl font-bold text-foreground">{formatDuration(analytics.avgDuration)}</p>
              <p className="text-xs text-foreground/60">Per session</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Bounce Rate</h3>
              <p className={`text-2xl font-bold ${analytics.bounceRate > 50 ? 'text-red-500' : analytics.bounceRate > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                {formatPercentage(analytics.bounceRate)}
              </p>
              <p className="text-xs text-foreground/60">Single page visits</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Avg. Interactions</h3>
              <p className="text-2xl font-bold text-foreground">{analytics.avgInteractions.toFixed(1)}</p>
              <p className="text-xs text-foreground/60">Per session</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Pages */}
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="font-semibold mb-4">Top Pages</h3>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="truncate max-w-[60%]">{page.url}</span>
                    <span className="bg-gold/20 text-gold px-2 py-1 rounded text-sm">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="font-semibold mb-4">Device Breakdown</h3>
              <div className="space-y-3">
                {analytics.deviceBreakdown.map((device, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{device.type}</span>
                    <div className="flex items-center">
                      <span className="mr-2">{device.count}</span>
                      <div className="w-24 bg-foreground/20 rounded-full h-2">
                        <div 
                          className="bg-gold h-2 rounded-full" 
                          style={{ width: `${(device.count / analytics.totalSessions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Geographic Distribution</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Country</th>
                    <th className="text-left py-2 px-4">Sessions</th>
                    <th className="text-left py-2 px-4">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.geographicDistribution.slice(0, 5).map((location, index) => (
                    <tr key={index} className="border-b border-foreground/10">
                      <td className="py-3 px-4">{location.country}</td>
                      <td className="py-3 px-4">{location.sessions}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-foreground/20 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${(location.sessions / analytics.totalSessions) * 100}%` }}
                            ></div>
                          </div>
                          <span>{((location.sessions / analytics.totalSessions) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h3 className="font-semibold mb-4">Recent Sessions</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Session ID</th>
                    <th className="text-left py-2 px-4">User</th>
                    <th className="text-left py-2 px-4">Duration</th>
                    <th className="text-left py-2 px-4">Page Views</th>
                    <th className="text-left py-2 px-4">Interactions</th>
                    <th className="text-left py-2 px-4">Start Time</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 10).map((session, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">{session.id.substring(0, 8)}...</td>
                      <td className="py-3 px-4">{session.userId || 'Anonymous'}</td>
                      <td className="py-3 px-4">{formatDuration(session.duration)}</td>
                      <td className="py-3 px-4">{session.pageViews}</td>
                      <td className="py-3 px-4">{session.events.length}</td>
                      <td className="py-3 px-4">{new Date(session.startTime).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="text-gold hover:underline text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Detail Modal */}
          {selectedSession && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-background border border-foreground/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">Session Details: {selectedSession.id.substring(0, 8)}...</h3>
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="text-foreground/60 hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-foreground/5 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Session Info</h4>
                      <div className="space-y-2">
                        <div><span className="text-foreground/60">User ID:</span> {selectedSession.userId || 'Anonymous'}</div>
                        <div><span className="text-foreground/60">Start Time:</span> {new Date(selectedSession.startTime).toLocaleString()}</div>
                        <div><span className="text-foreground/60">Duration:</span> {formatDuration(selectedSession.duration)}</div>
                        <div><span className="text-foreground/60">Page Views:</span> {selectedSession.pageViews}</div>
                        <div><span className="text-foreground/60">Interactions:</span> {selectedSession.events.length}</div>
                      </div>
                    </div>
                    
                    <div className="bg-foreground/5 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Device Info</h4>
                      <div className="space-y-2">
                        <div><span className="text-foreground/60">Screen:</span> {selectedSession.deviceInfo.screenWidth}×{selectedSession.deviceInfo.screenHeight}</div>
                        <div><span className="text-foreground/60">Viewport:</span> {selectedSession.deviceInfo.viewportWidth}×{selectedSession.deviceInfo.viewportHeight}</div>
                        <div><span className="text-foreground/60">Location:</span> {selectedSession.location.city}, {selectedSession.location.country}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Session Timeline</h4>
                    <div className="bg-foreground/5 rounded-lg p-4 max-h-60 overflow-y-auto">
                      {selectedSession.events.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedSession.events.slice(0, 10).map((event: any, idx: number) => (
                            <li key={idx} className="flex justify-between text-sm">
                              <span className="capitalize">{event.type}</span>
                              <span className="text-foreground/60">{new Date(event.timestamp).toLocaleTimeString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-foreground/60 text-center py-4">No events recorded</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/10"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-foreground/60">
          <p>Unable to load session analytics data</p>
        </div>
      )}
    </div>
  );
};

export default SessionAnalyticsDashboard;