'use client';

import React, { useEffect } from 'react';
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useRecentlyViewed } from '@/lib/RecentlyViewedContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  description: string;
  sizes: string[];
}

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  useEffect(() => {
    // Close modal when pressing Escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      // Add to recently viewed when quick view opens
      addToRecentlyViewed({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand
      });
      
      // Prevent scrolling on the background
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-background border border-foreground/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <div className="aspect-square bg-foreground/5 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-foreground/60 uppercase text-sm tracking-wider">{product.brand}</p>
            <h2 className="text-2xl font-bold text-foreground mt-1 mb-4">{product.name}</h2>
            <p className="text-xl font-bold text-gold mb-4">R{product.price.toFixed(2)}</p>

            <p className="text-foreground/80 mb-6">
              {product.description.substring(0, 150)}...
            </p>

            <div className="mb-6">
              <h3 className="text-foreground font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 rounded-lg flex items-center justify-center border border-foreground/20 text-foreground/80 hover:border-foreground hover:text-foreground"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="flex-1 bg-foreground text-background py-3 px-6 rounded-lg font-bold hover:bg-foreground/90 transition-colors">
                Add to Cart
              </button>
              <button className="p-3 border border-foreground/20 rounded-lg hover:bg-foreground/10 transition-colors">
                <HeartIcon className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;