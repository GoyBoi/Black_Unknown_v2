import React from 'react';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  category?: string;
  rating?: number;
  stock?: number;
  colors?: string[];
  sizes?: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  // Render star rating
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating || 0);
    const hasHalfStar = product.rating && product.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-gold fill-current" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-gold fill-current" />
      );
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gold" />
      );
    }
    
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-xs text-foreground/80">{product.rating}</span>
      </div>
    );
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-black/30 dark:hover:shadow-black/50 border border-transparent hover:border-gold/30">
      <div className="relative aspect-[3/4] w-full bg-foreground/10">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        <button className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full text-foreground/80 hover:text-gold transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
          <HeartIcon className="w-4 h-4" />
        </button>
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-2 py-1 rounded">
            {product.category}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4 bg-background text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/70 mb-1">
          {product.brand}
        </p>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-gold transition-colors duration-300 mb-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex justify-center my-1">
            {renderRating()}
          </div>
        )}
        
        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className={`text-xs font-medium ${product.stock > 5 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
            {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-foreground/20">
          <p className="text-lg font-bold text-foreground relative inline-block">
            <span className="relative z-10">R{product.price.toLocaleString()}</span>
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gold/30 -z-10"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;