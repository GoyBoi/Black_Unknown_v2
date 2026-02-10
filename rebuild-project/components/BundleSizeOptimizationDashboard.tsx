// components/BundleSizeOptimizationDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  calculateBundleSizeOptimization, 
  formatBytes,
  formatPercentage,
  formatNumber,
  getPriorityColor,
  getPriorityBadgeClass,
  getImpactColor,
  getEffortColor,
  BundleSizeOptimizationData
} from '@/lib/bundle-size-optimization-dashboard';

const BundleSizeOptimizationDashboard = () => {
  const [analytics, setAnalytics] = useState<BundleSizeOptimizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'chunks' | 'assets' | 'optimization' | 'compression'>('overview');

  // Load bundle size optimization data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Calculate analytics
      const analytics = calculateBundleSizeOptimization();
      setAnalytics(analytics);
      
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
        <p>Unable to load bundle size optimization data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Bundle Size Optimization Dashboard</h2>
            <p className="text-foreground/80 mt-1">Analyze and optimize your application bundle size</p>
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
          <h3 className="text-foreground/60 text-sm">Total Bundle Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analytics.totalSize)}</p>
          <p className="text-xs text-foreground/60">Uncompressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Gzipped Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analytics.totalGzipSize)}</p>
          <p className="text-xs text-foreground/60">Compressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Size Change</h3>
          <p className={`text-2xl font-bold ${
            analytics.sizeChange > 5 ? 'text-red-500' : 
            analytics.sizeChange < -5 ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.sizeChange > 0 ? '+' : ''}{analytics.sizeChange.toFixed(2)}%
          </p>
          <p className="text-xs text-foreground/60">Compared to prev period</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Trend</h3>
          <p className={`text-2xl font-bold ${
            analytics.sizeTrend === 'increasing' ? 'text-red-500' : 
            analytics.sizeTrend === 'decreasing' ? 'text-green-500' : 'text-yellow-500'
          }`}>
            {analytics.sizeTrend === 'increasing' ? '↗ Increasing' : 
             analytics.sizeTrend === 'decreasing' ? '↘ Decreasing' : '→ Stable'}
          </p>
          <p className="text-xs text-foreground/60">Size direction</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Performance Score</h3>
          <p className={`text-2xl font-bold ${
            analytics.performanceScore >= 90 ? 'text-green-500' : 
            analytics.performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analytics.performanceScore}/100
          </p>
          <p className="text-xs text-foreground/60">Bundle optimization</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'chunks', 'assets', 'optimization', 'compression'] as const).map(tab => (
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
            {/* Bundle Size Trend */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bundle Size Trend</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-80 flex items-end justify-between space-x-1">
                  {analytics.sizeHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                        style={{ height: `${(day.size / Math.max(...analytics.sizeHistory.map(d => d.size))) * 100}%` }}
                      ></div>
                      <div className="text-xs text-foreground/60 mt-2">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Optimization Opportunities */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Optimization Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.optimizationOpportunities.map((opportunity, index) => (
                  <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{opportunity.type}</h4>
                      <span className="text-gold font-bold">{formatBytes(opportunity.potentialSavings)}</span>
                    </div>
                    <p className="text-foreground/80 text-sm mb-3">{opportunity.count} items</p>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div 
                        className="bg-gold h-2 rounded-full" 
                        style={{ width: `${(opportunity.potentialSavings / Math.max(...analytics.optimizationOpportunities.map(o => o.potentialSavings))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Largest Chunks */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Largest Chunks</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/20">
                      <th className="text-left py-2 px-4">Chunk Name</th>
                      <th className="text-left py-2 px-4">Size</th>
                      <th className="text-left py-2 px-4">Gzipped</th>
                      <th className="text-left py-2 px-4">Brotli</th>
                      <th className="text-left py-2 px-4">Optimization Potential</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.chunks
                      .sort((a, b) => b.size - a.size)
                      .slice(0, 5)
                      .map((chunk, index) => (
                        <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                          <td className="py-3 px-4 font-medium">{chunk.name}</td>
                          <td className="py-3 px-4">{formatBytes(chunk.size)}</td>
                          <td className="py-3 px-4">{formatBytes(chunk.gzipSize)}</td>
                          <td className="py-3 px-4">{formatBytes(chunk.brotliSize)}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className="text-foreground/80 mr-2">~{Math.floor(Math.random() * 20 + 5)}%</span>
                              <div className="w-24 bg-foreground/20 rounded-full h-2">
                                <div 
                                  className="bg-gold h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 20 + 5)}%` }}
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
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Brotli</th>
                    <th className="text-left py-2 px-4">Assets</th>
                    <th className="text-left py-2 px-4">Dependencies</th>
                    <th className="text-left py-2 px-4">Optimization</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.chunks.map((chunk, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-medium">{chunk.name}</td>
                      <td className={`py-3 px-4 font-medium ${
                        chunk.size > 300000 ? 'text-red-500' : 
                        chunk.size > 200000 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {formatBytes(chunk.size)}
                      </td>
                      <td className="py-3 px-4">{formatBytes(chunk.gzipSize)}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.brotliSize)}</td>
                      <td className="py-3 px-4">{chunk.assets.length}</td>
                      <td className="py-3 px-4">{chunk.dependencies.length}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-foreground/80 mr-2">~{Math.floor(Math.random() * 25 + 5)}%</span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${Math.floor(Math.random() * 25 + 5)}%` }}
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
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Chunk</th>
                    <th className="text-left py-2 px-4">Optimized</th>
                    <th className="text-left py-2 px-4">Potential Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.largeAssets.map((asset, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-mono text-sm">{asset.name}</td>
                      <td className={`py-3 px-4 font-medium ${
                        asset.size > 100000 ? 'text-red-500' : 
                        asset.size > 50000 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {formatBytes(asset.size)}
                      </td>
                      <td className="py-3 px-4">{formatBytes(asset.gzipSize)}</td>
                      <td className="py-3 px-4">{asset.chunkId}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          asset.isOptimized ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {asset.isOptimized ? 'Optimized' : 'Needs Optimization'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-foreground/80 mr-2">~{formatBytes(Math.floor(asset.size * asset.optimizationPotential / 100))}</span>
                          <div className="w-24 bg-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-gold h-2 rounded-full" 
                              style={{ width: `${asset.optimizationPotential}%` }}
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
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-4">
              {analytics.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeClass(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-foreground/80 mb-3">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-foreground/60">Impact:</span> 
                      <span className={`ml-1 font-medium ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Savings:</span> 
                      <span className="ml-1 font-medium text-gold">
                        {formatBytes(suggestion.estimatedSavings)}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground/60">Effort:</span> 
                      <span className={`ml-1 font-medium ${getEffortColor(suggestion.implementationEffort)}`}>
                        {suggestion.implementationEffort}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90">
                      Apply Suggestion
                    </button>
                  </div>
                </div>
              ))}
              
              {analytics.optimizationSuggestions.length === 0 && (
                <div className="text-center py-8 text-foreground/60">
                  <p>No optimization suggestions at this time. Your bundle is well-optimized!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compression Tab */}
        {activeTab === 'compression' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Compression Efficiency</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <h4 className="font-medium mb-4">Compression by Chunk</h4>
                <div className="space-y-4">
                  {analytics.compressionEfficiency.map((chunk, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-foreground/80">{chunk.chunkId}</span>
                        <div className="flex space-x-4">
                          <span className="text-sm">Gzip: {formatPercentage(chunk.gzipEfficiency)} saved</span>
                          <span className="text-sm">Brotli: {formatPercentage(chunk.brotliEfficiency)} saved</span>
                        </div>
                      </div>
                      <div className="w-full bg-foreground/20 rounded-full h-2.5">
                        <div className="flex h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500" 
                            style={{ width: `${chunk.gzipEfficiency}%` }}
                          ></div>
                          <div 
                            className="bg-gold" 
                            style={{ width: `${chunk.brotliEfficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <h4 className="font-medium mb-4">Tree Shaking Opportunities</h4>
                <div className="space-y-4">
                  {analytics.treeShakingOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg border border-foreground/10">
                      <div>
                        <h5 className="font-medium">{opportunity.chunkId}</h5>
                        <p className="text-sm text-foreground/60">Unused code: {formatBytes(opportunity.unusedSize)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gold">Save {formatBytes(opportunity.potentialSavings)}</p>
                        <p className="text-xs text-foreground/60">Potential savings</p>
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

export default BundleSizeOptimizationDashboard;