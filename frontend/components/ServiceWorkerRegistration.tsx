'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
        } catch (error) {
          console.log('SW registration failed: ', error);
        }
      };

      // Wait for the page to be fully loaded
      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', registerServiceWorker);
      } else {
        registerServiceWorker();
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ServiceWorkerRegistration;