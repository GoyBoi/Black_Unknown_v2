import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 text-foreground mb-4">
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
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">MMWAFRIKA PRIDE</h2>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Join our mailing list for exclusive crochet collections, new handmade arrivals and everything in between.
            </p>
            <form className="flex w-full max-w-sm">
              <input
                className="flex-grow bg-foreground/5 border border-foreground/20 rounded-l-lg text-foreground placeholder-foreground/50 px-4 py-2 focus:ring-gold focus:border-gold text-sm"
                placeholder="Enter your email"
                type="email"
              />
              <button
                className="bg-gold hover:bg-gold-light text-black font-bold px-4 py-2 rounded-r-lg text-sm transition-colors"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-gold transition-colors block" href="/contact">Contact Us</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/shipping">Shipping</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/returns">Returns</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/faq">FAQ</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/care">Care Instructions</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/size-guide">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-gold transition-colors block" href="/shop#clothes">Crochet Clothes</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/shop#dolls">Amigurumi Dolls</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/shop#flowers">Crochet Flowers</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/shop#home-decor">Home Decor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-gold transition-colors block" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/about">About Us</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/care">Care Guide</Link></li>
              <li><Link className="hover:text-gold transition-colors block" href="/testimonials">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-gold transition-colors block" href="https://instagram.com/mmwafrika" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className="hover:text-gold transition-colors block" href="https://twitter.com/mmwafrika" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a className="hover:text-gold transition-colors block" href="https://facebook.com/mmwafrika" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Trust & Security</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                </div>
                <span className="text-xs">Secure SSL</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-xs">Verified</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-xs">Fast Delivery</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-8 h-5 bg-gray-800 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">VISA</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-5 bg-blue-700 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">MC</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">AMEX</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-5 bg-green-600 rounded-sm flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">OZOW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-foreground/10 mt-12 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} MMWAFRIKA PRIDE. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;