import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const WishlistPage = () => {
  // Sample wishlist items
  const wishlistItems = [
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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">My Wishlist</h1>
          <p className="text-foreground/80">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your wishlist is empty</h2>
            <p className="text-foreground/80 mb-6">Saved items will appear here. Start browsing our collection!</p>
            <a
              href="/shop"
              className="inline-block bg-gold hover:bg-gold-light text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Collection
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-gold text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:-translate-y-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Recent item"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Recent item"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Recent item"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[3/4] bg-stone-800 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1595444666477-c921977d4f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Recent item"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;