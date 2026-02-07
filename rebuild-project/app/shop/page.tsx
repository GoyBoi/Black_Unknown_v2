'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Get unique categories
  const categories = ['All', ...new Set(allProducts.map(product => product.category))];
  
  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
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
          <aside className="lg:w-1/4 bg-background border border-foreground/10 rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-foreground mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search products..."
                  className="w-full bg-background border border-foreground/20 rounded-lg py-2 px-4 text-foreground focus:ring-gold focus:border-gold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="w-4 h-4 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-foreground"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Price Range</h3>
              <div className="px-1">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-foreground/80 mt-1">
                  <span>R {priceRange[0]}</span>
                  <span>R {priceRange[1]}</span>
                </div>
              </div>
            </div>
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