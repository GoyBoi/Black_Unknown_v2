# MMWAFRIKA PRIDE - Luxury Crochet E-commerce

MMWAFRIKA PRIDE is a premium handcrafted crochet e-commerce platform featuring beautiful hand-knitted items from clothes to dolls and flowers. This Next.js application showcases our exquisite crochet creations with a modern UI, responsive design, and full e-commerce functionality.

## Features

- Next.js 14 with App Router
- TailwindCSS for styling
- Responsive design for all devices
- Dual theme support (light/dark mode)
- Product catalog with advanced filtering and search
- Shopping cart and wishlist functionality
- Multiple payment options (Credit Card, Ozow, Bank Transfer)
- Product detail pages
- About and contact pages
- South African market focus
- Rastafarian-inspired color scheme with gold accents
- Enhanced product cards with crochet texture effects
- Improved mobile navigation with collapsible menu
- Optimized performance and SEO
- Elegant animated gradients with Rastafarian colors
- Improved loading states with skeleton screens
- Better visual hierarchy and typography

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Heroicons and Lucide React
- **State Management**: React Context API
- **Package Manager**: npm/yarn/pnpm

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Project Structure

```
├── app/                  # Next.js 14 App Router pages
│   ├── cart/             # Shopping cart page
│   ├── product/[id]/     # Dynamic product pages
│   ├── shop/             # Product listing page
│   ├── about/            # About page
│   ├── wishlist/         # Wishlist page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
├── components/          # Reusable UI components
├── context/             # React Context providers
├── lib/                 # Utility functions
├── public/              # Static assets
└── app/                 # Global styles and configuration
```

## Recent Improvements

### UI/UX Enhancements
- **Enhanced Product Cards**: Improved product cards with better typography, hover animations, and visual hierarchy
- **Mobile Navigation**: Improved mobile menu with collapsible categories and better organization
- **Color Scheme**: Implemented Rastafarian-inspired color palette with gold accents
- **Text Styling**: Added crochet-style text effects with animated gradients
- **Section Layouts**: Enhanced featured and new arrivals sections with better visual elements
- **Placeholder Images**: Upgraded placeholder backgrounds with elegant stone gradients
- **Loading States**: Implemented elegant skeleton loading states with animated pulse effect

### Functionality Improvements
- **Search Feature**: Added functional search modal with proper UI
- **Wishlist Feature**: Implemented wishlist functionality with modal display
- **Theme Toggle**: Fully functional light/dark mode toggle
- **Responsive Design**: Improved mobile and tablet responsiveness
- **Accessibility**: Enhanced accessibility features throughout the site
- **Payment Options**: Added Ozow and bank transfer payment methods for South African customers
- **Checkout Process**: Enhanced checkout with multiple payment gateway options

### Performance Improvements
- **Optimized Images**: Better image loading and optimization
- **Code Splitting**: Improved code splitting for faster loading
- **Bundle Size**: Reduced bundle size for better performance

## Deployment

This app is ready for deployment on Vercel, Netlify, or any other platform that supports Next.js applications.

## About MMWAFRIKA PRIDE

MMWAFRIKA PRIDE represents the art of traditional crochet craftsmanship, where skill and creativity take precedence over mass production. We create unique, hand-knitted pieces that celebrate the beauty of handmade artistry and preserve traditional crafts for future generations.

© {new Date().getFullYear()} MMWAFRIKA PRIDE. All Rights Reserved.