// components/StructuredData.tsx
import React from 'react';
import { JsonLd } from 'react-schemaorg';
import {
  generateBreadcrumbs,
  generateProductSchema,
  generateOrganizationSchema,
  BreadcrumbList,
  ProductStructuredData,
  OrganizationStructuredData
} from '@/lib/structured-data';

interface StructuredDataProps {
  type: 'breadcrumb' | 'product' | 'organization' | 'custom';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  switch (type) {
    case 'breadcrumb':
      return <JsonLd<BreadcrumbList> item={generateBreadcrumbs(data)} />;
    
    case 'product':
      return <JsonLd<ProductStructuredData> item={generateProductSchema(data)} />;
    
    case 'organization':
      return <JsonLd<OrganizationStructuredData> item={generateOrganizationSchema()} />;
    
    case 'custom':
      return <JsonLd item={data} />;
    
    default:
      return null;
  }
};

export default StructuredData;

// Export helper components for specific use cases
interface BreadcrumbStructuredDataProps {
  breadcrumbs: { name: string; url?: string }[];
}

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ breadcrumbs }) => {
  return <StructuredData type="breadcrumb" data={breadcrumbs} />;
};

interface ProductStructuredDataProps {
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
  };
}

export const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({ product }) => {
  return <StructuredData type="product" data={product} />;
};