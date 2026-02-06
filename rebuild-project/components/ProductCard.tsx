import React from 'react';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
}

const ProductCard = ({ product }: { product: Product }) => {
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
        <div className="mt-2 pt-2 border-t border-foreground/20">
          <p className="text-lg font-bold text-foreground">
            R{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;