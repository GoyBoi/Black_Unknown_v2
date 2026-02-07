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
    <div className="bg-background p-6 rounded-lg border border-gold/20">
      <h3 className="text-xl font-bold text-foreground mb-4">Crochet Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-foreground/80">Subtotal</span>
          <span className="text-foreground relative inline-block">
            <span className="relative z-10">R{subtotal.toFixed(2)}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-foreground/80">Shipping</span>
          <span className="text-foreground relative inline-block">
            <span className="relative z-10">R{shipping.toFixed(2)}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-foreground/80">VAT (15%)</span>
          <span className="text-foreground relative inline-block">
            <span className="relative z-10">R{vat.toFixed(2)}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
          </span>
        </div>

        <div className="flex justify-between pt-3 border-t border-foreground/20">
          <span className="text-foreground font-bold">Total</span>
          <span className="text-foreground font-bold relative inline-block">
            <span className="relative z-10">R{total.toFixed(2)}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold/50"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;