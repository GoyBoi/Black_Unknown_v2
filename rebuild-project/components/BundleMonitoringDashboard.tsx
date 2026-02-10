// components/BundleMonitoringDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  getBundleReports, 
  getLatestBundleReport, 
  setBundleMonitoringConfig, 
  getBundleMonitoringConfig,
  formatBytes,
  calculateGrowthRate,
  getBundleComposition,
  generateBundleOptimizationSuggestions
} from '@/lib/bundle-monitoring';

const BundleMonitoringDashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [config, setConfig] = useState<any>({
    maxSizeThreshold: 1048576, // 1MB
    maxGzipSizeThreshold: 307200, // 300KB
    notificationChannels: ['dashboard'],
    alertCooldown: 30,
    enabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'chunks' | 'assets' | 'history' | 'optimization'>('overview');

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll generate mock data
      const mockReports = [
        {
          id: 'report-1',
          timestamp: Date.now(),
          totalSize: 1245678, // ~1.2MB
          totalGzipSize: 345678, // ~345KB
          chunks: [
            { id: 'main', name: 'main.js', size: 456789, gzipSize: 123456 },
            { id: 'vendors', name: 'vendors.js', size: 320000, gzipSize: 89000 },
            { id: 'ui-components', name: 'ui-components.js', size: 150000, gzipSize: 45000 },
            { id: 'pages-home', name: 'pages-home.js', size: 180000, gzipSize: 55000 },
            { id: 'pages-shop', name: 'pages-shop.js', size: 138889, gzipSize: 33222 },
          ],
          assets: [
            { name: 'react.js', size: 120000, chunkId: 'vendors' },
            { name: 'react-dom.js', size: 110000, chunkId: 'vendors' },
            { name: 'app.js', size: 100000, chunkId: 'main' },
            { name: 'styles.css', size: 50000, chunkId: 'main' },
            { name: 'utils.js', size: 76789, chunkId: 'main' },
            { name: '@heroicons/react.js', size: 45000, chunkId: 'vendors' },
            { name: 'lucide-react.js', size: 35000, chunkId: 'vendors' },
            { name: 'next.js', size: 120000, chunkId: 'vendors' },
          ],
          duplicatePackages: ['react', 'react-dom'],
          optimizationSuggestions: [
            'Split vendor bundle to reduce main bundle size',
            'Implement code splitting for pages',
            'Remove unused CSS',
            'Compress images further',
            'Consider dynamic imports for non-critical components'
          ],
          sizeHistory: [
            { timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, size: 1100000 }, // 1 week ago
            { timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, size: 1120000 }, // 6 days ago
            { timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, size: 1130000 }, // 5 days ago
            { timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, size: 1150000 }, // 4 days ago
            { timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, size: 1180000 }, // 3 days ago
            { timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, size: 1200000 }, // 2 days ago
            { timestamp: Date.now() - 24 * 60 * 60 * 1000, size: 1220000 }, // 1 day ago
            { timestamp: Date.now(), size: 1245678 }, // Today
          ]
        }
      ];
      
      setReports(mockReports);
      setLatestReport(mockReports[0]);
      
      // Load config
      const currentConfig = getBundleMonitoringConfig();
      setConfig(currentConfig);
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate growth rate
  const calculateGrowthRate = (history: { timestamp: number; size: number }[]): string => {
    if (history.length < 2) return '0%';
    
    const oldest = history[history.length - 1];
    const newest = history[0];
    const growth = newest.size - oldest.size;
    const growthPercent = (growth / oldest.size) * 100;
    
    return `${growthPercent > 0 ? '+' : ''}${growthPercent.toFixed(2)}%`;
  };

  // Get composition analysis
  const getCompositionAnalysis = (report: any) => {
    if (!report) return { chunkPercentages: [], largestChunks: [], optimizationOpportunities: [], duplicatePackages: [] };
    
    const totalSize = report.totalSize;
    const chunkPercentages = report.chunks.map((chunk: any) => ({
      ...chunk,
      percentage: (chunk.size / totalSize) * 100
    }));

    const largestChunks = [...chunkPercentages]
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 5);

    const optimizationOpportunities = report.chunks.filter((chunk: any) => {
      return (chunk.size / totalSize) > 0.2; // Chunks larger than 20%
    });

    return {
      chunkPercentages,
      largestChunks,
      optimizationOpportunities,
      duplicatePackages: report.duplicatePackages
    };
  };

  // Handle config changes
  const handleConfigChange = (field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle notification channel toggle
  const toggleNotificationChannel = (channel: string) => {
    setConfig((prev: any) => {
      const newChannels = [...prev.notificationChannels];
      const index = newChannels.indexOf(channel);

      if (index > -1) {
        newChannels.splice(index, 1);
      } else {
        newChannels.push(channel);
      }

      return {
        ...prev,
        notificationChannels: newChannels
      };
    });
  };

  // Save configuration
  const saveConfig = () => {
    setBundleMonitoringConfig(config);
    alert('Configuration saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!latestReport) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-foreground mb-2">No bundle reports available</h3>
        <p className="text-foreground/80">Bundle analysis data will appear here once generated</p>
      </div>
    );
  }

  const composition = getCompositionAnalysis(latestReport);
  const growthRate = calculateGrowthRate(latestReport.sizeHistory);

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Bundle Monitoring Dashboard</h2>
            <p className="text-foreground/80 mt-1">Monitor and optimize your application bundle size</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-foreground/60">Last Updated</p>
              <p className="text-foreground/80">{new Date(latestReport.timestamp).toLocaleString()}</p>
            </div>
            <button 
              onClick={saveConfig}
              className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90"
            >
              Save Config
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-foreground/10">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Bundle Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(latestReport.totalSize)}</p>
          <p className="text-xs text-foreground/60">Uncompressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Gzipped Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(latestReport.totalGzipSize)}</p>
          <p className="text-xs text-foreground/60">Compressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Growth Rate</h3>
          <p className={`text-2xl font-bold ${parseFloat(growthRate) > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {growthRate}
          </p>
          <p className="text-xs text-foreground/60">Last 7 days</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Chunks</h3>
          <p className="text-2xl font-bold text-foreground">{latestReport.chunks.length}</p>
          <p className="text-xs text-foreground/60">Files</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'chunks', 'assets', 'history', 'optimization'] as const).map(tab => (
            <button
              key={tab}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === tab
                  ? 'text-gold border-b-2 border-gold'
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
            {/* Bundle Size Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bundle Size Trend</h3>
              <div className="h-64 bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="flex items-end h-full space-x-1">
                  {latestReport.sizeHistory.map((entry: any, index: number) => {
                    const max = Math.max(...latestReport.sizeHistory.map((e: any) => e.size));
                    const height = (entry.size / max) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-foreground/60 mt-1">
                          {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Chunk Distribution */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Chunk Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {composition.largestChunks.map((chunk: any, index: number) => (
                  <div key={index} className="border border-foreground/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{chunk.name}</h4>
                      <span className="text-foreground/80">{formatBytes(chunk.size)}</span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2.5">
                      <div 
                        className="bg-gold h-2.5 rounded-full" 
                        style={{ width: `${chunk.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-foreground/60 mt-1">
                      {chunk.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Opportunities */}
            {composition.optimizationOpportunities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Optimization Opportunities</h3>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-500 font-medium mb-2">Large chunks detected:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {composition.optimizationOpportunities.map((chunk: any, index: number) => (
                      <li key={index} className="text-foreground/80">
                        <span className="font-medium">{chunk.name}</span> ({formatBytes(chunk.size)}) is {(chunk.size / latestReport.totalSize * 100).toFixed(1)}% of total bundle
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-foreground/80">
                    Consider code splitting or lazy loading for these large chunks to improve initial load time.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chunks Tab */}
        {activeTab === 'chunks' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Chunks</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Chunk Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Gzipped Size</th>
                    <th className="text-left py-2 px-4">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReport.chunks.map((chunk: any, index: number) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-medium">{chunk.name}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.size)}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.gzipSize)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-32 bg-foreground/10 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${(chunk.size / latestReport.totalSize) * 100}%` }}
                            ></div>
                          </div>
                          <span>{((chunk.size / latestReport.totalSize) * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle Assets</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Asset Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Chunk</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReport.assets.map((asset: any, index: number) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4">{asset.name}</td>
                      <td className="py-3 px-4">{formatBytes(asset.size)}</td>
                      <td className="py-3 px-4">{asset.chunkId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bundle History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Total Size</th>
                    <th className="text-left py-2 px-4">Gzipped Size</th>
                    <th className="text-left py-2 px-4">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReport.sizeHistory.map((entry: any, index: number) => {
                    const prevEntry = index < latestReport.sizeHistory.length - 1 
                      ? latestReport.sizeHistory[index + 1] 
                      : null;
                    const growth = prevEntry 
                      ? ((entry.size - prevEntry.size) / prevEntry.size) * 100 
                      : 0;
                    
                    return (
                      <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                        <td className="py-3 px-4">{new Date(entry.timestamp).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{formatBytes(entry.size)}</td>
                        <td className="py-3 px-4">-</td>
                        <td className={`py-3 px-4 font-medium ${
                          growth > 0 ? 'text-red-500' : growth < 0 ? 'text-green-500' : 'text-foreground/60'
                        }`}>
                          {growth > 0 ? '+' : ''}{growth.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-4">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium text-foreground mb-2">Duplicate Packages</h4>
                {latestReport.duplicatePackages.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {latestReport.duplicatePackages.map((pkg: string, index: number) => (
                      <li key={index} className="text-foreground/80">
                        {pkg} - Appears in multiple chunks causing bundle bloat
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-500">No duplicate packages detected</p>
                )}
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {latestReport.optimizationSuggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-foreground/80">{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h4 className="font-medium text-foreground mb-2">Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Size Threshold</label>
                    <div className="flex">
                      <input
                        type="number"
                        value={config.maxSizeThreshold / 1024 / 1024} // Convert to MB for display
                        onChange={(e) => handleConfigChange('maxSizeThreshold', parseFloat(e.target.value) * 1024 * 1024)}
                        className="flex-1 p-2 bg-foreground/10 border border-foreground/20 rounded-l"
                      />
                      <span className="px-3 py-2 bg-foreground/10 border-y border-foreground/20">MB</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Gzip Size Threshold</label>
                    <div className="flex">
                      <input
                        type="number"
                        value={config.maxGzipSizeThreshold / 1024} // Convert to KB for display
                        onChange={(e) => handleConfigChange('maxGzipSizeThreshold', parseFloat(e.target.value) * 1024)}
                        className="flex-1 p-2 bg-foreground/10 border border-foreground/20 rounded-l"
                      />
                      <span className="px-3 py-2 bg-foreground/10 border-y border-foreground/20">KB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleMonitoringDashboard;