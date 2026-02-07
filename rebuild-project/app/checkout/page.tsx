'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import CartSummary to ensure it's only rendered on the client-side
const CartSummary = dynamic(() => import('@/components/CartSummary'), {
  ssr: false,
  loading: () => <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-foreground/20">Loading order summary...</div>
});

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');

  useEffect(() => {
    // Hide all payment forms initially
    const forms = document.querySelectorAll('.payment-form');
    forms.forEach(form => {
      (form as HTMLElement).classList.add('hidden');
    });
    
    // Show the selected payment method form
    const selectedForm = document.getElementById(`${selectedPaymentMethod}-form`);
    if (selectedForm) {
      selectedForm.classList.remove('hidden');
    }
  }, [selectedPaymentMethod]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-foreground/20">
              <h2 className="text-xl font-bold text-foreground mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-foreground/80 text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="create-account"
                    className="w-5 h-5 text-gold bg-background border-foreground/20 rounded focus:ring-gold focus:ring-offset-background"
                  />
                  <label htmlFor="create-account" className="ml-2 text-foreground/80 text-sm">
                    Create an account for faster checkout
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-foreground/20">
              <h2 className="text-xl font-bold text-foreground mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-foreground/80 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="First and last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-foreground/80 text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    id="address"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-foreground/80 text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-foreground/80 text-sm font-medium mb-2">Province</label>
                  <select
                    id="province"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
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
                  <label htmlFor="postalCode" className="block text-foreground/80 text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-foreground/80 text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                    placeholder="+27 00 000 0000"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <input
                  type="checkbox"
                  id="different-address"
                  className="w-5 h-5 text-gold bg-background border-foreground/20 rounded focus:ring-gold focus:ring-offset-background"
                />
                <label htmlFor="different-address" className="ml-2 text-foreground/80 text-sm">
                  Billing address is the same as shipping address
                </label>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-foreground/20">
              <h2 className="text-xl font-bold text-foreground mb-6">Shipping Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-foreground/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Standard Delivery</h3>
                    <p className="text-sm text-foreground/60">2-5 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground relative inline-block">
                      <span className="relative z-10">R100.00</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
                    </p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="shipping"
                      id="standard"
                      className="w-5 h-5 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-foreground/20 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground">Express Delivery</h3>
                    <p className="text-sm text-foreground/60">1-2 business days</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground relative inline-block">
                      <span className="relative z-10">R200.00</span>
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
                    </p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="shipping"
                      id="express"
                      className="w-5 h-5 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg border border-foreground/20">
              <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>

              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-foreground/20 rounded-lg p-4 flex items-center">
                    <input
                      type="radio"
                      id="credit-card"
                      name="payment-method"
                      className="w-5 h-5 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background mr-3"
                      defaultChecked
                      onChange={() => setSelectedPaymentMethod('credit-card')}
                    />
                    <label htmlFor="credit-card" className="text-foreground">Credit Card</label>
                  </div>
                  
                  <div className="border border-foreground/20 rounded-lg p-4 flex items-center">
                    <input
                      type="radio"
                      id="ozow"
                      name="payment-method"
                      className="w-5 h-5 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background mr-3"
                      onChange={() => setSelectedPaymentMethod('e-wallet')}
                    />
                    <label htmlFor="ozow" className="text-foreground">Ozow</label>
                  </div>
                  
                  <div className="border border-foreground/20 rounded-lg p-4 flex items-center">
                    <input
                      type="radio"
                      id="bank-transfer"
                      name="payment-method"
                      className="w-5 h-5 text-gold bg-background border-foreground/20 focus:ring-gold focus:ring-offset-background mr-3"
                      onChange={() => setSelectedPaymentMethod('bank-transfer')}
                    />
                    <label htmlFor="bank-transfer" className="text-foreground">Bank Transfer</label>
                  </div>
                </div>

                {/* Credit Card Form */}
                <div id="credit-card-form" className="payment-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="cardNumber" className="block text-foreground/80 text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>

                    <div>
                      <label htmlFor="expiry" className="block text-foreground/80 text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        id="expiry"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-foreground/80 text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="123"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="cardName" className="block text-foreground/80 text-sm font-medium mb-2">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="As it appears on your card"
                      />
                    </div>
                  </div>
                </div>

                {/* Ozow Payment Form (Hidden by default) */}
                <div id="e-wallet-form" className="payment-form hidden">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-foreground/80 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="mobile" className="block text-foreground/80 text-sm font-medium mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        id="mobile"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="+27 00 000 0000"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-foreground/80 text-sm">
                        You will be redirected to Ozow's secure payment gateway to complete your transaction. 
                        Once payment is confirmed, you will be returned to our site to complete your order.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Form (Hidden by default) */}
                <div id="bank-transfer-form" className="payment-form hidden">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bank-name" className="block text-foreground/80 text-sm font-medium mb-2">Bank Name</label>
                      <select
                        id="bank-name"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                      >
                        <option value="">Select your bank</option>
                        <option value="absa">Absa</option>
                        <option value="fmb">First National Bank (FNB)</option>
                        <option value="nedbank">Nedbank</option>
                        <option value="standard-bank">Standard Bank</option>
                        <option value="capitec">Capitec Bank</option>
                        <option value="bidvest">Bidvest Bank</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="account-number" className="block text-foreground/80 text-sm font-medium mb-2">Account Number</label>
                        <input
                          type="text"
                          id="account-number"
                          className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                          placeholder="Account number"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="account-type" className="block text-foreground/80 text-sm font-medium mb-2">Account Type</label>
                        <select
                          id="account-type"
                          className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        >
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="reference" className="block text-foreground/80 text-sm font-medium mb-2">Reference</label>
                      <input
                        type="text"
                        id="reference"
                        className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-3 text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-gold focus:border-gold focus:outline-none"
                        placeholder="Use your order number as reference"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    id="save-payment"
                    className="w-5 h-5 text-gold bg-background border-foreground/20 rounded focus:ring-gold focus:ring-offset-background"
                  />
                  <label htmlFor="save-payment" className="ml-2 text-foreground/80 text-sm">
                    Save payment details for future purchases
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary />

            <button className="w-full mt-6 bg-gold hover:bg-gold-light text-background font-bold py-4 px-6 rounded-lg transition-colors">
              Complete Order
            </button>

            <p className="text-center text-foreground/60 text-sm mt-4">
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