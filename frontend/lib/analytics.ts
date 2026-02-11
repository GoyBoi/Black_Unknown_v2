// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Log the pageview with the given URL
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events happening
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// Track product view events
export const trackProductView = (productId: string, productName: string) => {
  event({
    action: 'view_item',
    category: 'ecommerce',
    label: `Product: ${productName}`,
    value: 0
  });
};

// Track add to cart events
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: `Product: ${productName}`,
    value: price
  });
};

// Track checkout events
export const trackBeginCheckout = (value: number) => {
  event({
    action: 'begin_checkout',
    category: 'ecommerce',
    label: 'Checkout Started',
    value
  });
};

// Track purchase events
export const trackPurchase = (transactionId: string, value: number) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    label: `Transaction: ${transactionId}`,
    value
  });
};