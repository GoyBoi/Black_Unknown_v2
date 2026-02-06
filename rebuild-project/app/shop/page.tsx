import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const ShopPage = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Hand-knitted Cardigan',
      price: 890,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 2,
      name: 'Crochet Doll Set',
      price: 650,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 3,
      name: 'Crocheted Flower Bouquet',
      price: 220,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 4,
      name: 'Baby Crochet Set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 5,
      name: 'Crocheted Shawl',
      price: 780,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 6,
      name: 'Amigurumi Animals',
      price: 350,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 7,
      name: 'Crocheted Home Decor',
      price: 550,
      image: 'https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
    {
      id: 8,
      name: 'Vintage Crochet Dress',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      brand: 'MMWAFRIKA PRIDE',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 text-center">Shop Collection</h1>
          <div className="flex items-center gap-4">
            <select className="bg-background border border-gold/20 rounded-lg text-foreground px-4 py-2 focus:ring-gold focus:border-gold">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="transition-transform duration-300 hover:-translate-y-1">
              <ProductCard key={product.id} product={product} />
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;