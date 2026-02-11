// components/OptimizedImage.tsx
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import LazyLoadWrapper from './LazyLoadWrapper';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  alt: string;
  priority?: boolean;
  className?: string;
  placeholderType?: 'blur' | 'color' | 'dominant';
  lazyLoad?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  placeholderType = 'dominant',
  lazyLoad = true,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate dominant color placeholder from image URL
  const getDominantColorPlaceholder = () => {
    // Extract dominant color from image URL or use default
    // This is a simplified approach - in a real implementation, you'd want to extract actual dominant color
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E`;
  };

  if (hasError) {
    // Fallback to a placeholder if image fails to load
    return (
      <div 
        className={`bg-foreground/10 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-foreground/50 text-sm">Image unavailable</span>
      </div>
    );
  }

  const imageContent = (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`duration-700 ease-in-out object-cover ${
          isLoading 
            ? placeholderType === 'blur' 
              ? 'blur-sm scale-105' 
              : placeholderType === 'color' 
                ? 'bg-foreground/10' 
                : 'bg-foreground/10'
            : 'blur-0 scale-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-foreground/10 flex items-center justify-center"
          style={{
            backgroundImage: placeholderType === 'dominant' 
              ? `url("${getDominantColorPlaceholder()}")` 
              : 'none'
          }}
        >
          {!priority && (
            <div className="animate-pulse w-full h-full bg-foreground/20" />
          )}
        </div>
      )}
    </div>
  );

  // Conditionally wrap with LazyLoadWrapper if lazy loading is enabled and not a priority image
  if (lazyLoad && !priority) {
    return (
      <LazyLoadWrapper>
        {imageContent}
      </LazyLoadWrapper>
    );
  }

  return imageContent;
};

export default OptimizedImage;