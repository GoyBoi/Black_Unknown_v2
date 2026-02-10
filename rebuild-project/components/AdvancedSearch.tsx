'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  stock: number;
}

interface AdvancedSearchProps {
  products: Product[];
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'name' | 'category' | 'brand'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter products based on search term and active filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simulate search delay for better UX
    const timer = setTimeout(() => {
      const filtered = products.filter(product => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        switch (activeFilter) {
          case 'name':
            return product.name.toLowerCase().includes(lowerSearchTerm);
          case 'category':
            return product.category.toLowerCase().includes(lowerSearchTerm);
          case 'brand':
            return product.brand.toLowerCase().includes(lowerSearchTerm);
          case 'all':
          default:
            return (
              product.name.toLowerCase().includes(lowerSearchTerm) ||
              product.category.toLowerCase().includes(lowerSearchTerm) ||
              product.brand.toLowerCase().includes(lowerSearchTerm)
            );
        }
      });
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter, products]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-foreground/60" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.trim() !== '') {
              setShowResults(true);
            }
          }}
          onFocus={() => setShowResults(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
          placeholder="Search products, categories, brands..."
          aria-label="Search"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-5 h-5 text-foreground/60 hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Search Filters */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-foreground/20 rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b border-foreground/10">
            <div className="flex space-x-2">
              {(['all', 'name', 'category', 'brand'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    activeFilter === filter
                      ? 'bg-gold text-black'
                      : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-foreground/60">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-foreground/10">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setShowResults(false)}
                    className="block p-3 hover:bg-foreground/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-foreground/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                        <p className="text-sm text-foreground/80 truncate">{product.brand}</p>
                        <p className="text-sm text-gold font-medium">R{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="p-4 text-center text-foreground/60">
                No products found for "{searchTerm}"
              </div>
            ) : (
              <div className="p-4 text-center text-foreground/60">
                Enter a search term to find products
              </div>
            )}
          </div>

          {/* Popular Searches */}
          {!searchTerm && !isSearching && (
            <div className="p-4 border-t border-foreground/10">
              <h4 className="text-sm font-medium text-foreground mb-2">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSearchTerm('scarf')} 
                  className="text-xs bg-foreground/10 hover:bg-foreground/20 px-2 py-1 rounded"
                >
                  Scarf
                </button>
                <button 
                  onClick={() => setSearchTerm('doll')} 
                  className="text-xs bg-foreground/10 hover:bg-foreground/20 px-2 py-1 rounded"
                >
                  Doll
                </button>
                <button 
                  onClick={() => setSearchTerm('flower')} 
                  className="text-xs bg-foreground/10 hover:bg-foreground/20 px-2 py-1 rounded"
                >
                  Flower
                </button>
                <button 
                  onClick={() => setSearchTerm('clothing')} 
                  className="text-xs bg-foreground/10 hover:bg-foreground/20 px-2 py-1 rounded"
                >
                  Clothing
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;