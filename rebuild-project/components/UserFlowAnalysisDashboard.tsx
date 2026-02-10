// components/UserFlowAnalysisDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateUserFlowAnalytics, 
  generateMockUserFlowData,
  formatDuration,
  formatNumber,
  formatPercentage,
  UserFlowAnalytics
} from '@/lib/user-flow-analysis';

const UserFlowAnalysisDashboard = () => {
  const [analytics, setAnalytics] = useState<UserFlowAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'funnel' | 'geography' | 'devices'>('overview');

  // Load user flow analytics data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Generate mock data for demo
      generateMockUserFlowData();
      
      // Calculate analytics
      const analysis = calculateUserFlowAnalytics();
      setAnalytics(analysis);
      
      setIsLoading(false);
    };

    loadData();
  }, [timeRange]);

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
        <p>Unable to load user flow analysis data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">User Flow Analysis</h2>
            <p className="text-foreground/80 mt-1">Analyze user behavior and journey patterns</p>
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
          <h3 className="text-foreground/60 text-sm">Total Paths</h3>
          <p className="text-2xl font-bold text-foreground">{formatNumber(analytics.totalPaths)}</p>
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
            {formatPercentage(analytics.conversionRate)}
          </p>
          <p className="text-xs text-foreground/60">Successful conversions</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Bounce Rate</h3>
          <p className={`text-2xl font-bold ${
            analytics.bounceRate <= 20 ? 'text-green-500' : 
            analytics.bounceRate <= 40 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {formatPercentage(analytics.bounceRate)}
          </p>
          <p className="text-xs text-foreground/60">Single page exits</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Avg. Pages</h3>
          <p className="text-2xl font-bold text-foreground">{analytics.avgPagesPerPath.toFixed(1)}</p>
          <p className="text-xs text-foreground/60">Per session</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'paths', 'funnel', 'geography', 'devices'] as const).map(tab => (
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
            {/* User Flow Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-4">User Flow Trend</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.userFlowTrends.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(day.totalPaths / Math.max(...analytics.userFlowTrends.map(d => d.totalPaths))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Conversion Paths */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Conversion Paths</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Path</th>
                      <th className="text-left py-2 px-4">Journeys</th>
                      <th className="text-left py-2 px-4">Conversion Rate</th>
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
                                  <span className="bg-foreground/10 px-2 py-1 rounded text-sm truncate max-w-[120px]">{page}</span>
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
                              {formatPercentage(path.conversionRate)}
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

            {/* Top Exit Pages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Exit Pages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topExitPages.map((page, index) => (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium truncate max-w-[70%]">{page.page}</h4>
                      <span className="text-foreground/60">{formatNumber(page.exits)}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${page.exitRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/60">
                      <span>Exit rate</span>
                      <span>{formatPercentage(page.exitRate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paths Tab */}
        {activeTab === 'paths' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Paths</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Session ID</th>
                    <th className="text-left py-2 px-4">User</th>
                    <th className="text-left py-2 px-4">Duration</th>
                    <th className="text-left py-2 px-4">Pages</th>
                    <th className="text-left py-2 px-4">Conversion</th>
                    <th className="text-left py-2 px-4">Device</th>
                    <th className="text-left py-2 px-4">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 20 }, (_, i) => ({
                    id: `session_${i}`,
                    userId: `user_${Math.floor(Math.random() * 50)}`,
                    duration: Math.floor(Math.random() * 15 * 60 * 1000), // 0-15 minutes in ms
                    pages: Math.floor(Math.random() * 10) + 1, // 1-10 pages
                    conversion: Math.random() > 0.8 ? { type: 'purchase', value: Math.floor(Math.random() * 1000) + 100 } : null,
                    device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
                    country: ['ZA', 'NG', 'KE', 'GH', 'UG'][Math.floor(Math.random() * 5)]
                  })).map((session, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-mono text-sm">{session.id}</td>
                      <td className="py-3 px-4">{session.userId}</td>
                      <td className="py-3 px-4">{formatDuration(session.duration)}</td>
                      <td className="py-3 px-4">{session.pages}</td>
                      <td className="py-3 px-4">
                        {session.conversion ? (
                          <span className="text-green-500 font-medium">Converted</span>
                        ) : (
                          <span className="text-foreground/60">No conversion</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{session.device}</td>
                      <td className="py-3 px-4">{session.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Funnel Tab */}
        {activeTab === 'funnel' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-6">
              <div className="flex items-center justify-between mb-8">
                {analytics.funnelData.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-center mb-2">
                      <div className="text-lg font-bold text-foreground">{formatNumber(step.visitors)}</div>
                      <div className="text-sm text-foreground/80">{step.step}</div>
                    </div>
                    {index < analytics.funnelData.length - 1 && (
                      <div className="text-foreground/30 text-2xl">→</div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="relative h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-16 flex">
                    {analytics.funnelData.map((step, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-center relative"
                        style={{ width: `${(step.visitors / analytics.funnelData[0].visitors) * 100}%` }}
                      >
                        <div className="absolute w-full h-16 bg-foreground/10 rounded-lg flex items-center justify-center">
                          <div 
                            className="h-16 bg-gold rounded-lg" 
                            style={{ width: `${step.conversionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {analytics.funnelData.map((step, index) => (
                  <div key={index} className="bg-foreground/10 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-foreground">{formatNumber(step.visitors)}</div>
                    <div className="text-sm text-foreground/80">{step.step}</div>
                    <div className="mt-2 text-sm font-medium">
                      {index > 0 && (
                        <span className="text-red-500">
                          ↓ {((analytics.funnelData[index-1].visitors - step.visitors) / analytics.funnelData[index-1].visitors * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-foreground/60">
                      {formatPercentage(step.conversionRate)} conversion
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Geography Tab */}
        {activeTab === 'geography' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <h4 className="font-medium mb-4">Sessions by Country</h4>
                <div className="space-y-3">
                  {analytics.geographicDistribution.map((location, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{location.country}</span>
                      <div className="flex items-center flex-1 ml-4">
                        <span className="text-foreground mr-2">{formatNumber(location.paths)}</span>
                        <div className="w-full bg-foreground/20 rounded-full h-2.5">
                          <div 
                            className="bg-gold h-2.5 rounded-full" 
                            style={{ width: `${(location.paths / analytics.geographicDistribution[0].paths) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-foreground/60 ml-2 w-16">
                          {formatPercentage(location.conversionRate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <h4 className="font-medium mb-4">Conversion Rates by Region</h4>
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.geographicDistribution.slice(0, 8).map((location, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${location.conversionRate}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {location.country.substring(0, 3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.deviceBreakdown.map((device, index) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium capitalize">{device.deviceType}</h4>
                    <span className="text-lg font-bold text-foreground">{formatNumber(device.count)}</span>
                  </div>
                  <div className="w-full bg-foreground/20 rounded-full h-3 mb-3">
                    <div 
                      className="bg-gold h-3 rounded-full" 
                      style={{ width: `${(device.count / analytics.totalPaths) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-foreground/60">
                    <span>Conversions</span>
                    <span>{formatPercentage(device.conversionRate)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-foreground/5 rounded-lg border border-foreground/10 p-4">
              <h4 className="font-medium mb-4">Time of Day Activity</h4>
              <div className="h-64">
                <div className="flex items-end h-full space-x-1">
                  {analytics.timeOfDayDistribution.map((hourData, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(hourData.paths / Math.max(...analytics.timeOfDayDistribution.map(h => h.paths))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {hourData.hour}:00
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFlowAnalysisDashboard;