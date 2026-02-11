'use client';

import React, { useState } from 'react';

interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  ratings: number[];
}

interface AdvancedFilterProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: any) => void;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filterOptions, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    minPrice: filterOptions.priceRange[0],
    maxPrice: filterOptions.priceRange[1],
    ratings: [] as number[],
  });
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    sizes: true,
    colors: true,
    price: true,
    ratings: true,
  });

  const toggleFilter = (type: keyof typeof activeFilters, value: string | number) => {
    const currentValues = [...activeFilters[type] as any];
    const index = currentValues.indexOf(value);
    
    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(value);
    }
    
    const newActiveFilters = {
      ...activeFilters,
      [type]: currentValues
    };
    
    setActiveFilters(newActiveFilters);
    
    onFilterChange(newActiveFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handlePriceChange = (type: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    const newFilters = {
      ...activeFilters,
      [type]: numValue
    };
    
    // Ensure min is not greater than max
    if (type === 'minPrice' && numValue > newFilters.maxPrice) {
      newFilters.maxPrice = numValue;
    } else if (type === 'maxPrice' && numValue < newFilters.minPrice) {
      newFilters.minPrice = numValue;
    }
    
    setActiveFilters(newFilters);
    onFilterChange({
      ...activeFilters,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice
    });
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [] as string[],
      brands: [] as string[],
      sizes: [] as string[],
      colors: [] as string[],
      minPrice: filterOptions.priceRange[0],
      maxPrice: filterOptions.priceRange[1],
      ratings: [] as number[],
    };
    
    setActiveFilters(clearedFilters);
    
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-background border border-foreground/20 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-foreground">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-gold hover:underline"
        >
          Clear All
        </button>
      </div>
      
      {/* Categories Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('categories')}
        >
          <span>Categories</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.categories && (
          <div className="mt-2 space-y-2">
            {filterOptions.categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={activeFilters.categories.includes(category)}
                  onChange={() => toggleFilter('categories', category)}
                  className="mr-2 h-4 w-4 text-gold focus:ring-gold border-foreground/20 rounded"
                />
                <label htmlFor={`cat-${category}`} className="text-sm text-foreground/80">
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Brands Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('brands')}
        >
          <span>Brands</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.brands && (
          <div className="mt-2 space-y-2">
            {filterOptions.brands.map(brand => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={activeFilters.brands.includes(brand)}
                  onChange={() => toggleFilter('brands', brand)}
                  className="mr-2 h-4 w-4 text-gold focus:ring-gold border-foreground/20 rounded"
                />
                <label htmlFor={`brand-${brand}`} className="text-sm text-foreground/80">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Sizes Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('sizes')}
        >
          <span>Sizes</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.sizes ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.sizes && (
          <div className="mt-2 space-y-2">
            {filterOptions.sizes.map(size => (
              <div key={size} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  checked={activeFilters.sizes.includes(size)}
                  onChange={() => toggleFilter('sizes', size)}
                  className="mr-2 h-4 w-4 text-gold focus:ring-gold border-foreground/20 rounded"
                />
                <label htmlFor={`size-${size}`} className="text-sm text-foreground/80">
                  {size}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Colors Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('colors')}
        >
          <span>Colors</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.colors && (
          <div className="mt-2 space-y-2">
            {filterOptions.colors.map(color => (
              <div key={color} className="flex items-center">
                <input
                  type="checkbox"
                  id={`color-${color}`}
                  checked={activeFilters.colors.includes(color)}
                  onChange={() => toggleFilter('colors', color)}
                  className="mr-2 h-4 w-4 text-gold focus:ring-gold border-foreground/20 rounded"
                />
                <label htmlFor={`color-${color}`} className="text-sm text-foreground/80">
                  {color}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('price')}
        >
          <span>Price Range</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.price && (
          <div className="mt-2 space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-foreground/60 mb-1">Min</label>
                <input
                  type="number"
                  value={activeFilters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="w-full p-2 bg-foreground/5 border border-foreground/20 rounded text-sm text-foreground"
                  min={filterOptions.priceRange[0]}
                  max={filterOptions.priceRange[1]}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-foreground/60 mb-1">Max</label>
                <input
                  type="number"
                  value={activeFilters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="w-full p-2 bg-foreground/5 border border-foreground/20 rounded text-sm text-foreground"
                  min={filterOptions.priceRange[0]}
                  max={filterOptions.priceRange[1]}
                />
              </div>
            </div>
            <div className="text-xs text-foreground/60">
              R{activeFilters.minPrice} - R{activeFilters.maxPrice}
            </div>
          </div>
        )}
      </div>
      
      {/* Ratings Filter */}
      <div className="mb-4">
        <button 
          className="flex justify-between items-center w-full py-2 text-left font-medium text-foreground"
          onClick={() => toggleSection('ratings')}
        >
          <span>Customer Ratings</span>
          <svg 
            className={`w-4 h-4 transition-transform ${expandedSections.ratings ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        {expandedSections.ratings && (
          <div className="mt-2 space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={activeFilters.ratings.includes(rating)}
                  onChange={() => toggleFilter('ratings', rating)}
                  className="mr-2 h-4 w-4 text-gold focus:ring-gold border-foreground/20 rounded"
                />
                <label htmlFor={`rating-${rating}`} className="text-sm text-foreground/80 flex items-center">
                  {rating}+ Stars
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilter;