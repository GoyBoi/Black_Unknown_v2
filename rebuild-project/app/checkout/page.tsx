'use client';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import CartSummary to ensure it's only rendered on the client-side
const CartSummary = dynamic(() => import('@/components/CartSummary'), {
  ssr: false,
  loading: () => <div className="bg-[#1a150e] p-6 rounded-lg">Loading order summary...</div>
});

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="create-account" 
                    className="w-5 h-5 text-primary bg-background border-white/20 rounded focus:ring-primary"
                  />
                  <label htmlFor="create-account" className="ml-2 text-white/80 text-sm">
                    Create an account for faster checkout
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="First and last name"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-white/80 text-sm font-medium mb-2">Address</label>
                  <input 
                    type="text" 
                    id="address" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-white/80 text-sm font-medium mb-2">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label htmlFor="province" className="block text-white/80 text-sm font-medium mb-2">Province</label>
                  <select 
                    id="province" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Province</option>
                    <option value="GP">Gauteng</option>
                    <option value="WC">Western Cape</option>
                    <option value="KZN">KwaZulu-Natal</option>
                    <option value="EC">Eastern Cape</option>
                    <option value="FS">Free State</option>
                    <option value="LP">Limpopo</option>
                    <option value="MP">Mpumalanga</option>
                    <option value="NC">Northern Cape</option>
                    <option value="NW">North West</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-white/80 text-sm font-medium mb-2">Postal Code</label>
                  <input 
                    type="text" 
                    id="postalCode" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0000"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-white/80 text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+27 00 000 0000"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <input 
                  type="checkbox" 
                  id="different-address" 
                  className="w-5 h-5 text-primary bg-background border-white/20 rounded focus:ring-primary"
                />
                <label htmlFor="different-address" className="ml-2 text-white/80 text-sm">
                  Billing address is the same as shipping address
                </label>
              </div>
            </div>
            
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Shipping Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Standard Delivery</h3>
                    <p className="text-sm text-white/60">2-5 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white relative inline-block">
                      <span className="relative z-10">R100.00</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/30 -z-10"></span>
                    </p>
                  </div>
                  <div>
                    <input 
                      type="radio" 
                      name="shipping" 
                      id="standard" 
                      className="w-5 h-5 text-primary bg-background border-white/20 focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Express Delivery</h3>
                    <p className="text-sm text-white/60">1-2 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white relative inline-block">
                      <span className="relative z-10">R200.00</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/30 -z-10"></span>
                    </p>
                  </div>
                  <div>
                    <input 
                      type="radio" 
                      name="shipping" 
                      id="express" 
                      className="w-5 h-5 text-primary bg-background border-white/20 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#1a150e] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-white/80 text-sm font-medium mb-2">Card Number</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                
                <div>
                  <label htmlFor="expiry" className="block text-white/80 text-sm font-medium mb-2">Expiry Date</label>
                  <input 
                    type="text" 
                    id="expiry" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-white/80 text-sm font-medium mb-2">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-white/80 text-sm font-medium mb-2">Name on Card</label>
                  <input 
                    type="text" 
                    id="cardName" 
                    className="w-full bg-background border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="As it appears on your card"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <input 
                  type="checkbox" 
                  id="save-card" 
                  className="w-5 h-5 text-primary bg-background border-white/20 rounded focus:ring-primary"
                />
                <label htmlFor="save-card" className="ml-2 text-white/80 text-sm">
                  Save card details for future purchases
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <Suspense fallback={<div className="bg-[#1a150e] p-6 rounded-lg">Loading order summary...</div>}>
              <CartSummary />
            </Suspense>

            <button className="w-full mt-6 bg-primary hover:bg-saffron-gold/90 text-black font-bold py-4 px-6 rounded-lg transition-colors">
              Complete Order
            </button>

            <p className="text-center text-white/60 text-sm mt-4">
              Secure Payment Gateway
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;