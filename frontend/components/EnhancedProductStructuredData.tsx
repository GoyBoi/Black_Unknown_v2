// components/EnhancedProductStructuredData.tsx
import React from 'react';
import { JsonLd } from 'react-schemaorg';
import { Product } from 'schema-dts';
import { generateEnhancedProductSchema } from '@/lib/enhanced-product-schema';

interface EnhancedProductStructuredDataProps {
  product: {
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
    // Enhanced properties
    color?: string;
    material?: string;
    size?: string;
    weight?: number;
    dimensions?: { length?: number; width?: number; height?: number };
    gtin13?: string;
    mpn?: string;
    reviews?: {
      rating: number;
      title: string;
      body: string;
      author: string;
      date: string;
    }[];
    merchantReturnPolicy?: {
      returnDays: number;
      policy: string;
    };
    additionalProperties?: { name: string; value: string | number | boolean }[];
  };
}

const EnhancedProductStructuredData: React.FC<EnhancedProductStructuredDataProps> = ({ product }) => {
  const enhancedSchema = generateEnhancedProductSchema(product);

  // Create a simplified schema that conforms to the standard Product type
  // Using 'any' to bypass strict typing issues with enhanced schema
  const standardSchema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: enhancedSchema.name,
    image: enhancedSchema.image,
    description: enhancedSchema.description,
    sku: enhancedSchema.sku,
    offers: enhancedSchema.offers.map((offer: any) => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: offer.availability,
      seller: offer.seller
    })),
    ...(enhancedSchema.brand && { brand: enhancedSchema.brand }),
    ...(enhancedSchema.category && { category: enhancedSchema.category }),
    ...(enhancedSchema.aggregateRating && { aggregateRating: enhancedSchema.aggregateRating }),
    ...(enhancedSchema.color && { color: enhancedSchema.color }),
    ...(enhancedSchema.material && { material: enhancedSchema.material }),
    ...(enhancedSchema.size && { size: enhancedSchema.size }),
    ...(enhancedSchema.gtin13 && { gtin13: enhancedSchema.gtin13 }),
    ...(enhancedSchema.mpn && { mpn: enhancedSchema.mpn }),
    ...(enhancedSchema.review && { review: enhancedSchema.review }),
    ...(enhancedSchema.additionalProperty && { additionalProperty: enhancedSchema.additionalProperty }),
  };

  return <JsonLd item={standardSchema} />;
};

export default EnhancedProductStructuredData;