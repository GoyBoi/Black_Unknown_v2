// components/ErrorDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getRecentErrors, getErrorCounts, TrackedError } from '@/lib/error-tracking';

const ErrorDashboard = () => {
  const [errors, setErrors] = useState<TrackedError[]>([]);
  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week'>('day');
  const [selectedError, setSelectedError] = useState<TrackedError | null>(null);

  // Load errors and counts
  useEffect(() => {
    const loadErrors = () => {
      // Filter errors based on time range
      const now = Date.now();
      let timeThreshold = 0;
      
      switch (timeRange) {
        case 'hour':
          timeThreshold = now - (60 * 60 * 1000); // Last hour
          break;
        case 'day':
          timeThreshold = now - (24 * 60 * 60 * 1000); // Last 24 hours
          break;
        case 'week':
          timeThreshold = now - (7 * 24 * 60 * 60 * 1000); // Last week
          break;
      }
      
      const allErrors = getRecentErrors(100); // Get last 100 errors
      const filteredErrors = allErrors.filter(error => error.timestamp >= timeThreshold);
      
      setErrors(filteredErrors);
      setErrorCounts(getErrorCounts());
    };

    // Load errors initially
    loadErrors();

    // Set up polling to refresh errors every 30 seconds
    const interval = setInterval(loadErrors, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-500';
      case 'high':
        return 'bg-orange-500/20 text-orange-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Error Dashboard</h2>
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

      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Errors</h3>
          <p className="text-2xl font-bold">{errors.length}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Critical</h3>
          <p className="text-2xl font-bold text-red-500">{errorCounts.critical || 0}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">High</h3>
          <p className="text-2xl font-bold text-orange-500">{errorCounts.high || 0}</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Medium</h3>
          <p className="text-2xl font-bold text-yellow-500">{errorCounts.medium || 0}</p>
        </div>
      </div>

      {/* Error List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
        {errors.length === 0 ? (
          <p className="text-foreground/60">No errors found in the selected time range</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-foreground/20">
                  <th className="text-left py-2 px-4">Time</th>
                  <th className="text-left py-2 px-4">Message</th>
                  <th className="text-left py-2 px-4">Component</th>
                  <th className="text-left py-2 px-4">Severity</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error) => (
                  <tr key={error.id} className="border-b border-foreground/10 hover:bg-foreground/5">
                    <td className="py-3 px-4">{formatTimestamp(error.timestamp)}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{error.message}</td>
                    <td className="py-3 px-4 max-w-xs truncate">{error.component || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedError(error)}
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

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-foreground/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Error Details</h3>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground/80">Message</h4>
                  <p className="text-foreground">{selectedError.message}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80">Severity</h4>
                  <span className={`px-2 py-1 rounded-full text-sm ${getSeverityColor(selectedError.severity)}`}>
                    {selectedError.severity}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80">Time</h4>
                  <p>{formatTimestamp(selectedError.timestamp)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80">URL</h4>
                  <p className="text-foreground/80 break-all">{selectedError.url}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80">Component</h4>
                  <p className="text-foreground/80">{selectedError.component || 'N/A'}</p>
                </div>
                
                {selectedError.stack && (
                  <div>
                    <h4 className="font-semibold text-foreground/80">Stack Trace</h4>
                    <pre className="bg-foreground/5 p-4 rounded text-sm overflow-x-auto max-h-60 overflow-y-auto">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}
                
                {selectedError.additionalData && (
                  <div>
                    <h4 className="font-semibold text-foreground/80">Additional Data</h4>
                    <pre className="bg-foreground/5 p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedError.additionalData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedError(null)}
                  className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/10"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // In a real implementation, this would send the error to an external service
                    console.log('Reporting error to external service:', selectedError);
                    setSelectedError(null);
                  }}
                  className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
                >
                  Report Error
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDashboard;