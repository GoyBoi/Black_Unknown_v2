// components/UserJourneyAnalytics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateUserJourneyAnalytics, 
  generateMockUserJourneyData,
  UserJourneyAnalytics,
  UserJourney
} from '@/lib/user-journey-analytics';

const UserJourneyAnalytics = () => {
  const [analytics, setAnalytics] = useState<UserJourneyAnalytics | null>(null);
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'flow' | 'devices' | 'geography'>('overview');

  // Load user journey analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockUserJourneyData();
      
      // Calculate analytics
      const calculatedAnalytics = calculateUserJourneyAnalytics();
      setAnalytics(calculatedAnalytics);
      
      // Get journeys
      setJourneys(Array.from({ length: 20 }, (_, i) => ({
        id: `journey_${i}`,
        userId: `user_${Math.floor(Math.random() * 50)}`,
        sessionId: `session_${i}`,
        startTime: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        endTime: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000) + Math.floor(Math.random() * 15 * 60 * 1000),
        events: [],
        path: ['/', '/shop', '/product/123', '/cart', '/checkout'].slice(0, Math.floor(Math.random() * 4) + 2),
        duration: Math.floor(Math.random() * 15 * 60 * 1000),
        isComplete: true,
        conversion: Math.random() > 0.8 ? { type: 'purchase', value: Math.floor(Math.random() * 1000) + 100 } : undefined,
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
      })));
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  // Format number with thousands separator
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Format duration from milliseconds to human-readable format
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>Unable to load user journey analytics</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">User Journey Analytics</h2>
            <p className="text-foreground/80 mt-1">Analyze user paths and behavior patterns</p>
          </div>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 border-b border-foreground/10">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Journeys</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalJourneys)}</p>
          <p className="text-xs text-foreground/60">User sessions</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Duration</h3>
          <p className="text-2xl font-bold text-foreground">{formatDuration(analytics.avgDuration)}</p>
          <p className="text-xs text-foreground/60">Per session</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Conversion Rate</h3>
          <p className={`text-2xl font-bold ${
            analytics.conversionRate >= 5 ? 'text-green-500' : 
            analytics.conversionRate >= 2 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.conversionRate.toFixed(2)}%
          </p>
          <p className="text-xs text-foreground/60">Successful conversions</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Bounce Rate</h3>
          <p className={`text-2xl font-bold ${
            analytics.bounceRate <= 20 ? 'text-green-500' : 
            analytics.bounceRate <= 40 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.bounceRate.toFixed(2)}%
          </p>
          <p className="text-xs text-foreground/60">Single page exits</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Pages</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.avgPagesPerJourney.toFixed(1)}</p>
          <p className="text-xs text-foreground/60">Per journey</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'paths', 'flow', 'devices', 'geography'] as const).map(tab => (
            <button
              key={tab}
              className={`py-4 px-1 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Conversion Paths */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Conversion Paths</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-3 px-4">Path</th>
                      <th className="text-left py-3 px-4">Journeys</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topConversionPaths.map((path, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/60 mr-2">{index + 1}.</span>
                            <div className="flex items-center space-x-2">
                              {path.path.map((page, idx) => (
                                <React.Fragment key={idx}>
                                  <span className="bg-foreground/10 px-2 py-1 rounded text-sm">{page}</span>
                                  {idx < path.path.length - 1 && (
                                    <span className="text-foreground/40">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatNumber(path.count)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              path.conversionRate >= 5 ? 'text-green-500' : 
                              path.conversionRate >= 2 ? 'text-yellow-500' : 'text-red-500'
                            }`}>
                              {path.conversionRate.toFixed(2)}%
                            </span>
                            <div className="ml-2 w-24 bg-foreground/20 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  path.conversionRate >= 5 ? 'bg-green-500' : 
                                  path.conversionRate >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(path.conversionRate, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Most Visited Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="font-semibold mb-4">Most Visited Pages</h3>
                <div className="space-y-3">
                  {analytics.mostVisitedPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground/80 truncate max-w-[60%]">{page.page}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(page.visits)}</span>
                        <div className="w-24 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(page.visits / analytics.mostVisitedPages[0].visits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="font-semibold mb-4">Least Visited Pages</h3>
                <div className="space-y-3">
                  {analytics.leastVisitedPages.map((page, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground/80 truncate max-w-[60%]">{page.page}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(page.visits)}</span>
                        <div className="w-24 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(page.visits / analytics.mostVisitedPages[0].visits) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paths Tab */}
        {activeTab === 'paths' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Path Analysis</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Entry Page</th>
                      <th className="text-left py-2 px-4">Exit Page</th>
                      <th className="text-left py-2 px-4">Journeys</th>
                      <th className="text-left py-2 px-4">Avg. Duration</th>
                      <th className="text-left py-2 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journeys.slice(0, 10).map((journey, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">{journey.path[0]}</td>
                        <td className="py-3 px-4">{journey.path[journey.path.length - 1]}</td>
                        <td className="py-3 px-4">{journey.path.length}</td>
                        <td className="py-3 px-4">{formatDuration(journey.duration)}</td>
                        <td className="py-3 px-4">
                          {journey.conversion 
                            ? <span className="text-green-500">Converted</span> 
                            : <span className="text-foreground/60">Not Converted</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Flow Tab */}
        {activeTab === 'flow' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Flow</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">From</th>
                      <th className="text-left py-2 px-4">To</th>
                      <th className="text-left py-2 px-4">Transitions</th>
                      <th className="text-left py-2 px-4">Drop-off Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.userFlow.map((flow, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">
                          <span className="bg-foreground/10 px-2 py-1 rounded text-sm">{flow.from}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-foreground/10 px-2 py-1 rounded text-sm">{flow.to}</span>
                        </td>
                        <td className="py-3 px-4">{formatNumber(flow.count)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/80 mr-2">
                              {(100 - (flow.count / analytics.totalJourneys) * 100).toFixed(1)}%
                            </span>
                            <div className="w-32 bg-foreground/20 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${(100 - (flow.count / analytics.totalJourneys) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-3">By Device Type</h4>
                <div className="space-y-3">
                  {analytics.deviceBreakdown.map((device, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="capitalize">{device.deviceType}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(device.count)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${(device.count / analytics.totalJourneys) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium mb-3">Screen Resolution</h4>
                <div className="space-y-3">
                  {['1920x1080', '1366x768', '375x667', '768x1024'].map((resolution, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{resolution}</span>
                      <div className="flex items-center">
                        <span className="text-foreground mr-2">{formatNumber(Math.floor(Math.random() * 50) + 10)}</span>
                        <div className="w-32 bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geography Tab */}
        {activeTab === 'geography' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Country</th>
                      <th className="text-left py-2 px-4">Journeys</th>
                      <th className="text-left py-2 px-4">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.geographicDistribution.map((location, index) => (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4 font-medium">{location.country}</td>
                        <td className="py-3 px-4">{formatNumber(location.journeys)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span className="text-foreground/80 mr-2">
                              {((location.journeys / analytics.totalJourneys) * 100).toFixed(1)}%
                            </span>
                            <div className="w-32 bg-foreground/20 rounded-full h-2">
                              <div 
                                className="bg-gold h-2 rounded-full" 
                                style={{ width: `${(location.journeys / analytics.totalJourneys) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserJourneyAnalytics;