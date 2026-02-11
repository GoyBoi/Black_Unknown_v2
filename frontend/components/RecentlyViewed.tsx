'use client';

import React from 'react';
import { useRecentlyViewed } from '@/lib/RecentlyViewedContext';
import Link from 'next/link';

const RecentlyViewed = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="py-8 border-t border-foreground/10">
      <h2 className="text-xl font-bold text-foreground mb-4">Recently Viewed</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {recentlyViewed.slice(0, 5).map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`}
            className="flex-shrink-0 w-32 text-center"
          >
            <div className="aspect-square bg-foreground/5 rounded-lg overflow-hidden mb-2">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-foreground truncate">{product.name}</p>
            <p className="text-sm font-medium text-gold">R{product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;