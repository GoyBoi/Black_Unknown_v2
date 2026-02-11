# MMWAFRIKA PRIDE - Tech Stack Documentation & Reusable E-commerce Redesign Prompt

## Tech Stack Documentation

Based on my analysis of the codebase, here's a comprehensive documentation of the tech stack used in the MMWAFRIKA PRIDE e-commerce platform:

### **Core Technologies**

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5+
- **Runtime**: Node.js
- **Styling**: Tailwind CSS 3.4.1 with PostCSS
- **Icons**: Heroicons React 2.1.3 and Lucide React 0.383.0
- **State Management**: React Context API with useReducer
- **Package Manager**: npm

### **UI/UX Libraries & Tools**

- **Styling Framework**: Tailwind CSS with custom configuration
- **Typography**: Google Fonts (Manrope and Playfair Display)
- **Animations**: CSS animations and transitions
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark/Light Mode**: Custom ThemeContext with localStorage persistence

### **Development Tools**

- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js compiler
- **Module Resolution**: Node module resolution
- **Code Formatting**: Prettier (implied from setup)

### **Project Structure**

```
├── app/                  # Next.js App Router pages
│   ├── about/           # About page
│   ├── api/             # API routes
│   ├── cart/            # Shopping cart page
│   ├── checkout/        # Checkout page
│   ├── contact/         # Contact page
│   ├── product/         # Dynamic product pages
│   ├── profile/         # User profile page
│   ├── shop/            # Product listing page
│   ├── wishlist/        # Wishlist page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/          # Reusable UI components
│   ├── Cart.tsx
│   ├── CartSummary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ThemeToggle.tsx
├── context/             # React Context providers
│   └── ThemeContext.tsx
├── lib/                 # Utility functions and contexts
│   ├── CartContext.tsx  # Shopping cart state management
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── scripts/             # Build scripts
```

### **Key Features & Functionality**

- **E-commerce Features**:
  - Shopping cart with add/remove/update quantity
  - Product catalog with filtering
  - Wishlist functionality
  - Checkout process
  - Payment options (Credit Card, Ozow, Bank Transfer)

- **UI/UX Features**:
  - Responsive design for all screen sizes
  - Dark/light mode toggle
  - Animated transitions and hover effects
  - Mobile-friendly navigation
  - Search functionality
  - Loading states and skeleton screens

- **Localization**:
  - South African market focus (ZAR currency, SA ID validation, VAT calculation)
  - Rastafarian-inspired color scheme with gold accents

### **Configuration Files**

- **next.config.js**: Image optimization with remote patterns
- **tailwind.config.js**: Custom theme with HSL color variables
- **tsconfig.json**: TypeScript configuration with Next.js plugin
- **package.json**: Dependencies and scripts
- **postcss.config.js**: PostCSS configuration

### **Performance Optimizations**

- **Image Optimization**: Next.js Image component with remote patterns
- **Code Splitting**: Automatic via Next.js
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Font Optimization**: Google Fonts with variable display

### **External Services Integration**

- **Image Hosting**: Google Cloud Storage, Unsplash, localhost
- **Payment Gateways**: Credit Card, Ozow, Bank Transfer (implementation likely in API routes)

---

## Reusable Prompt for E-commerce Website Redesign

Here's a comprehensive and reusable prompt for redesigning e-commerce websites similar to MMWAFRIKA PRIDE:

### **E-commerce Website Redesign Prompt Template**

**Objective**: Redesign an e-commerce website to enhance user experience, improve conversion rates, and modernize the visual design while maintaining brand identity.

**Brand Context**:
- Define the brand's core values, target audience, and unique selling proposition
- Specify the brand's cultural or regional focus (e.g., South African market, luxury fashion, artisanal products)
- Outline the brand's color palette and visual identity

**Technical Requirements**:
- Platform: Next.js 14+ with App Router
- Styling: Tailwind CSS with custom theme
- State Management: React Context API or preferred state management solution
- Responsive Design: Mobile-first approach with tablet and desktop optimization
- Performance: Optimized images, lazy loading, and fast loading times
- Accessibility: WCAG 2.1 AA compliance

**Design Elements**:
- Color Scheme: Primary, secondary, and accent colors with light/dark mode support
- Typography: Font families for headings, body text, and special elements
- Visual Hierarchy: Clear information architecture and content organization
- Iconography: Consistent icon set (e.g., Heroicons, Lucide React)
- Imagery: High-quality product photos with consistent styling

**User Experience Features**:
- Navigation: Intuitive menu structure with mobile optimization
- Search: Functional search with filters and sorting
- Product Pages: Detailed views with multiple images, descriptions, and reviews
- Shopping Cart: Persistent cart with add/remove/update functionality
- Checkout: Streamlined process with multiple payment options
- Account Area: User profile, order history, and wishlist

**Functional Requirements**:
- Product Catalog: Filtering, sorting, and category organization
- Shopping Cart: Cross-session persistence and quantity adjustments
- Wishlist: Save and share functionality
- User Accounts: Registration, login, and profile management
- Payment Processing: Integration with preferred payment gateways
- Order Management: Tracking and status updates

**Performance Considerations**:
- Page Speed: Optimize for Core Web Vitals
- SEO: Proper meta tags, structured data, and semantic HTML
- Caching: Implement appropriate caching strategies
- Image Optimization: Next.js Image component with proper sizing

**Regional/Local Considerations**:
- Currency: Local currency formatting and conversion
- Localization: Language, date formats, and cultural preferences
- Shipping: Regional shipping options and costs
- Legal: Privacy policy, terms of service, and cookie compliance

**Testing Requirements**:
- Cross-browser compatibility
- Mobile responsiveness testing
- Performance benchmarking
- User acceptance testing
- Accessibility auditing

**Deliverables**:
- Updated design files/mockups
- Component library documentation
- Frontend implementation
- Performance report
- Testing results