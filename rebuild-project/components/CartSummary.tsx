// components/CartSummary.tsx
import React from 'react';
import { useCart } from '@/lib/CartContext';

const CartSummary = () => {
  const { state } = useCart();

  const subtotal = state.total;
  const shipping = 0; // Calculated at later step
  const vat = subtotal * 0.15; // 15% VAT for South Africa
  const total = subtotal + shipping + vat;

  return (
    <div className="bg-[#1a150e] p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-white/80">Subtotal</span>
          <span className="text-white">R{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/80">Shipping</span>
          <span className="text-white">R{shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/80">VAT (15%)</span>
          <span className="text-white">R{vat.toFixed(2)}</span>
        </div>

        <div className="flex justify-between pt-3 border-t border-white/20">
          <span className="text-white font-bold">Total</span>
          <span className="text-white font-bold">R{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;