// components/PerformanceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getPerformanceProfile, sendPerformanceToService } from '@/lib/performance-profiling';

const PerformanceDashboard = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week'>('day');
  const [isLoading, setIsLoading] = useState(true);

  // Mock function to get performance profiles (in a real implementation, this would come from an API)
  useEffect(() => {
    // Simulate loading profiles
    const loadProfiles = () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll create mock data
      const mockProfiles = [
        {
          sessionId: 'session_1',
          startTime: Date.now() - 3600000, // 1 hour ago
          endTime: Date.now() - 3500000, // 50 minutes ago
          metrics: [
            { name: 'largest_contentful_paint', value: 2400, unit: 'ms' },
            { name: 'cumulative_layout_shift', value: 0.05, unit: '' },
            { name: 'first_input_delay', value: 150, unit: 'ms' },
            { name: 'time_to_first_byte', value: 180, unit: 'ms' },
          ],
          lcp: 2400,
          cls: 0.05,
          fid: 150,
          ttfb: 180
        },
        {
          sessionId: 'session_2',
          startTime: Date.now() - 7200000, // 2 hours ago
          endTime: Date.now() - 7100000, // 1 hour 58 minutes ago
          metrics: [
            { name: 'largest_contentful_paint', value: 1800, unit: 'ms' },
            { name: 'cumulative_layout_shift', value: 0.02, unit: '' },
            { name: 'first_input_delay', value: 80, unit: 'ms' },
            { name: 'time_to_first_byte', value: 120, unit: 'ms' },
          ],
          lcp: 1800,
          cls: 0.02,
          fid: 80,
          ttfb: 120
        },
        {
          sessionId: 'session_3',
          startTime: Date.now() - 10800000, // 3 hours ago
          endTime: Date.now() - 10700000, // 2 hours 58 minutes ago
          metrics: [
            { name: 'largest_contentful_paint', value: 3200, unit: 'ms' },
            { name: 'cumulative_layout_shift', value: 0.12, unit: '' },
            { name: 'first_input_delay', value: 250, unit: 'ms' },
            { name: 'time_to_first_byte', value: 320, unit: 'ms' },
          ],
          lcp: 3200,
          cls: 0.12,
          fid: 250,
          ttfb: 320
        }
      ];
      
      setProfiles(mockProfiles);
      setIsLoading(false);
    };

    loadProfiles();
  }, [timeRange]);

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get metric status color
  const getMetricStatus = (name: string, value: number) => {
    switch (name) {
      case 'largest_contentful_paint':
        if (value <= 2500) return 'text-green-500';
        if (value <= 4000) return 'text-yellow-500';
        return 'text-red-500';
      case 'cumulative_layout_shift':
        if (value <= 0.1) return 'text-green-500';
        if (value <= 0.25) return 'text-yellow-500';
        return 'text-red-500';
      case 'first_input_delay':
        if (value <= 100) return 'text-green-500';
        if (value <= 300) return 'text-yellow-500';
        return 'text-red-500';
      case 'time_to_first_byte':
        if (value <= 200) return 'text-green-500';
        if (value <= 500) return 'text-yellow-500';
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  // Get metric status text
  const getMetricStatusText = (name: string, value: number) => {
    switch (name) {
      case 'largest_contentful_paint':
        if (value <= 2500) return 'Good';
        if (value <= 4000) return 'Needs Improvement';
        return 'Poor';
      case 'cumulative_layout_shift':
        if (value <= 0.1) return 'Good';
        if (value <= 0.25) return 'Needs Improvement';
        return 'Poor';
      case 'first_input_delay':
        if (value <= 100) return 'Good';
        if (value <= 300) return 'Needs Improvement';
        return 'Poor';
      case 'time_to_first_byte':
        if (value <= 200) return 'Good';
        if (value <= 500) return 'Needs Improvement';
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('hour')}
            className={`px-3 py-1 rounded ${timeRange === 'hour' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last Hour
          </button>
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1 rounded ${timeRange === 'day' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Last Week
          </button>
        </div>
      </div>

      {/* Core Web Vitals Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Largest Contentful Paint</h3>
          <p className="text-2xl font-bold text-green-500">2.4s</p>
          <p className="text-xs text-foreground/60">Good</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Cumulative Layout Shift</h3>
          <p className="text-2xl font-bold text-green-500">0.05</p>
          <p className="text-xs text-foreground/60">Good</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">First Input Delay</h3>
          <p className="text-2xl font-bold text-green-500">150ms</p>
          <p className="text-xs text-foreground/60">Good</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Time to First Byte</h3>
          <p className="text-2xl font-bold text-yellow-500">180ms</p>
          <p className="text-xs text-foreground/60">Good</p>
        </div>
      </div>

      {/* Performance Profiles List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Performance Sessions</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-foreground/60">No performance data found in the selected time range</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-foreground/20">
                  <th className="text-left py-2 px-4">Session ID</th>
                  <th className="text-left py-2 px-4">Start Time</th>
                  <th className="text-left py-2 px-4">LCP</th>
                  <th className="text-left py-2 px-4">CLS</th>
                  <th className="text-left py-2 px-4">FID</th>
                  <th className="text-left py-2 px-4">TTFB</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.sessionId} className="border-b border-foreground/10 hover:bg-foreground/5">
                    <td className="py-3 px-4">{profile.sessionId}</td>
                    <td className="py-3 px-4">{formatTimestamp(profile.startTime)}</td>
                    <td className={`py-3 px-4 font-medium ${getMetricStatus('largest_contentful_paint', profile.lcp)}`}>
                      {profile.lcp}ms
                    </td>
                    <td className={`py-3 px-4 font-medium ${getMetricStatus('cumulative_layout_shift', profile.cls)}`}>
                      {profile.cls}
                    </td>
                    <td className={`py-3 px-4 font-medium ${getMetricStatus('first_input_delay', profile.fid)}`}>
                      {profile.fid}ms
                    </td>
                    <td className={`py-3 px-4 font-medium ${getMetricStatus('time_to_first_byte', profile.ttfb)}`}>
                      {profile.ttfb}ms
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedProfile(profile)}
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
        )}
      </div>

      {/* Performance Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-foreground/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Performance Session Details</h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-foreground/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground/80 mb-2">Session Info</h4>
                  <div className="space-y-2">
                    <div><span className="text-foreground/60">Session ID:</span> {selectedProfile.sessionId}</div>
                    <div><span className="text-foreground/60">Start Time:</span> {formatTimestamp(selectedProfile.startTime)}</div>
                    <div><span className="text-foreground/60">End Time:</span> {formatTimestamp(selectedProfile.endTime)}</div>
                  </div>
                </div>
                
                <div className="bg-foreground/5 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground/80 mb-2">Core Web Vitals</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">LCP:</span>
                      <span className={getMetricStatus('largest_contentful_paint', selectedProfile.lcp)}>
                        {selectedProfile.lcp}ms ({getMetricStatusText('largest_contentful_paint', selectedProfile.lcp)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">CLS:</span>
                      <span className={getMetricStatus('cumulative_layout_shift', selectedProfile.cls)}>
                        {selectedProfile.cls} ({getMetricStatusText('cumulative_layout_shift', selectedProfile.cls)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">FID:</span>
                      <span className={getMetricStatus('first_input_delay', selectedProfile.fid)}>
                        {selectedProfile.fid}ms ({getMetricStatusText('first_input_delay', selectedProfile.fid)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">TTFB:</span>
                      <span className={getMetricStatus('time_to_first_byte', selectedProfile.ttfb)}>
                        {selectedProfile.ttfb}ms ({getMetricStatusText('time_to_first_byte', selectedProfile.ttfb)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-foreground/80 mb-2">All Metrics</h4>
                <div className="bg-foreground/5 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-foreground/20">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Value</th>
                        <th className="text-left py-2">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProfile.metrics.map((metric: any, index: number) => (
                        <tr key={index} className="border-b border-foreground/10">
                          <td className="py-2">{metric.name}</td>
                          <td className={`py-2 font-medium ${getMetricStatus(metric.name, metric.value)}`}>
                            {metric.value}{metric.unit !== '' ? ` ${metric.unit}` : ''}
                          </td>
                          <td className="py-2">{metric.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/10"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    try {
                      await sendPerformanceToService(selectedProfile.sessionId);
                      alert('Performance data reported successfully!');
                      setSelectedProfile(null);
                    } catch (error) {
                      console.error('Error reporting performance data:', error);
                      alert('Error reporting performance data');
                    }
                  }}
                  className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
                >
                  Report Performance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;