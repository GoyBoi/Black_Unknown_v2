// lib/structured-data.ts

// Define types for structured data
export interface BreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface ProductStructuredData {
  '@context': 'https://schema.org/';
  '@type': 'Product';
  name: string;
  image: string[];
  description: string;
  sku: string;
  mpn?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  review?: Review[];
  aggregateRating?: AggregateRating;
  offers: Offer;
  category?: string;
  color?: string;
  material?: string;
  gtin13?: string;
}

export interface Review {
  '@type': 'Review';
  reviewBody?: string;
  datePublished?: string;
  reviewRating: Rating;
  author: Author;
}

export interface Rating {
  '@type': 'Rating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
}

export interface Offer {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
  priceValidUntil?: string;
  availability: string;
  seller: {
    '@type': 'Organization';
    name: string;
  };
}

export interface Author {
  '@type': 'Person';
  name: string;
}

export interface OrganizationStructuredData {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  legalName: string;
  name: string;
  url: string;
  logo: string;
  foundingDate?: string;
  founders?: Person[];
  contactPoint: ContactPoint[];
  address: PostalAddress;
  sameAs: string[];
}

export interface Person {
  '@type': 'Person';
  name: string;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: string;
  areaServed?: string;
  availableLanguage?: string;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode: string;
  addressCountry: string;
}

// Function to generate breadcrumbs structured data
export const generateBreadcrumbs = (breadcrumbs: { name: string; url?: string }[]): BreadcrumbList => {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url && { item: `https://mmwafrikapride.com${crumb.url}` })
    }))
  };
};

// Function to generate product structured data
export const generateProductSchema = (product: {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category?: string;
  brand?: string;
  sku?: string;
  availability?: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder' | 'https://schema.org/InStoreOnly';
  rating?: number;
  reviewCount?: number;
  currency?: string;
}): ProductStructuredData => {
  const schema: ProductStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku || `SKU-${product.id}`,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency || 'ZAR',
      availability: product.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MMWAFRIKA PRIDE'
      }
    }
  };

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand
    };
  }

  if (product.category) {
    schema.category = product.category;
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  return schema;
};

// Function to generate organization structured data
export const generateOrganizationSchema = (): OrganizationStructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    legalName: 'MMWAFRIKA PRIDE',
    name: 'MMWAFRIKA PRIDE',
    url: 'https://mmwafrikapride.com',
    logo: 'https://mmwafrikapride.com/logo.png',
    foundingDate: '2020',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+27 12 345 6789',
        contactType: 'customer service',
        areaServed: 'ZA',
        availableLanguage: 'en'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Craft Street',
      addressLocality: 'Cape Town',
      postalCode: '8001',
      addressCountry: 'ZA'
    },
    sameAs: [
      'https://www.facebook.com/mmwafrikapride',
      'https://www.instagram.com/mmwafrikapride',
      'https://twitter.com/mmwafrikapride'
    ]
  };
};