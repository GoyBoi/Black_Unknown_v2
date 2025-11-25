import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a150e] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 text-white mb-4">
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
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Black Unknown</h2>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-sm">
              Join our mailing list for exclusive collections, new arrivals and everything in between.
            </p>
            <form className="flex w-full max-w-sm">
              <input 
                className="flex-grow bg-white/5 border border-white/20 rounded-l-lg text-white placeholder-white/50 px-4 py-2 focus:ring-primary focus:border-primary text-sm" 
                placeholder="Enter your email" 
                type="email"
              />
              <button 
                className="bg-primary hover:bg-saffron-gold/90 text-black font-bold px-4 py-2 rounded-r-lg text-sm transition-colors" 
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition-colors block" href="/contact">Contact Us</Link></li>
              <li><Link className="hover:text-white transition-colors block" href="/shipping">Shipping</Link></li>
              <li><Link className="hover:text-white transition-colors block" href="/returns">Returns</Link></li>
              <li><Link className="hover:text-white transition-colors block" href="/faq">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-white transition-colors block" href="/about">Our Story</Link></li>
              <li><Link className="hover:text-white transition-colors block" href="/careers">Careers</Link></li>
              <li><Link className="hover:text-white transition-colors block" href="/press">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-white transition-colors block" href="#">Instagram</a></li>
              <li><a className="hover:text-white transition-colors block" href="#">Twitter</a></li>
              <li><a className="hover:text-white transition-colors block" href="#">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} Black Unknown. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;