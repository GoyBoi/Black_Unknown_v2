'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-background border border-foreground/20 rounded-lg p-6 relative">
            <button 
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <MagnifyingGlassIcon className="w-6 h-6 text-foreground/60" />
              <input
                type="text"
                placeholder="Search MMWAFRIKA PRIDE..."
                className="w-full bg-transparent text-foreground text-xl placeholder-foreground/60 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-background border border-foreground/20 rounded-lg p-6 relative">
            <button 
              onClick={() => setWishlistOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Wishlist</h2>
            <div className="text-foreground/80">Your wishlist items will appear here.</div>
          </div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 backdrop-blur-md transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 border-b border-gold/20'
            : 'bg-background/30'
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
          <Link href="/" className={`${isScrolled ? 'text-foreground' : 'text-foreground drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]'} text-lg font-bold tracking-[-0.015em]`}>
            MMWAFRIKA PRIDE
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-9">
          <div className="relative group">
            <Link href="/shop" className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} hover:text-gold text-sm font-medium leading-normal transition-colors duration-300 flex items-center`}>
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
          <Link href="/about" className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} hover:text-gold text-sm font-medium leading-normal transition-colors duration-300`}>
            About
          </Link>
        </nav>

        {/* Mobile Menu Button - Consolidated with icons */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setSearchModalOpen(true)}
            className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-foreground/10 transition-colors duration-300`}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setWishlistOpen(true)}
            className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-foreground/10 transition-colors duration-300 relative`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <ThemeToggle isScrolled={isScrolled} />
          <Link href="/cart" className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-gold/20 transition-colors duration-300 relative`}>
            <ShoppingBagIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              2
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-foreground/10 transition-colors duration-300`}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setSearchModalOpen(true)}
            className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-foreground/10 transition-colors duration-300`}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setWishlistOpen(true)}
            className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-foreground/10 transition-colors duration-300 relative`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <ThemeToggle isScrolled={isScrolled} />
          <Link href="/cart" className={`${isScrolled ? 'text-foreground/80' : 'text-foreground/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]'} p-2 rounded-full hover:bg-gold/20 transition-colors duration-300 relative`}>
            <ShoppingBagIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              2
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-16">
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col py-8">
              <div className="space-y-1 px-6">
                <Link
                  href="/"
                  className="block py-4 text-xl font-medium text-foreground hover:text-gold transition-colors border-b border-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="block py-4 text-xl font-medium text-foreground hover:text-gold transition-colors border-b border-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <details className="group">
                  <summary className="py-4 text-xl font-medium text-foreground hover:text-gold transition-colors border-b border-foreground/10 list-none cursor-pointer">
                    <span>Categories</span>
                    <svg className="float-right w-5 h-5 mt-1 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </summary>
                  <div className="pl-4 py-2 space-y-2">
                    <Link
                      href="/shop#clothes"
                      className="block py-2 text-lg text-foreground/80 hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Crochet Clothes
                    </Link>
                    <Link
                      href="/shop#dolls"
                      className="block py-2 text-lg text-foreground/80 hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Amigurumi Dolls
                    </Link>
                    <Link
                      href="/shop#flowers"
                      className="block py-2 text-lg text-foreground/80 hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Crochet Flowers
                    </Link>
                    <Link
                      href="/shop#home-decor"
                      className="block py-2 text-lg text-foreground/80 hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home Decor
                    </Link>
                  </div>
                </details>
                <Link
                  href="/about"
                  className="block py-4 text-xl font-medium text-foreground hover:text-gold transition-colors border-b border-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block py-4 text-xl font-medium text-foreground hover:text-gold transition-colors border-b border-foreground/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;