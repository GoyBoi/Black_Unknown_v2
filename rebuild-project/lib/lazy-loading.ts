// lib/lazy-loading.ts

// Define types for lazy loading
export interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Function to create an intersection observer for lazy loading
export const createLazyLoader = (
  callback: IntersectionObserverCallback,
  options: LazyLoadOptions = {}
): IntersectionObserver => {
  const observerOptions: IntersectionObserverInit = {
    root: options.root || null,
    rootMargin: options.rootMargin || '0px',
    threshold: options.threshold || 0.1, // Trigger when 10% of element is visible
  };

  return new IntersectionObserver(callback, observerOptions);
};

// Function to lazy load images
export const lazyLoadImage = (img: HTMLImageElement, src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      img.src = src;
      resolve();
    };
    image.onerror = reject;
    image.src = src;
  });
};

// Function to lazy load other resources (like iframes, scripts, etc.)
export const lazyLoadResource = (element: HTMLElement, resourceType: 'iframe' | 'script' | 'video' | 'other', src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (resourceType === 'iframe') {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.onload = () => {
          element.appendChild(iframe);
          resolve();
        };
        iframe.onerror = reject;
      } else if (resourceType === 'script') {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      } else if (resourceType === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.onloadeddata = () => {
          element.appendChild(video);
          resolve();
        };
        video.onerror = reject;
      } else {
        // For other resources, just set the src attribute
        (element as any).src = src;
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Function to preload resources when near viewport
export const preloadResource = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = src;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to prefetch ${src}`));
    document.head.appendChild(link);
  });
};

// Function to check if element is in viewport
export const isInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};