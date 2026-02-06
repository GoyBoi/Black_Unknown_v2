# MMWAFRIKA PRIDE - Luxury Fashion E-commerce

MMWAFRIKA PRIDE is a handcrafted crochet e-commerce platform featuring beautiful hand-knitted items from clothes to dolls and flowers. This Next.js application showcases our exquisite crochet creations with a modern UI, responsive design, and full e-commerce functionality.

## Features

- Next.js 14 with App Router
- TailwindCSS for styling
- Responsive design for all devices
- Dark mode support
- Product catalog with filtering and search
- Shopping cart functionality
- Product detail pages
- About and contact pages
- South African market focus

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Heroicons and Lucide React
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
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
├── components/          # Reusable UI components
├── lib/                 # Utility functions
├── public/              # Static assets
└── styles/              # Global styles
```

## Deployment

This app is ready for deployment on Vercel, Netlify, or any other platform that supports Next.js applications.

## About MMWAFRIKA PRIDE

MMWAFRIKA PRIDE represents the art of anonymity in fashion, where subtlety and craftsmanship take precedence over ostentatious display. We create pieces that speak to the discerning individual who values quality and timeless design over fleeting trends.

© {new Date().getFullYear()} MMWAFRIKA PRIDE. All Rights Reserved.