'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  // Sample product data
  const featuredProducts = [
    {
      id: 1,
      name: 'Hand-knitted Cardigan',
      price: 890,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 2,
      name: 'Crochet Doll Set',
      price: 650,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 3,
      name: 'Crocheted Flower Bouquet',
      price: 220,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
  ];

  const newArrivals = [
    {
      id: 4,
      name: 'Baby Crochet Set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 5,
      name: 'Crocheted Shawl',
      price: 780,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 6,
      name: 'Amigurumi Animals',
      price: 350,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
    {
      id: 7,
      name: 'Crocheted Home Decor',
      price: 550,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center p-4 text-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPT2peyP1bs4kKbBDrui4jNP9V8jSYMsuVifWmPfrchv4XYBOw9Ty0gAVVBEnHXmMLCkpoZsT26l2Yu9ZcaAmuWmQHJ7WgVKPDdvnl8ttSceOzMKMHA7alRvjjahbw0oC-VTp2JMWolHrcnTWr4KF8XwFl9BbwT29wAdu2iesyM7nADkp6wdyJ7n6eIGoX7aZedgZ9ZOQwnEFnjL0-sazBtDBUl9-7so-7jIXM-8SfWr9aDISFI3irMYOuDlESy7mn_7qsOQuVjDQn")',
            }}
          >
            <div className="flex flex-col gap-4 max-w-3xl z-10">
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Handcrafted with Love
              </h1>
              <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto">
                Discover our exquisite collection of hand-knitted crochet items, from elegant clothes to adorable dolls and beautiful flowers.
              </p>
              <Link
                href="/shop"
                className="mt-6 mx-auto flex items-center gap-2 bg-gold text-black hover:bg-gold-light font-bold py-3 px-6 rounded-lg transition-colors w-fit"
              >
                <span>Explore Crochet Collection</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Crochet Items Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">Featured Crochet Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Brand Ethos Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="w-full h-96 bg-cover bg-center rounded-lg bg-foreground/10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZzIgq3G-HmScw4GUaFKAOfixQ5mDuGHt8SOU1XQZ7DJQR9VWLcorxgHc4_-I0jk3iPVcRbtfZd4LitjaUyr9slKGG1MjTW4Khkp-l83OLTiIHDLOzwQY6OYbWV34uN5_cIWDbNuYudy0Ji7YxsnlEsdEAqqPpeanuPQhd6S-64nFNKeGHwQxFj5BIh_01E8n-bddnt6UxGTF9XGxrGJR98wPXTAreeRj7WRMtqNDtbyM3zqvxi1DRY7HHbYEJEsTqf8gr5vMDtj38")',
              }}
            ></div>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Our Ethos</h1>
              <p className="text-foreground/80 text-base">
                MMWAFRIKA PRIDE is built on a foundation of traditional crochet craftsmanship and artistic expression. We create unique, hand-knitted pieces that celebrate the beauty of handmade artistry.
              </p>
              <p className="text-foreground/80 text-base mt-2">
                Every crochet item is lovingly handcrafted with attention to detail, ensuring quality and uniqueness that speaks to our commitment to preserving traditional crafts and celebrating creativity.
              </p>
            </div>
          </div>
        </section>

        {/* New Crochet Creations Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">New Crochet Creations</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-foreground/20 text-foreground/80 hover:bg-foreground/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 rounded-full border border-foreground/20 text-foreground/80 hover:bg-foreground/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;