// lib/enhanced-product-schema.ts

import { ProductStructuredData } from './structured-data';

// Define enhanced product schema types
export interface EnhancedProductStructuredData extends ProductStructuredData {
  '@type': 'Product';
  additionalProperty?: PropertyValue[];
  hasMerchantReturnPolicy?: MerchantReturnPolicy;
  offers: EnhancedOffer[];
  aggregateRating?: EnhancedAggregateRating;
  review?: EnhancedReview[];
  brand?: Brand;
  category?: string;
  depth?: QuantitativeValue;
  width?: QuantitativeValue;
  height?: QuantitativeValue;
  weight?: QuantitativeValue;
  gtin?: string;
  gtin12?: string;
  gtin13?: string;
  gtin14?: string;
  gtin8?: string;
  isbn?: string;
  mpn?: string;
  sku?: string;
  slogan?: string;
  material?: string;
  color?: string;
  pattern?: string;
  size?: string;
  productionDate?: string;
  award?: string;
  countryOfOrigin?: string;
  hasAdultConsideration?: AdultConsideration;
}

export interface PropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string | number | boolean;
  propertyID?: string;
}

export interface EnhancedOffer {
  '@type': 'Offer';
  price: string;
  priceCurrency: string;
  priceSpecification?: PriceSpecification;
  availability: string;
  availabilityAtOrFrom?: Place;
  availableDeliveryMethod?: DeliveryMethod;
  eligibleCustomerType?: string;
  eligibleDuration?: Duration;
  eligibleQuantity?: QuantitativeValue;
  eligibleRegion?: string | AdministrativeArea;
  eligibleTransactionVolume?: PriceSpecification;
  inventoryLevel?: QuantitativeValue;
  itemCondition?: string;
  seller: Organization;
  serialNumber?: string;
  warranty?: WarrantyPromise;
}

export interface EnhancedAggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
  ratingExplanation?: string;
  itemReviewed?: ProductStructuredData;
}

export interface EnhancedReview {
  '@type': 'Review';
  reviewBody?: string;
  datePublished?: string;
  reviewAspect?: string;
  reviewRating: Rating;
  author: Author;
  publisher?: Organization;
}

export interface Brand {
  '@type': 'Brand';
  name: string;
  logo?: string;
  slogan?: string;
}

export interface QuantitativeValue {
  '@type': 'QuantitativeValue';
  value: number;
  unitCode?: string;
  unitText?: string;
}

export interface MerchantReturnPolicy {
  '@type': 'MerchantReturnPolicy';
  applicableCountry?: string;
  customerRemorseReturnEligible?: boolean;
  itemDefectReturnEligible?: boolean;
  merchantReturnDays?: number;
  refundType?: string;
  returnPolicyCategory?: string;
}

export interface AdultConsideration {
  '@type': 'AdultConsideration';
  alcoholContent?: QuantitativeValue;
  isAdult?: boolean;
  tobaccoContent?: boolean;
}

// Enhanced function to generate product structured data
export const generateEnhancedProductSchema = (product: {
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
}): EnhancedProductStructuredData => {
  const schema: EnhancedProductStructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku || `SKU-${product.id}`,
    offers: [{
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency || 'ZAR',
      availability: product.availability || 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MMWAFRIKA PRIDE'
      }
    }],
    additionalProperty: []
  };

  // Add brand if available
  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand
    };
  }

  // Add category if available
  if (product.category) {
    schema.category = product.category;
  }

  // Add rating and review count if available
  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  // Add color if available
  if (product.color) {
    schema.color = product.color;
    schema.additionalProperty?.push({
      '@type': 'PropertyValue',
      name: 'Color',
      value: product.color
    });
  }

  // Add material if available
  if (product.material) {
    schema.material = product.material;
    schema.additionalProperty?.push({
      '@type': 'PropertyValue',
      name: 'Material',
      value: product.material
    });
  }

  // Add size if available
  if (product.size) {
    schema.size = product.size;
    schema.additionalProperty?.push({
      '@type': 'PropertyValue',
      name: 'Size',
      value: product.size
    });
  }

  // Add weight if available
  if (product.weight) {
    schema.weight = {
      '@type': 'QuantitativeValue',
      value: product.weight,
      unitCode: 'GRM' // Grams
    };
    schema.additionalProperty?.push({
      '@type': 'PropertyValue',
      name: 'Weight',
      value: `${product.weight}g`
    });
  }

  // Add dimensions if available
  if (product.dimensions) {
    if (product.dimensions.length) {
      schema.depth = {
        '@type': 'QuantitativeValue',
        value: product.dimensions.length,
        unitCode: 'MTR' // Meters
      };
    }
    if (product.dimensions.width) {
      schema.width = {
        '@type': 'QuantitativeValue',
        value: product.dimensions.width,
        unitCode: 'MTR'
      };
    }
    if (product.dimensions.height) {
      schema.height = {
        '@type': 'QuantitativeValue',
        value: product.dimensions.height,
        unitCode: 'MTR'
      };
    }
  }

  // Add GTIN if available
  if (product.gtin13) {
    schema.gtin13 = product.gtin13;
  }

  // Add MPN if available
  if (product.mpn) {
    schema.mpn = product.mpn;
  }

  // Add reviews if available
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map(review => ({
      '@type': 'Review',
      reviewBody: review.body,
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Person',
        name: review.author
      }
    }));
  }

  // Add merchant return policy if available
  if (product.merchantReturnPolicy) {
    schema.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      merchantReturnDays: product.merchantReturnPolicy.returnDays,
      returnPolicyCategory: product.merchantReturnPolicy.policy
    };
  }

  // Add additional properties if available
  if (product.additionalProperties && product.additionalProperties.length > 0) {
    product.additionalProperties.forEach(prop => {
      schema.additionalProperty?.push({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value
      });
    });
  }

  return schema;
};