// components/BundleOptimizationAdvisor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  analyzeBundle,
  getBundleOptimizationRecommendations,
  formatBytes,
  calculatePotentialSavings,
  generateBundleOptimizationReport,
  generateMockBundleAnalysis,
  BundleAnalysis,
  BundleOptimizationSuggestion
} from '@/lib/bundle-optimization-advisor';

const BundleOptimizationAdvisor = () => {
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<BundleOptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'chunks' | 'assets'>('overview');
  const [selectedSuggestion, setSelectedSuggestion] = useState<BundleOptimizationSuggestion | null>(null);

  // Load bundle analysis
  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll generate mock data
      const mockAnalysis = generateMockBundleAnalysis();
      setAnalysis(mockAnalysis);
      
      const recs = getBundleOptimizationRecommendations(mockAnalysis);
      setRecommendations(recs);
      
      setIsLoading(false);
    };

    loadAnalysis();
  }, []);

  // Calculate potential savings
  const potentialSavings = recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-foreground/60';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-500';
      default: return 'bg-foreground/10 text-foreground/60';
    }
  };

  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-foreground/60';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12 text-foreground/60">
        <p>Unable to load bundle analysis data</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground rounded-lg border border-foreground/10">
      <div className="p-6 border-b border-foreground/10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Bundle Optimization Advisor</h2>
            <p className="text-foreground/80 mt-1">Analyze and optimize your application bundle size</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-foreground/60">Last analyzed</p>
              <p className="text-foreground/80">{new Date(analysis.timestamp).toLocaleString()}</p>
            </div>
            <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90">
              Run New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-b border-foreground/10">
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Total Bundle Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analysis.totalSize)}</p>
          <p className="text-xs text-foreground/60">Uncompressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Gzipped Size</h3>
          <p className="text-2xl font-bold text-foreground">{formatBytes(analysis.totalGzipSize)}</p>
          <p className="text-xs text-foreground/60">Compressed</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Performance Score</h3>
          <p className={`text-2xl font-bold ${
            analysis.performanceScore >= 90 ? 'text-green-500' : 
            analysis.performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {analysis.performanceScore}/100
          </p>
          <p className="text-xs text-foreground/60">Bundle health</p>
        </div>
        <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
          <h3 className="text-foreground/60 text-sm">Potential Savings</h3>
          <p className="text-2xl font-bold text-gold">{formatBytes(potentialSavings)}</p>
          <p className="text-xs text-foreground/60">Through optimizations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-foreground/10">
        <div className="flex space-x-6 px-6">
          {(['overview', 'recommendations', 'chunks', 'assets'] as const).map(tab => (
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
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Bundle Composition</h3>
              <div className="bg-foreground/5 rounded-lg border border-foreground/10 p-4">
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analysis.chunks.map((chunk, index) => {
                    const percentage = (chunk.size / analysis.totalSize) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gold rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${percentage}%` }}
                        ></div>
                        <div className="text-xs text-foreground/80 mt-2 text-center">
                          {chunk.name.replace('.js', '')}<br/>
                          {formatBytes(chunk.size)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="font-semibold mb-3">Duplicate Packages</h3>
                {analysis.duplicatePackages.length > 0 ? (
                  <ul className="space-y-2">
                    {analysis.duplicatePackages.map((pkg, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-foreground">{pkg}</span>
                        <span className="text-red-500 font-medium">Duplicate</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-500">No duplicate packages detected</p>
                )}
              </div>

              <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                <h3 className="font-semibold mb-3">Optimization Potential</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">Current Size</span>
                      <span className="font-medium">{formatBytes(analysis.totalSize)}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div 
                        className="bg-gold h-2 rounded-full" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground/80">After Optimizations</span>
                      <span className="font-medium">{formatBytes(analysis.totalSize - potentialSavings)}</span>
                    </div>
                    <div className="w-full bg-foreground/20 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${((analysis.totalSize - potentialSavings) / analysis.totalSize) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-center text-gold font-medium">
                      Potential savings: {formatBytes(potentialSavings)} ({((potentialSavings / analysis.totalSize) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Optimization Recommendations</h3>
            
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="border border-foreground/20 rounded-lg p-4 hover:bg-foreground/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedSuggestion(rec)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(rec.priority)}`}>
                            {rec.priority}
                          </span>
                          <span className={`text-sm ${getImpactColor(rec.impact)}`}>
                            {rec.impact} impact
                          </span>
                          <span className="text-sm text-gold">
                            Save {formatBytes(rec.estimatedSavings)}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground">{rec.title}</h4>
                        <p className="text-foreground/80 mt-1">{rec.description}</p>
                      </div>
                      <button className="text-foreground/60 hover:text-foreground">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-foreground/60">
                <p>No optimization recommendations at this time. Your bundle is well-optimized!</p>
              </div>
            )}
          </div>
        )}

        {/* Chunks Tab */}
        {activeTab === 'chunks' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Bundle Chunks</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Chunk Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Assets</th>
                    <th className="text-left py-2 px-4">Dependencies</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.chunks.map((chunk, index) => (
                    <tr key={index} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-medium">{chunk.name}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.size)}</td>
                      <td className="py-3 px-4">{formatBytes(chunk.gzipSize)}</td>
                      <td className="py-3 px-4">{chunk.assets.length}</td>
                      <td className="py-3 px-4">{chunk.dependencies.length}</td>
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
            <h3 className="text-xl font-semibold mb-4">Bundle Assets</h3>
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
                  {analysis.assets.map((asset, index) => (
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
      </div>

      {/* Recommendation Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-foreground/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Optimization Recommendation</h3>
                <button 
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground/80 mb-1">Title</h4>
                  <p className="text-foreground">{selectedSuggestion.title}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80 mb-1">Description</h4>
                  <p className="text-foreground">{selectedSuggestion.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Priority</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(selectedSuggestion.priority)}`}>
                      {selectedSuggestion.priority}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Impact</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedSuggestion.impact === 'high' ? 'bg-red-500/20 text-red-500' : 
                      selectedSuggestion.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                    }`}>
                      {selectedSuggestion.impact}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80 mb-1">Estimated Savings</h4>
                  <p className="text-foreground font-medium">{formatBytes(selectedSuggestion.estimatedSavings)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/80 mb-1">Implementation Effort</h4>
                  <p className="text-foreground capitalize">{selectedSuggestion.implementationEffort}</p>
                </div>
                
                {selectedSuggestion.details && (
                  <div>
                    <h4 className="font-semibold text-foreground/80 mb-1">Details</h4>
                    <pre className="bg-foreground/5 p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedSuggestion.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/10"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-gold/90">
                  Apply Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleOptimizationAdvisor;