// lib/bundle-size-optimization-dashboard.ts

// Define types for bundle size optimization
export interface BundleAsset {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  brotliSize: number; // in bytes
  chunkId: string;
  isOptimized: boolean;
  optimizationPotential: number; // percentage
}

export interface BundleChunk {
  id: string;
  name: string;
  size: number; // in bytes
  gzipSize: number; // in bytes
  brotliSize: number; // in bytes
  assets: BundleAsset[];
  dependencies: string[];
  timestamp: number;
}

export interface BundleOptimizationSuggestion {
  id: string;
  type: 'duplicate-package' | 'large-chunk' | 'unused-code' | 'unoptimized-asset' | 'missing-compression' | 'tree-shaking-opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high'; // Potential size reduction
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

export interface BundleSizeOptimizationData {
  totalSize: number;
  totalGzipSize: number;
  totalBrotliSize: number;
  sizeChange: number; // percentage change
  sizeTrend: 'increasing' | 'decreasing' | 'stable';
  chunks: BundleChunk[];
  optimizationSuggestions: BundleOptimizationSuggestion[];
  performanceScore: number; // 0-100
  sizeHistory: { date: string; size: number }[];
  duplicatePackages: {
    packageName: string;
    occurrences: number;
    totalSize: number;
  }[];
  largeAssets: BundleAsset[];
  optimizationOpportunities: {
    type: string;
    count: number;
    potentialSavings: number;
  }[];
  compressionEfficiency: {
    chunkId: string;
    size: number;
    gzipSize: number;
    brotliSize: number;
    gzipEfficiency: number; // percentage
    brotliEfficiency: number; // percentage
  }[];
  treeShakingOpportunities: {
    chunkId: string;
    unusedSize: number;
    potentialSavings: number;
  }[];
}

// In-memory storage for bundle optimization data (in production, this would be in a database)
const bundleOptimizationData: BundleSizeOptimizationData[] = [];

// Function to calculate bundle size optimization data
export const calculateBundleSizeOptimization = (timeRange?: { start: number; end: number }): BundleSizeOptimizationData => {
  // In a real implementation, this would fetch from an API or analyze actual bundle data
  // For this demo, we'll generate mock data
  
  const chunks: BundleChunk[] = [
    {
      id: 'main',
      name: 'main.js',
      size: 450000, // 450KB
      gzipSize: 120000, // 120KB
      brotliSize: 100000, // 100KB
      assets: [
        { id: 'react', name: 'react.js', size: 120000, gzipSize: 40000, brotliSize: 35000, chunkId: 'main', isOptimized: true, optimizationPotential: 0 },
        { id: 'react-dom', name: 'react-dom.js', size: 110000, gzipSize: 35000, brotliSize: 30000, chunkId: 'main', isOptimized: true, optimizationPotential: 0 },
        { id: 'app', name: 'app.js', size: 80000, gzipSize: 25000, brotliSize: 22000, chunkId: 'main', isOptimized: false, optimizationPotential: 15 },
        { id: 'utils', name: 'utils.js', size: 70000, gzipSize: 20000, brotliSize: 18000, chunkId: 'main', isOptimized: true, optimizationPotential: 5 },
        { id: 'styles', name: 'styles.css', size: 70000, gzipSize: 10000, brotliSize: 8000, chunkId: 'main', isOptimized: true, optimizationPotential: 0 }
      ],
      dependencies: ['react', 'react-dom', 'next'],
      timestamp: Date.now()
    },
    {
      id: 'vendors',
      name: 'vendors.js',
      size: 320000, // 320KB
      gzipSize: 90000, // 90KB
      brotliSize: 80000, // 80KB
      assets: [
        { id: 'heroicons', name: '@heroicons/react.js', size: 45000, gzipSize: 15000, brotliSize: 13000, chunkId: 'vendors', isOptimized: true, optimizationPotential: 0 },
        { id: 'lucide', name: 'lucide-react.js', size: 35000, gzipSize: 12000, brotliSize: 10000, chunkId: 'vendors', isOptimized: true, optimizationPotential: 0 },
        { id: 'next', name: 'next.js', size: 120000, gzipSize: 40000, brotliSize: 36000, chunkId: 'vendors', isOptimized: true, optimizationPotential: 0 },
        { id: 'other-vendor', name: 'other-vendor.js', size: 120000, gzipSize: 23000, brotliSize: 21000, chunkId: 'vendors', isOptimized: false, optimizationPotential: 20 }
      ],
      dependencies: ['@heroicons/react', 'lucide-react', 'next'],
      timestamp: Date.now()
    },
    {
      id: 'pages-home',
      name: 'pages-home.js',
      size: 180000, // 180KB
      gzipSize: 50000, // 50KB
      brotliSize: 45000, // 45KB
      assets: [
        { id: 'home-page', name: 'home-page.js', size: 100000, gzipSize: 30000, brotliSize: 28000, chunkId: 'pages-home', isOptimized: false, optimizationPotential: 10 },
        { id: 'hero-section', name: 'hero-section.js', size: 80000, gzipSize: 20000, brotliSize: 17000, chunkId: 'pages-home', isOptimized: true, optimizationPotential: 5 }
      ],
      dependencies: ['home-page', 'hero-section'],
      timestamp: Date.now()
    },
    {
      id: 'pages-product',
      name: 'pages-product.js',
      size: 250000, // 250KB
      gzipSize: 70000, // 70KB
      brotliSize: 65000, // 65KB
      assets: [
        { id: 'product-page', name: 'product-page.js', size: 150000, gzipSize: 45000, brotliSize: 42000, chunkId: 'pages-product', isOptimized: false, optimizationPotential: 12 },
        { id: 'product-card', name: 'product-card.js', size: 50000, gzipSize: 15000, brotliSize: 14000, chunkId: 'pages-product', isOptimized: true, optimizationPotential: 3 },
        { id: 'image-gallery', name: 'image-gallery.js', size: 50000, gzipSize: 10000, brotliSize: 9000, chunkId: 'pages-product', isOptimized: true, optimizationPotential: 0 }
      ],
      dependencies: ['product-page', 'product-card', 'image-gallery'],
      timestamp: Date.now()
    },
    {
      id: 'ui-components',
      name: 'ui-components.js',
      size: 420000, // 420KB
      gzipSize: 140000, // 140KB
      brotliSize: 120000, // 120KB
      assets: [
        { id: 'header', name: 'header.js', size: 80000, gzipSize: 25000, brotliSize: 23000, chunkId: 'ui-components', isOptimized: true, optimizationPotential: 5 },
        { id: 'footer', name: 'footer.js', size: 60000, gzipSize: 20000, brotliSize: 18000, chunkId: 'ui-components', isOptimized: true, optimizationPotential: 3 },
        { id: 'cart', name: 'cart.js', size: 120000, gzipSize: 40000, brotliSize: 36000, chunkId: 'ui-components', isOptimized: false, optimizationPotential: 18 },
        { id: 'modal', name: 'modal.js', size: 160000, gzipSize: 55000, brotliSize: 43000, chunkId: 'ui-components', isOptimized: false, optimizationPotential: 25 }
      ],
      dependencies: ['header', 'footer', 'cart', 'modal'],
      timestamp: Date.now()
    }
  ];

  // Calculate total sizes
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalGzipSize = chunks.reduce((sum, chunk) => sum + chunk.gzipSize, 0);
  const totalBrotliSize = chunks.reduce((sum, chunk) => sum + chunk.brotliSize, 0);

  // Calculate size change (simplified)
  const sizeChange = -5.2; // -5.2% change
  const sizeTrend: 'increasing' | 'decreasing' | 'stable' = sizeChange > 5 ? 'increasing' : sizeChange < -5 ? 'decreasing' : 'stable';

  // Find duplicate packages
  const allDependencies = chunks.flatMap(chunk => chunk.dependencies);
  const dependencyCount = new Map<string, number>();
  allDependencies.forEach(dep => {
    dependencyCount.set(dep, (dependencyCount.get(dep) || 0) + 1);
  });

  const duplicatePackages = Array.from(dependencyCount.entries())
    .filter(([_, count]) => count > 1)
    .map(([packageName, occurrences]) => ({
      packageName,
      occurrences,
      totalSize: occurrences * 50000 // Simplified calculation
    }));

  // Find large assets
  const allAssets = chunks.flatMap(chunk => chunk.assets);
  const largeAssets = allAssets
    .filter(asset => asset.size > 100000) // Larger than 100KB
    .sort((a, b) => b.size - a.size);

  // Generate optimization suggestions
  const optimizationSuggestions: BundleOptimizationSuggestion[] = [
    {
      id: 'sugg_1',
      type: 'duplicate-package',
      priority: 'high',
      title: 'Remove Duplicate Package: react',
      description: 'The react package appears in multiple chunks, increasing bundle size unnecessarily',
      impact: 'high',
      estimatedSavings: 120000,
      implementationEffort: 'medium',
      details: {
        packageName: 'react',
        currentSize: 120000,
        chunkName: 'Multiple chunks'
      }
    },
    {
      id: 'sugg_2',
      type: 'large-chunk',
      priority: 'high',
      title: 'Split Large Chunk: ui-components.js',
      description: 'The ui-components.js chunk is 420KB, which is quite large for initial load',
      impact: 'high',
      estimatedSavings: 150000,
      implementationEffort: 'high',
      details: {
        chunkName: 'ui-components.js',
        currentSize: 420000
      }
    },
    {
      id: 'sugg_3',
      type: 'unoptimized-asset',
      priority: 'medium',
      title: 'Optimize Large Asset: product-page.js',
      description: 'The product-page.js asset is 150KB and could benefit from code splitting',
      impact: 'medium',
      estimatedSavings: 50000,
      implementationEffort: 'medium',
      details: {
        assetName: 'product-page.js',
        currentSize: 150000
      }
    },
    {
      id: 'sugg_4',
      type: 'tree-shaking-opportunity',
      priority: 'medium',
      title: 'Unused Code in vendors.js',
      description: 'The vendors.js chunk contains unused code that could be eliminated',
      impact: 'medium',
      estimatedSavings: 80000,
      implementationEffort: 'low',
      details: {
        chunkName: 'vendors.js',
        currentSize: 320000
      }
    },
    {
      id: 'sugg_5',
      type: 'missing-compression',
      priority: 'low',
      title: 'Enable Brotli Compression',
      description: 'Brotli compression could reduce bundle size by an additional 15-20%',
      impact: 'high',
      estimatedSavings: 200000,
      implementationEffort: 'low',
      details: {
        chunkName: 'All chunks',
        currentSize: totalSize
      }
    }
  ];

  // Calculate performance score (0-100)
  let score = 100;
  if (totalSize > 1500000) score = 30; // Very large bundle
  else if (totalSize > 1000000) score = 50; // Large bundle
  else if (totalSize > 750000) score = 70; // Medium bundle
  else if (totalSize > 500000) score = 85; // Small bundle

  // Calculate size history (simplified)
  const sizeHistory = [
    { date: '2026-01-15', size: 1400000 },
    { date: '2026-01-16', size: 1380000 },
    { date: '2026-01-17', size: 1350000 },
    { date: '2026-01-18', size: 1320000 },
    { date: '2026-01-19', size: 1300000 },
    { date: '2026-01-20', size: 1280000 },
    { date: '2026-01-21', size: 1260000 },
    { date: '2026-01-22', size: 1240000 },
    { date: '2026-01-23', size: 1220000 },
    { date: '2026-01-24', size: 1200000 },
    { date: '2026-01-25', size: 1180000 },
    { date: '2026-01-26', size: totalSize }
  ];

  // Calculate optimization opportunities
  const optimizationOpportunities = [
    { type: 'Duplicate Packages', count: duplicatePackages.length, potentialSavings: duplicatePackages.reduce((sum, pkg) => sum + pkg.totalSize, 0) },
    { type: 'Large Chunks', count: chunks.filter(c => c.size > 300000).length, potentialSavings: 300000 },
    { type: 'Unoptimized Assets', count: largeAssets.length, potentialSavings: largeAssets.reduce((sum, asset) => sum + Math.floor(asset.size * 0.3), 0) },
    { type: 'Tree Shaking', count: 3, potentialSavings: 200000 }
  ];

  // Calculate compression efficiency
  const compressionEfficiency = chunks.map(chunk => ({
    chunkId: chunk.id,
    size: chunk.size,
    gzipSize: chunk.gzipSize,
    brotliSize: chunk.brotliSize,
    gzipEfficiency: ((chunk.size - chunk.gzipSize) / chunk.size) * 100,
    brotliEfficiency: ((chunk.size - chunk.brotliSize) / chunk.size) * 100
  }));

  // Calculate tree shaking opportunities
  const treeShakingOpportunities = [
    { chunkId: 'vendors', unusedSize: 80000, potentialSavings: 80000 },
    { chunkId: 'ui-components', unusedSize: 60000, potentialSavings: 60000 },
    { chunkId: 'pages-product', unusedSize: 40000, potentialSavings: 40000 }
  ];

  return {
    totalSize,
    totalGzipSize,
    totalBrotliSize,
    sizeChange,
    sizeTrend,
    chunks,
    optimizationSuggestions,
    performanceScore: score,
    sizeHistory,
    duplicatePackages,
    largeAssets,
    optimizationOpportunities,
    compressionEfficiency,
    treeShakingOpportunities
  };
};

// Function to format bytes to human-readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return num.toFixed(2) + '%';
};

// Function to get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-blue-500';
    default:
      return 'text-foreground/60';
  }
};

// Function to get priority badge class
export const getPriorityBadgeClass = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'bg-red-500/20 text-red-500';
    case 'high':
      return 'bg-orange-500/20 text-orange-500';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'low':
      return 'bg-blue-500/20 text-blue-500';
    default:
      return 'bg-foreground/10 text-foreground/60';
  }
};

// Function to get impact color
export const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-foreground/60';
  }
};

// Function to format number with thousands separator
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Function to get effort color
export const getEffortColor = (effort: string): string => {
  switch (effort) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-foreground/60';
  }
};