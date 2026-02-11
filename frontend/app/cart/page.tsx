import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartComponent from '@/components/Cart';

const CartPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <CartComponent />
      <Footer />
    </div>
  );
};

export default CartPage;