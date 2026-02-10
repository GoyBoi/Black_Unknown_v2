// components/BundleAnalysisDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define types for bundle analysis
interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  assets: BundleAsset[];
}

interface BundleAsset {
  name: string;
  size: number; // in bytes
  chunkId: string;
}

interface BundleAnalysisData {
  totalSize: number;
  totalGzipSize: number;
  chunks: BundleChunk[];
  duplicatePackages: string[];
  optimizationSuggestions: string[];
}

const BundleAnalysisDashboard = () => {
  const [analysisData, setAnalysisData] = useState<BundleAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'build' | 'week' | 'month'>('build');

  // Mock function to get bundle analysis data (in a real implementation, this would come from an API)
  useEffect(() => {
    const loadBundleAnalysis = () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // In a real implementation, this would fetch from an API
        // For now, we'll create mock data
        const mockData: BundleAnalysisData = {
          totalSize: 1245678, // ~1.2MB
          totalGzipSize: 345678, // ~345KB
          chunks: [
            {
              id: 'main',
              name: 'main.js',
              size: 456789,
              gzipSize: 123456,
              assets: [
                { name: 'react.js', size: 120000, chunkId: 'main' },
                { name: 'react-dom.js', size: 110000, chunkId: 'main' },
                { name: 'app.js', size: 100000, chunkId: 'main' },
                { name: 'styles.css', size: 50000, chunkId: 'main' },
                { name: 'utils.js', size: 76789, chunkId: 'main' },
              ]
            },
            {
              id: 'vendors',
              name: 'vendors.js',
              size: 320000,
              gzipSize: 89000,
              assets: [
                { name: '@heroicons/react.js', size: 45000, chunkId: 'vendors' },
                { name: 'lucide-react.js', size: 35000, chunkId: 'vendors' },
                { name: 'next.js', size: 120000, chunkId: 'vendors' },
                { name: 'other-vendor.js', size: 120000, chunkId: 'vendors' },
              ]
            },
            {
              id: 'ui-libraries',
              name: 'ui-libraries.js',
              size: 150000,
              gzipSize: 45000,
              assets: [
                { name: 'header.js', size: 30000, chunkId: 'ui-libraries' },
                { name: 'footer.js', size: 25000, chunkId: 'ui-libraries' },
                { name: 'product-card.js', size: 45000, chunkId: 'ui-libraries' },
                { name: 'cart.js', size: 50000, chunkId: 'ui-libraries' },
              ]
            },
            {
              id: 'pages-home',
              name: 'pages-home.js',
              size: 180000,
              gzipSize: 55000,
              assets: [
                { name: 'home-page.js', size: 100000, chunkId: 'pages-home' },
                { name: 'hero-section.js', size: 80000, chunkId: 'pages-home' },
              ]
            },
            {
              id: 'pages-shop',
              name: 'pages-shop.js',
              size: 138889,
              gzipSize: 33222,
              assets: [
                { name: 'shop-page.js', size: 70000, chunkId: 'pages-shop' },
                { name: 'product-grid.js', size: 68889, chunkId: 'pages-shop' },
              ]
            }
          ],
          duplicatePackages: ['react', 'react-dom'],
          optimizationSuggestions: [
            'Split vendor bundle to reduce main bundle size',
            'Implement code splitting for pages',
            'Remove unused CSS',
            'Compress images further',
            'Consider dynamic imports for non-critical components'
          ]
        };
        
        setAnalysisData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    loadBundleAnalysis();
  }, [timeRange]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate percentage
  const calculatePercentage = (part: number, total: number): number => {
    return Math.round((part / total) * 100);
  };

  // Get color based on size
  const getSizeColor = (size: number): string => {
    if (size > 300000) return 'text-red-500'; // > 300KB
    if (size > 150000) return 'text-yellow-500'; // > 150KB
    return 'text-green-500'; // < 150KB
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bundle Analysis Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('build')}
            className={`px-3 py-1 rounded ${timeRange === 'build' ? 'bg-gold text-black' : 'bg-foreground/10'}`}
          >
            Current Build
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
      ) : analysisData ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Total Bundle Size</h3>
              <p className="text-2xl font-bold text-foreground">{formatBytes(analysisData.totalSize)}</p>
              <p className="text-xs text-foreground/60">Uncompressed</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Gzipped Size</h3>
              <p className="text-2xl font-bold text-foreground">{formatBytes(analysisData.totalGzipSize)}</p>
              <p className="text-xs text-foreground/60">Compressed</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Number of Chunks</h3>
              <p className="text-2xl font-bold text-foreground">{analysisData.chunks.length}</p>
              <p className="text-xs text-foreground/60">Files</p>
            </div>
            <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
              <h3 className="text-foreground/60 text-sm">Duplicate Packages</h3>
              <p className="text-2xl font-bold text-red-500">{analysisData.duplicatePackages.length}</p>
              <p className="text-xs text-foreground/60">Issues</p>
            </div>
          </div>

          {/* Chunk Analysis */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Bundle Composition</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-foreground/20">
                    <th className="text-left py-2 px-4">Chunk Name</th>
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Gzipped</th>
                    <th className="text-left py-2 px-4">Percentage</th>
                    <th className="text-left py-2 px-4">Assets</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.chunks.map((chunk) => (
                    <tr key={chunk.id} className="border-b border-foreground/10 hover:bg-foreground/5">
                      <td className="py-3 px-4 font-medium">{chunk.name}</td>
                      <td className={`py-3 px-4 font-medium ${getSizeColor(chunk.size)}`}>
                        {formatBytes(chunk.size)}
                      </td>
                      <td className={`py-3 px-4 font-medium ${getSizeColor(chunk.gzipSize)}`}>
                        {formatBytes(chunk.gzipSize)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-foreground/20 rounded-full h-2">
                          <div 
                            className="bg-gold h-2 rounded-full" 
                            style={{ width: `${calculatePercentage(chunk.size, analysisData.totalSize)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-foreground/80">{calculatePercentage(chunk.size, analysisData.totalSize)}%</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {chunk.assets.slice(0, 3).map((asset, idx) => (
                            <span key={idx} className="text-xs bg-foreground/10 px-2 py-1 rounded">
                              {asset.name}
                            </span>
                          ))}
                          {chunk.assets.length > 3 && (
                            <span className="text-xs text-foreground/60">+{chunk.assets.length - 3} more</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Duplicate Packages */}
          {analysisData.duplicatePackages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Duplicate Packages Found</h3>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {analysisData.duplicatePackages.map((pkg, index) => (
                    <li key={index} className="text-red-500">
                      <span className="font-medium">{pkg}</span> appears in multiple chunks
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-foreground/80">
                  Duplicate packages increase bundle size. Consider deduplicating with webpack's splitChunks configuration.
                </p>
              </div>
            </div>
          )}

          {/* Optimization Suggestions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-3">
              {analysisData.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start p-3 bg-foreground/5 rounded-lg border border-foreground/10">
                  <div className="mr-3 mt-1">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                  </div>
                  <p>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Download Report Button */}
          <div className="mt-8 flex justify-end">
            <button className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90">
              Download Bundle Report
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-foreground/60">
          <p>Unable to load bundle analysis data</p>
        </div>
      )}
    </div>
  );
};

export default BundleAnalysisDashboard;