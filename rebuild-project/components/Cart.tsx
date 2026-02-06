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
      brand: 'mmwAfrika Pride',
      size: 'M',
      color: 'Cream',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Crochet Doll Set',
      price: 320,
      image: 'https://images.unsplash.com/photo-1583324115154-580e6c7b0e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      brand: 'mmwAfrika Pride',
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight text-white mb-12">
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

              <div className="flex flex-grow flex-col justify-between gap-4 sm:flex-row">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-white">{item.name}</p>
                  <p className="text-sm font-normal text-white/60">Size: {item.size}</p>
                  <p className="text-sm font-normal text-white/60">Color: {item.color}</p>
                </div>

                <div className="flex items-center justify-between sm:items-start sm:justify-start sm:gap-12">
                  <div className="flex items-center gap-4 text-white">
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#222222] text-xl transition-colors hover:bg-white/10"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-base font-medium">{item.quantity}</span>
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#222222] text-xl transition-colors hover:bg-white/10"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="text-right text-base font-medium text-white sm:min-w-[6rem]">
                    R{(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 sm:hidden"
                    onClick={() => removeItem(item.id)}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                className="hidden h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 sm:flex"
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
              <label className="mb-2 block text-sm font-medium text-white" htmlFor="promo-code">
                Promo Code
              </label>
              <div className="flex">
                <input
                  className="h-12 flex-grow appearance-none border border-[#222222] bg-[#0A0A0A] px-4 py-2 text-sm text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-0"
                  id="promo-code"
                  placeholder="Enter code"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="h-12 w-24 shrink-0 border border-l-0 border-white/20 text-sm font-medium text-white/60 transition-colors hover:bg-white/10">
                  Apply
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-4">
                <p className="text-sm text-white/60">Subtotal</p>
                <p className="text-sm font-medium text-white">R{subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between gap-4">
                <p className="text-sm text-white/60">Shipping</p>
                <p className="text-sm font-medium text-white">Calculated at next step</p>
              </div>
              <div className="mt-2 flex justify-between gap-4 border-t border-[#222222] pt-2">
                <p className="text-lg font-bold text-white">Total</p>
                <p className="text-lg font-bold text-white">R{total.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="flex h-14 w-full cursor-pointer items-center justify-center bg-primary px-8 text-base font-bold text-[#0A0A0A] transition-opacity hover:opacity-90 lg:w-auto"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;