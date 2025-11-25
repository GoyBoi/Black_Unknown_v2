'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 text-primary flex items-center justify-center">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path 
              clipRule="evenodd" 
              d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" 
              fill="currentColor" 
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <Link href="/" className="text-white text-lg font-bold tracking-[-0.015em]">
          Black Unknown
        </Link>
      </div>

      <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
        <Link href="/shop" className="text-white/80 hover:text-primary text-sm font-medium leading-normal transition-colors">
          New Arrivals
        </Link>
        <Link href="/shop" className="text-white/80 hover:text-primary text-sm font-medium leading-normal transition-colors">
          Collections
        </Link>
        <Link href="/shop" className="text-white/80 hover:text-primary text-sm font-medium leading-normal transition-colors">
          Accessories
        </Link>
        <Link href="/about" className="text-white/80 hover:text-primary text-sm font-medium leading-normal transition-colors">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors">
          <UserIcon className="w-5 h-5" />
        </button>
        <Link href="/cart" className="p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors relative">
          <ShoppingBagIcon className="w-5 h-5" />
          <span className="absolute top-0 right-0 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;