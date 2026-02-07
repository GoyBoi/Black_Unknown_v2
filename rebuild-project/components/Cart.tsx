'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Hand-knitted Cardigan',
      price: 185,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      size: 'M',
      color: 'Cream',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Crochet Doll Set',
      price: 320,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'MMWAFRIKA PRIDE',
      size: 'One Size',
      color: 'Multicolor',
      quantity: 1,
    },
  ]);

  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Calculated at next step
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground mb-12">
          My Bag ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h2>

        {/* Cart Items */}
        <div className="flex flex-col gap-8 divide-y divide-[#222222]">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-6 pt-8 sm:flex-row">
              <div
                className="h-48 w-full shrink-0 rounded-lg bg-cover bg-center bg-no-repeat sm:h-36 sm:w-36"
                style={{ backgroundImage: `url("${item.image}")` }}
              ></div>

              <div className="flex flex-grow flex-col justify-between gap-2 sm:flex-row">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-foreground text-left">{item.name}</p>
                  <p className="text-sm font-normal text-foreground/80 text-left">{item.brand}</p>
                  <div className="flex gap-4 mt-1">
                    <p className="text-sm font-normal text-foreground/60 text-left">Size: {item.size}</p>
                    <p className="text-sm font-normal text-foreground/60 text-left">Color: {item.color}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:items-start sm:justify-start sm:gap-12">
                  <div className="flex items-center gap-4 text-foreground">
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-xl transition-colors hover:bg-foreground/10"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-base font-medium">{item.quantity}</span>
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-xl transition-colors hover:bg-foreground/10"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-right text-base font-medium text-foreground sm:min-w-[6rem] relative inline-block">
                    <span className="relative z-10">R{(item.price * item.quantity).toLocaleString()}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
                  </p>

                  <button
                    className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/10 sm:hidden"
                    onClick={() => removeItem(item.id)}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                className="hidden h-8 w-8 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/10 sm:flex"
                onClick={() => removeItem(item.id)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Promo and Summary */}
        <div className="mt-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-16">
            <div className="w-full lg:w-64">
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="promo-code">
                Promo Code
              </label>
              <div className="flex">
                <input
                  className="h-12 flex-grow appearance-none border border-foreground/20 bg-background px-4 py-2 text-sm text-foreground placeholder-foreground/40 focus:border-gold focus:outline-none focus:ring-0"
                  id="promo-code"
                  placeholder="Enter code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="h-12 w-24 shrink-0 border border-l-0 border-foreground/20 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/10">
                  Apply
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-4">
                <p className="text-sm text-foreground/60">Subtotal</p>
                <p className="text-sm font-medium text-foreground">R{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between gap-4">
                <p className="text-sm text-foreground/60">Shipping</p>
                <p className="text-sm font-medium text-foreground">Calculated at next step</p>
              </div>
              <div className="mt-2 flex justify-between gap-4 border-t border-foreground/20 pt-2">
                <p className="text-lg font-bold text-foreground">Total</p>
                <p className="text-lg font-bold text-foreground">R{total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex h-14 w-full cursor-pointer items-center justify-center bg-gold px-8 text-base font-bold text-black transition-colors hover:bg-gold-light lg:w-auto"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;