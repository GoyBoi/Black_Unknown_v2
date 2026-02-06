'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ThemeToggle';

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
          ? 'bg-background/90 border-b border-gold/20'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 text-foreground flex items-center justify-center">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <Link href="/" className="text-foreground text-lg font-bold tracking-[-0.015em]">
          MMWAFRIKA PRIDE
        </Link>
      </div>

      <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
        <div className="relative group">
          <Link href="/shop" className="text-foreground/80 hover:text-gold text-sm font-medium leading-normal transition-colors duration-300 flex items-center">
            Products
            <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </Link>
          
          {/* Dropdown menu - hidden by default, shown on hover */}
          <div className="absolute left-0 mt-2 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-50">
            <div className="py-2">
              <Link href="/shop#clothes" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/10 hover:text-gold transition-colors">Crochet Clothes</Link>
              <Link href="/shop#dolls" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/10 hover:text-gold transition-colors">Amigurumi Dolls</Link>
              <Link href="/shop#flowers" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/10 hover:text-gold transition-colors">Crochet Flowers</Link>
              <Link href="/shop#home-decor" className="block px-4 py-2 text-sm text-foreground/80 hover:bg-foreground/10 hover:text-gold transition-colors">Home Decor</Link>
            </div>
          </div>
        </div>
        <Link href="/about" className="text-foreground/80 hover:text-gold text-sm font-medium leading-normal transition-colors duration-300">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors duration-300">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full text-foreground/80 hover:bg-foreground/10 transition-colors duration-300 relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <ThemeToggle />
        <Link href="/cart" className="p-2 rounded-full text-foreground/80 hover:bg-gold/20 transition-colors duration-300 relative">
          <ShoppingBagIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            2
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;