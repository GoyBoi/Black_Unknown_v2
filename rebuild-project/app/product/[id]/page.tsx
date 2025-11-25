'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample product data
  const product = {
    id: 1,
    name: 'Midnight Silk Scarf',
    price: 220,
    description: 'The Midnight Silk Scarf is a testament to timeless elegance and unparalleled craftsmanship. Meticulously woven from the finest silk, it features an intricate pattern inspired by the enigmatic beauty of the night sky. The subtle sheen of the fabric catches light in a way that's both understated and captivating, making it a versatile piece that complements both casual and formal attire.',
    brand: 'mmwAfrika Pride',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmfKkJ2Upa5XThXxyPAmV1PO_j1fyx4Ay5sGty0S27uDHPEcP5hx3a8nE_tc9D1Bj35GQAlzRzSu7XZNsOsIXWWRgVa4U_3KZGc9cxnX8xqRtpYAEsgK5qUEE2KeSNL_lCJpNpFKyfd1eFMUAxWcK3gnWIhHtlKladaVrh8BDxe-88bjEBnhQE1hHO0uOKknTvXL8ntRW6iaYzZZoexl39E5GQFVEDLRmkCpSu5Pz8cQ_ZClLYEOBxIq5SCipSL6f9xRMGqJgSeRXL',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588588226363-b409e3a34e91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/shop" className="flex items-center text-white/80 hover:text-white mb-8">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-800 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-stone-800 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-sm uppercase tracking-wider">{product.brand}</p>
                <h1 className="text-3xl font-bold text-white mt-1">{product.name}</h1>
                <p className="text-2xl font-bold text-primary mt-4">R{product.price.toLocaleString()}</p>
              </div>
              <button className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10">
                <HeartIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-white/80 mt-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8">
              <h3 className="text-white font-medium mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                      selectedSize === size
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/20 text-white/80 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-white font-medium mb-3">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 rounded-l-lg border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <div className="w-12 h-10 border-y border-white/20 text-white flex items-center justify-center">
                  {quantity}
                </div>
                <button
                  className="w-10 h-10 rounded-r-lg border border-white/20 text-white/80 hover:bg-white/10 flex items-center justify-center"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary text-black py-4 px-6 rounded-lg font-bold hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
              <button className="flex-1 border border-white/20 text-white py-4 px-6 rounded-lg font-bold hover:bg-white/10 transition-colors">
                Add to Wishlist
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <h3 className="text-white font-medium mb-3">Product Details</h3>
              <ul className="text-white/80 space-y-2">
                <li className="flex justify-between">
                  <span>Material</span>
                  <span>Silk</span>
                </li>
                <li className="flex justify-between">
                  <span>Pattern</span>
                  <span>Intricate Night Sky</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimensions</span>
                  <span>70cm x 180cm</span>
                </li>
                <li className="flex justify-between">
                  <span>Care Instructions</span>
                  <span>Dry Clean Only</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;