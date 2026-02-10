// lib/bundle-optimization-advisor.ts

// Define types for bundle optimization
export interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  assets: BundleAsset[];
  dependencies: string[];
}

export interface BundleAsset {
  name: string;
  size: number; // in bytes
  chunkId: string;
}

export interface BundleAnalysis {
  id: string;
  timestamp: number;
  totalSize: number;
  totalGzipSize: number;
  chunks: BundleChunk[];
  assets: BundleAsset[];
  duplicatePackages: string[];
  optimizationSuggestions: BundleOptimizationSuggestion[];
  performanceScore: number; // 0-100
  sizeHistory: { timestamp: number; size: number }[];
}

export interface BundleOptimizationSuggestion {
  id: string;
  type: 'duplicate-package' | 'large-chunk' | 'unused-code' | 'unoptimized-asset' | 'missing-compression';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low'; // Potential size reduction
  estimatedSavings: number; // Estimated bytes savings
  implementationEffort: 'low' | 'medium' | 'high'; // Effort to implement
  details: {
    packageName?: string;
    chunkName?: string;
    assetName?: string;
    currentSize: number;
    recommendedSize?: number;
  };
}

// In-memory storage for bundle analyses (in production, this would be in a database)
const bundleAnalyses: BundleAnalysis[] = [];

// Function to add a bundle analysis
export const addBundleAnalysis = (analysis: Omit<BundleAnalysis, 'id' | 'timestamp'>): BundleAnalysis => {
  const newAnalysis: BundleAnalysis = {
    ...analysis,
    id: `bundle_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  bundleAnalyses.unshift(newAnalysis);

  // Keep only the last 50 analyses to prevent memory issues
  if (bundleAnalyses.length > 50) {
    bundleAnalyses.length = 50;
  }

  return newAnalysis;
};

// Function to get all bundle analyses
export const getBundleAnalyses = (limit?: number): BundleAnalysis[] => {
  return limit ? bundleAnalyses.slice(0, limit) : [...bundleAnalyses];
};

// Function to get the latest bundle analysis
export const getLatestBundleAnalysis = (): BundleAnalysis | undefined => {
  return bundleAnalyses[0];
};

// Function to analyze a bundle and generate optimization suggestions
export const analyzeBundle = (bundleData: {
  chunks: BundleChunk[];
  assets: BundleAsset[];
}): BundleAnalysis => {
  const totalSize = bundleData.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalGzipSize = bundleData.chunks.reduce((sum, chunk) => sum + chunk.gzipSize, 0);
  
  // Find duplicate packages
  const packageOccurrences: Record<string, { count: number; chunks: string[] }> = {};
  bundleData.chunks.forEach(chunk => {
    chunk.dependencies.forEach(pkg => {
      if (!packageOccurrences[pkg]) {
        packageOccurrences[pkg] = { count: 0, chunks: [] };
      }
      packageOccurrences[pkg].count++;
      packageOccurrences[pkg].chunks.push(chunk.name);
    });
  });
  
  const duplicatePackages = Object.entries(packageOccurrences)
    .filter(([_, info]) => info.count > 1)
    .map(([pkg, _]) => pkg);
  
  // Generate optimization suggestions
  const suggestions: BundleOptimizationSuggestion[] = [];
  
  // Suggest splitting large chunks
  bundleData.chunks.forEach(chunk => {
    if (chunk.size > 200000) { // Larger than 200KB
      suggestions.push({
        id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: 'large-chunk',
        priority: 'high',
        title: `Split Large Chunk: ${chunk.name}`,
        description: `The chunk "${chunk.name}" is ${formatBytes(chunk.size)}, which is quite large. Consider code splitting to improve initial load time.`,
        impact: 'high',
        estimatedSavings: Math.floor(chunk.size * 0.3), // Estimate 30% savings
        implementationEffort: 'medium',
        details: {
          chunkName: chunk.name,
          currentSize: chunk.size
        }
      });
    }
  });
  
  // Suggest removing duplicate packages
  duplicatePackages.forEach(pkg => {
    const info = packageOccurrences[pkg];
    suggestions.push({
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'duplicate-package',
      priority: 'high',
      title: `Remove Duplicate Package: ${pkg}`,
      description: `The package "${pkg}" appears in ${info.count} different chunks: ${info.chunks.join(', ')}. This increases bundle size unnecessarily.`,
      impact: 'high',
      estimatedSavings: Math.floor(info.count * 50000), // Estimate 50KB per duplicate
      implementationEffort: 'medium',
      details: {
        packageName: pkg,
        currentSize: info.count * 50000 // Rough estimate
      }
    });
  });
  
  // Suggest optimizing large assets
  bundleData.assets.forEach(asset => {
    if (asset.size > 100000) { // Larger than 100KB
      suggestions.push({
        id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: 'unoptimized-asset',
        priority: 'medium',
        title: `Optimize Large Asset: ${asset.name}`,
        description: `The asset "${asset.name}" is ${formatBytes(asset.size)}. Consider compressing or optimizing this asset.`,
        impact: 'medium',
        estimatedSavings: Math.floor(asset.size * 0.4), // Estimate 40% savings
        implementationEffort: 'low',
        details: {
          assetName: asset.name,
          currentSize: asset.size
        }
      });
    }
  });
  
  // Calculate performance score (0-100)
  let score = 100;
  
  // Deduct points for large total size (>1MB)
  if (totalSize > 1048576) { // 1MB
    score -= Math.min(30, Math.floor((totalSize - 1048576) / 104857)); // Up to 30 points deduction
  }
  
  // Deduct points for duplicate packages
  score -= Math.min(20, duplicatePackages.length * 5); // Up to 20 points deduction
  
  // Deduct points for large chunks
  const largeChunks = bundleData.chunks.filter(chunk => chunk.size > 300000).length;
  score -= Math.min(25, largeChunks * 5); // Up to 25 points deduction
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  return {
    id: `bundle_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    totalSize,
    totalGzipSize,
    chunks: bundleData.chunks,
    assets: bundleData.assets,
    duplicatePackages,
    optimizationSuggestions: suggestions,
    performanceScore: score,
    sizeHistory: [
      { timestamp: Date.now(), size: totalSize }
    ]
  };
};

// Function to get bundle optimization recommendations
export const getBundleOptimizationRecommendations = (analysis: BundleAnalysis): BundleOptimizationSuggestion[] => {
  // Sort suggestions by priority and impact
  return [...analysis.optimizationSuggestions]
    .sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      // Then by impact (high > medium > low)
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
};

// Function to format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to calculate size reduction potential
export const calculatePotentialSavings = (suggestions: BundleOptimizationSuggestion[]): number => {
  return suggestions.reduce((sum, suggestion) => sum + suggestion.estimatedSavings, 0);
};

// Function to generate a bundle optimization report
export const generateBundleOptimizationReport = (analysis: BundleAnalysis): string => {
  const recommendations = getBundleOptimizationRecommendations(analysis);
  const potentialSavings = calculatePotentialSavings(recommendations);
  
  let report = `Bundle Optimization Report\n`;
  report += `=========================\n\n`;
  report += `Date: ${new Date(analysis.timestamp).toLocaleString()}\n`;
  report += `Total Bundle Size: ${formatBytes(analysis.totalSize)}\n`;
  report += `Gzipped Size: ${formatBytes(analysis.totalGzipSize)}\n`;
  report += `Performance Score: ${analysis.performanceScore}/100\n\n`;
  
  report += `Optimization Recommendations:\n`;
  report += `----------------------------\n`;
  
  if (recommendations.length === 0) {
    report += `No optimizations needed. Your bundle is well-optimized!\n`;
  } else {
    recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec.title}\n`;
      report += `   Priority: ${rec.priority}\n`;
      report += `   Impact: ${rec.impact}\n`;
      report += `   Estimated Savings: ${formatBytes(rec.estimatedSavings)}\n`;
      report += `   Description: ${rec.description}\n\n`;
    });
  }
  
  report += `Potential Total Savings: ${formatBytes(potentialSavings)}\n`;
  report += `Estimated New Size: ${formatBytes(analysis.totalSize - potentialSavings)}\n`;
  
  return report;
};

// Function to simulate bundle analysis for demo purposes
export const generateMockBundleAnalysis = (): BundleAnalysis => {
  const chunks: BundleChunk[] = [
    {
      id: 'main',
      name: 'main.js',
      size: 450000,
      gzipSize: 120000,
      assets: [
        { name: 'react.js', size: 120000, chunkId: 'main' },
        { name: 'react-dom.js', size: 110000, chunkId: 'main' },
        { name: 'app.js', size: 100000, chunkId: 'main' },
        { name: 'utils.js', size: 70000, chunkId: 'main' },
        { name: 'styles.css', size: 50000, chunkId: 'main' },
      ],
      dependencies: ['react', 'react-dom', 'next', 'lucide-react']
    },
    {
      id: 'vendors',
      name: 'vendors.js',
      size: 320000,
      gzipSize: 90000,
      assets: [
        { name: '@heroicons/react.js', size: 45000, chunkId: 'vendors' },
        { name: 'lucide-react.js', size: 35000, chunkId: 'vendors' },
        { name: 'next.js', size: 120000, chunkId: 'vendors' },
        { name: 'other-vendor.js', size: 120000, chunkId: 'vendors' },
      ],
      dependencies: ['@heroicons/react', 'lucide-react', 'next']
    },
    {
      id: 'ui-libraries',
      name: 'ui-libraries.js',
      size: 180000,
      gzipSize: 50000,
      assets: [
        { name: 'header.js', size: 30000, chunkId: 'ui-libraries' },
        { name: 'footer.js', size: 25000, chunkId: 'ui-libraries' },
        { name: 'product-card.js', size: 45000, chunkId: 'ui-libraries' },
        { name: 'cart.js', size: 80000, chunkId: 'ui-libraries' },
      ],
      dependencies: ['@headlessui/react', 'framer-motion']
    },
    {
      id: 'pages-home',
      name: 'pages-home.js',
      size: 150000,
      gzipSize: 45000,
      assets: [
        { name: 'home-page.js', size: 100000, chunkId: 'pages-home' },
        { name: 'hero-section.js', size: 50000, chunkId: 'pages-home' },
      ],
      dependencies: ['swiper', 'aos']
    },
    {
      id: 'pages-shop',
      name: 'pages-shop.js',
      size: 130000,
      gzipSize: 35000,
      assets: [
        { name: 'shop-page.js', size: 70000, chunkId: 'pages-shop' },
        { name: 'product-grid.js', size: 60000, chunkId: 'pages-shop' },
      ],
      dependencies: ['react-infinite-scroll-component', 'react-rating']
    }
  ];
  
  const assets: BundleAsset[] = [
    { name: 'react.js', size: 120000, chunkId: 'main' },
    { name: 'react-dom.js', size: 110000, chunkId: 'main' },
    { name: 'app.js', size: 100000, chunkId: 'main' },
    { name: 'utils.js', size: 70000, chunkId: 'main' },
    { name: 'styles.css', size: 50000, chunkId: 'main' },
    { name: '@heroicons/react.js', size: 45000, chunkId: 'vendors' },
    { name: 'lucide-react.js', size: 35000, chunkId: 'vendors' },
    { name: 'next.js', size: 120000, chunkId: 'vendors' },
    { name: 'other-vendor.js', size: 120000, chunkId: 'vendors' },
    { name: 'header.js', size: 30000, chunkId: 'ui-libraries' },
    { name: 'footer.js', size: 25000, chunkId: 'ui-libraries' },
    { name: 'product-card.js', size: 45000, chunkId: 'ui-libraries' },
    { name: 'cart.js', size: 80000, chunkId: 'ui-libraries' },
    { name: 'home-page.js', size: 100000, chunkId: 'pages-home' },
    { name: 'hero-section.js', size: 50000, chunkId: 'pages-home' },
    { name: 'shop-page.js', size: 70000, chunkId: 'pages-shop' },
    { name: 'product-grid.js', size: 60000, chunkId: 'pages-shop' },
  ];
  
  return analyzeBundle({ chunks, assets });
};