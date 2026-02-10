import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { RecentlyViewedProvider } from '@/lib/RecentlyViewedContext';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { GoogleAnalytics } from './analytics';
import PerformanceObserver from '@/components/PerformanceObserver';
import { ABTestProvider } from '@/components/ABTest';
import ErrorTrackingProvider from '@/components/ErrorTrackingProvider';
import SessionRecorder from '@/components/SessionRecorder';
import AccessibilityChecker from '@/components/AccessibilityChecker';

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
  title: {
    default: 'MMWAFRIKA PRIDE - Handcrafted Crochet Creations',
    template: '%s | MMWAFRIKA PRIDE'
  },
  description: 'Discover our exquisite collection of hand-knitted crochet items, from elegant clothes to adorable dolls and beautiful flowers, crafted with love and attention to detail.',
  keywords: ['crochet', 'handmade', 'crafts', 'fashion', 'accessories', 'South Africa', 'artisan', 'sustainable fashion'],
  authors: [{ name: 'MMWAFRIKA PRIDE', url: 'https://mmwafrika.com' }],
  creator: 'MMWAFRIKA PRIDE',
  publisher: 'MMWAFRIKA PRIDE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mmwafrika.com',
    title: 'MMWAFRIKA PRIDE - Handcrafted Crochet Creations',
    description: 'Discover our exquisite collection of hand-knitted crochet items, from elegant clothes to adorable dolls and beautiful flowers, crafted with love and attention to detail.',
    siteName: 'MMWAFRIKA PRIDE',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MMWAFRIKA PRIDE - Handcrafted Crochet Creations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMWAFRIKA PRIDE - Handcrafted Crochet Creations',
    description: 'Discover our exquisite collection of hand-knitted crochet items, from elegant clothes to adorable dolls and beautiful flowers, crafted with love and attention to detail.',
    images: ['/opengraph-image.jpg'],
    creator: '@mmwafrika',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <PerformanceObserver />
        <GoogleAnalytics />
        <ServiceWorkerRegistration />
        <ErrorTrackingProvider>
          <ABTestProvider>
            <ThemeProvider>
              <CartProvider>
                <RecentlyViewedProvider>
                  {children}
                </RecentlyViewedProvider>
              </CartProvider>
            </ThemeProvider>
          </ABTestProvider>
        </ErrorTrackingProvider>
        <SessionRecorder />
        <AccessibilityChecker />
      </body>
    </html>
  );
}