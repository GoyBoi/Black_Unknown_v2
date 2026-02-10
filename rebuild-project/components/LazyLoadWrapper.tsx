// components/LazyLoadWrapper.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createLazyLoader, isInViewport } from '@/lib/lazy-loading';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback = <div className="bg-foreground/10 animate-pulse" style={{ height: '200px' }} />,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isVisible) return; // Already loaded

    // Check if element is already in viewport
    if (wrapperRef.current && isInViewport(wrapperRef.current)) {
      setIsVisible(true);
      return;
    }

    // Create intersection observer
    loaderRef.current = createLazyLoader(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Stop observing once element is visible
            if (loaderRef.current) {
              loaderRef.current.unobserve(entry.target);
              loaderRef.current.disconnect();
            }
          }
        });
      },
      { rootMargin, threshold }
    );

    // Start observing
    if (wrapperRef.current) {
      loaderRef.current.observe(wrapperRef.current);
    }

    // Cleanup
    return () => {
      if (loaderRef.current) {
        loaderRef.current.disconnect();
      }
    };
  }, [isVisible, rootMargin, threshold]);

  return (
    <div ref={wrapperRef} className={className} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyLoadWrapper;