'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import AdvancedFilter from '@/components/AdvancedFilter';

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  stock: number;
  colors?: string[];
  sizes?: string[];
}

const ShopPage = () => {
  // Sample product data with additional properties
  const allProducts: Product[] = [
    {
      id: 1,
      name: 'Hand-knitted Cardigan',
      price: 890,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Clothing',
      rating: 4.5,
      stock: 5,
      colors: ['Beige', 'Brown', 'Black'],
      sizes: ['S', 'M', 'L'],
    },
    {
      id: 2,
      name: 'Crochet Doll Set',
      price: 650,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Dolls',
      rating: 4.8,
      stock: 8,
      colors: ['Multi', 'Pastel', 'Earth'],
    },
    {
      id: 3,
      name: 'Crocheted Flower Bouquet',
      price: 220,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Flowers',
      rating: 4.3,
      stock: 12,
      colors: ['Red', 'Pink', 'Yellow', 'Purple'],
    },
    {
      id: 4,
      name: 'Baby Crochet Set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Clothing',
      rating: 4.7,
      stock: 3,
      sizes: ['0-6m', '6-12m', '12-18m'],
    },
    {
      id: 5,
      name: 'Crocheted Shawl',
      price: 780,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Clothing',
      rating: 4.6,
      stock: 6,
      colors: ['Cream', 'Blue', 'Green'],
    },
    {
      id: 6,
      name: 'Amigurumi Animals',
      price: 350,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Dolls',
      rating: 4.9,
      stock: 15,
      colors: ['Brown', 'White', 'Mixed'],
    },
    {
      id: 7,
      name: 'Crocheted Home Decor',
      price: 550,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Home Decor',
      rating: 4.4,
      stock: 7,
      colors: ['Natural', 'Beige', 'Gray'],
    },
    {
      id: 8,
      name: 'Vintage Crochet Dress',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      brand: 'MMWAFRIKA PRIDE',
      category: 'Clothing',
      rating: 4.9,
      stock: 2,
      sizes: ['XS', 'S', 'M'],
    },
  ];

  // State for filters and sorting
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    minPrice: 0,
    maxPrice: 2000,
    ratings: [] as number[],
  });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique categories
  const categories = ['All', ...new Set(allProducts.map(product => product.category))];

  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => {
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes('All') || filters.categories.includes(product.category);
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes('All') || filters.brands.includes(product.brand);
      const matchesSize = filters.sizes.length === 0 || filters.sizes.includes('All') || (product.sizes && product.sizes.some(size => filters.sizes.includes(size)));
      const matchesColor = filters.colors.length === 0 || filters.colors.includes('All') || (product.colors && product.colors.some(color => filters.colors.includes(color)));
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filters.ratings.length === 0 || filters.ratings.some(rating => product.rating >= rating);
      return matchesCategory && matchesBrand && matchesSize && matchesColor && matchesPrice && matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default: // featured/default
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-foreground/80 hover:text-gold">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-foreground/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span className="text-foreground/80 ml-1 md:ml-2">Shop</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <AdvancedFilter 
              filterOptions={{
                categories: ['All', ...new Set(allProducts.map(p => p.category))],
                brands: ['All', ...new Set(allProducts.map(p => p.brand))],
                sizes: ['All', ...new Set(allProducts.flatMap(p => p.sizes || []))].filter(Boolean),
                colors: ['All', ...new Set(allProducts.flatMap(p => p.colors || []))].filter(Boolean),
                priceRange: [0, 2000],
                ratings: [1, 2, 3, 4, 5]
              }}
              onFilterChange={(newFilters) => {
                setFilters({
                  ...filters,
                  ...newFilters
                });
              }}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-4 md:mb-0">Shop Collection</h1>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-foreground">
                  Showing <span className="font-bold">{filteredProducts.length}</span> of <span className="font-bold">{allProducts.length}</span> products
                </div>
                
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-foreground">Sort by:</label>
                  <select
                    id="sort"
                    className="bg-background border border-foreground/20 rounded-lg text-foreground px-3 py-2 focus:ring-gold focus:border-gold"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-foreground/80">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;