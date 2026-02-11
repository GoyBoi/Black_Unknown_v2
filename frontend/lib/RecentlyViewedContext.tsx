'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  size?: string;
  color?: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    // Load recently viewed items from localStorage on mount
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed items', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever recentlyViewed changes
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    // Remove the product if it's already in the list
    const filtered = recentlyViewed.filter(item => item.id !== product.id);
    
    // Add the new product to the beginning of the list
    const updated = [product, ...filtered];
    
    // Limit to 10 items
    setRecentlyViewed(updated.slice(0, 10));
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewed');
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};