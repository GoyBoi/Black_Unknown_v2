// components/EcommerceAnalytics.tsx
'use client';

import { useEffect } from 'react';
import * as gtag from '@/lib/analytics';

interface Product {
  id: string;
  name: string;
  category?: string;
  brand?: string;
  price: number;
  quantity?: number;
}

// Track product view
export const trackProductView = (product: Product) => {
  gtag.event({
    action: 'view_item',
    category: 'ecommerce',
    label: `Product: ${product.name}`,
    value: product.price
  });
};

// Track add to cart
export const trackAddToCart = (product: Product) => {
  gtag.event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: `Product: ${product.name}`,
    value: product.price * (product.quantity || 1)
  });
};

// Track remove from cart
export const trackRemoveFromCart = (product: Product) => {
  gtag.event({
    action: 'remove_from_cart',
    category: 'ecommerce',
    label: `Product: ${product.name}`,
    value: product.price * (product.quantity || 1)
  });
};

// Track checkout start
export const trackCheckoutStart = (products: Product[], value: number) => {
  gtag.event({
    action: 'begin_checkout',
    category: 'ecommerce',
    label: 'Checkout Started',
    value
  });
};

// Track purchase
export const trackPurchase = (orderId: string, products: Product[], value: number) => {
  gtag.event({
    action: 'purchase',
    category: 'ecommerce',
    label: `Order: ${orderId}`,
    value
  });
};

// Component to track page views for specific pages
export const PageViewTracker = ({ path }: { path: string }) => {
  useEffect(() => {
    gtag.pageview(path);
  }, [path]);

  return null;
};

export default PageViewTracker;