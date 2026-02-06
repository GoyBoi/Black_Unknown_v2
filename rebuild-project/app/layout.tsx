import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MMWAFRIKA PRIDE - Handcrafted Crochet Creations',
  description: 'Discover our exquisite collection of hand-knitted crochet items, from elegant clothes to adorable dolls and beautiful flowers, crafted with love and attention to detail.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable}`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}