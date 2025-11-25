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
    <div className="group relative flex flex-col overflow-hidden rounded-lg transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50">
      <div className="relative aspect-[3/4] w-full bg-stone-800">
        <img
          className="h-full w-full object-cover"
          src={product.image}
          alt={product.name}
        />
        <button className="absolute top-3 right-3 z-10 p-1.5 bg-background/80 dark:bg-background/80 rounded-full text-stone-800 dark:text-stone-300 hover:text-primary dark:hover:text-primary transition-colors duration-300">
          <HeartIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-4 bg-background dark:bg-background border border-t-0 border-transparent group-hover:border-primary transition-colors duration-300">
        <p className="text-xs font-normal uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {product.brand}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold leading-tight tracking-tight text-stone-900 dark:text-white group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <p className="text-base font-normal text-stone-700 dark:text-stone-300">
          R{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;