import React from 'react';
import Link from 'next/link';

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-foreground/5 border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              MMWAFRIKA PRIDE
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><Link href="/shop" className="hover:text-gold transition-colors">Shop</Link></li>
                <li><Link href="/blog" className="text-gold font-medium">Blog</Link></li>
                <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="bg-foreground/5 border-t border-foreground/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8">
          <p className="text-center text-foreground/60">
            © {new Date().getFullYear()} MMWAFRIKA PRIDE. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;