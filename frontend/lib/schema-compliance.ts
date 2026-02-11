// lib/schema-compliance.ts

// Define types for schema compliance
export interface SchemaComplianceReport {
  id: string;
  timestamp: number;
  totalPages: number;
  compliantPages: number;
  nonCompliantPages: number;
  errors: SchemaValidationError[];
  warnings: SchemaWarning[];
  complianceRate: number;
  totalPagesChecked: number;
  pagesChecked: PageCompliance[];
}

export interface SchemaValidationError {
  id: string;
  pageUrl: string;
  schemaType: string;
  property: string;
  errorType: 'missing_required' | 'invalid_format' | 'incorrect_type' | 'deprecated_property';
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface SchemaWarning {
  id: string;
  pageUrl: string;
  schemaType: string;
  property: string;
  warningType: 'recommended_missing' | 'best_practice' | 'deprecated_usage';
  message: string;
}

export interface PageCompliance {
  url: string;
  schemaType: string;
  isValid: boolean;
  errors: SchemaValidationError[];
  warnings: SchemaWarning[];
  lastChecked: number;
}

export interface SchemaComplianceConfig {
  enabled: boolean;
  checkFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  notificationChannels: ('email' | 'dashboard' | 'webhook')[];
  requiredSchemas: string[]; // e.g., ['Product', 'Organization', 'Article']
  recommendedProperties: Record<string, string[]>; // e.g., {'Product': ['gtin', 'mpn', 'sku']}
  notificationThreshold: number; // Percentage of non-compliance that triggers notification
}

// In-memory storage for compliance reports (in production, this would be in a database)
const complianceReports: SchemaComplianceReport[] = [];
const schemaComplianceConfig: SchemaComplianceConfig = {
  enabled: true,
  checkFrequency: 'daily',
  notificationChannels: ['dashboard'],
  requiredSchemas: ['Product', 'Organization', 'Article'],
  recommendedProperties: {
    'Product': ['gtin', 'mpn', 'sku', 'brand', 'offers', 'description'],
    'Organization': ['name', 'url', 'logo', 'address'],
    'Article': ['headline', 'author', 'datePublished', 'image']
  },
  notificationThreshold: 10, // 10% non-compliance triggers notification
};

// Function to set schema compliance configuration
export const setSchemaComplianceConfig = (config: Partial<SchemaComplianceConfig>) => {
  Object.assign(schemaComplianceConfig, config);
};

// Function to get current schema compliance configuration
export const getSchemaComplianceConfig = (): SchemaComplianceConfig => {
  return { ...schemaComplianceConfig };
};

// Function to validate a schema against schema.org specifications
export const validateSchemaCompliance = (schema: any, pageUrl: string): { isValid: boolean; errors: SchemaValidationError[]; warnings: SchemaWarning[] } => {
  const errors: SchemaValidationError[] = [];
  const warnings: SchemaWarning[] = [];
  
  if (!schema) {
    errors.push({
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageUrl,
      schemaType: 'Unknown',
      property: '@context',
      errorType: 'missing_required',
      message: 'Schema is missing or invalid',
      severity: 'critical'
    });
    return { isValid: false, errors, warnings };
  }
  
  // Check for required @context
  if (!schema['@context']) {
    errors.push({
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageUrl,
      schemaType: schema['@type'] || 'Unknown',
      property: '@context',
      errorType: 'missing_required',
      message: 'Missing required @context property',
      severity: 'critical'
    });
  } else if (schema['@context'] !== 'https://schema.org/') {
    warnings.push({
      id: `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageUrl,
      schemaType: schema['@type'] || 'Unknown',
      property: '@context',
      warningType: 'best_practice',
      message: 'Using non-standard @context, recommended: https://schema.org/',
    });
  }
  
  // Check for required @type
  if (!schema['@type']) {
    errors.push({
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pageUrl,
      schemaType: 'Unknown',
      property: '@type',
      errorType: 'missing_required',
      message: 'Missing required @type property',
      severity: 'critical'
    });
  } else {
    const schemaType = schema['@type'];
    
    // Check if this is a required schema type
    if (schemaComplianceConfig.requiredSchemas.includes(schemaType)) {
      // Validate required properties based on schema type
      switch (schemaType) {
        case 'Product':
          validateProductSchema(schema, pageUrl, errors, warnings);
          break;
        case 'Organization':
          validateOrganizationSchema(schema, pageUrl, errors, warnings);
          break;
        case 'Article':
          validateArticleSchema(schema, pageUrl, errors, warnings);
          break;
        default:
          // For other types, just check if they have basic required properties
          validateGenericSchema(schema, pageUrl, errors, warnings);
      }
    }
    
    // Check for recommended properties
    const recommendedProps = schemaComplianceConfig.recommendedProperties[schemaType] || [];
    for (const prop of recommendedProps) {
      if (!schema.hasOwnProperty(prop)) {
        warnings.push({
          id: `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pageUrl,
          schemaType,
          property: prop,
          warningType: 'recommended_missing',
          message: `Recommended property '${prop}' is missing`,
        });
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Specific validation functions for different schema types
const validateProductSchema = (
  schema: any, 
  pageUrl: string, 
  errors: SchemaValidationError[], 
  warnings: SchemaWarning[]
) => {
  // Required properties for Product schema
  const requiredProps = ['name', 'image', 'description', 'offers'];
  
  for (const prop of requiredProps) {
    if (!schema[prop]) {
      errors.push({
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageUrl,
        schemaType: 'Product',
        property: prop,
        errorType: 'missing_required',
        message: `Missing required property '${prop}' for Product schema`,
        severity: 'high'
      });
    }
  }
  
  // Validate offers structure
  if (schema.offers) {
    if (Array.isArray(schema.offers)) {
      if (schema.offers.length === 0) {
        errors.push({
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pageUrl,
          schemaType: 'Product',
          property: 'offers',
          errorType: 'missing_required',
          message: 'Product offers array cannot be empty',
          severity: 'high'
        });
      } else {
        for (let i = 0; i < schema.offers.length; i++) {
          const offer = schema.offers[i];
          if (!offer.price || !offer.priceCurrency) {
            errors.push({
              id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              pageUrl,
              schemaType: 'Product',
              property: `offers[${i}]`,
              errorType: 'missing_required',
              message: `Offer at index ${i} is missing required properties: price and priceCurrency`,
              severity: 'high'
            });
          }
        }
      }
    } else {
      // Single offer object
      if (!schema.offers.price || !schema.offers.priceCurrency) {
        errors.push({
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          pageUrl,
          schemaType: 'Product',
          property: 'offers',
          errorType: 'missing_required',
          message: 'Product offer is missing required properties: price and priceCurrency',
          severity: 'high'
        });
      }
    }
  }
};

const validateOrganizationSchema = (
  schema: any, 
  pageUrl: string, 
  errors: SchemaValidationError[], 
  warnings: SchemaWarning[]
) => {
  // Required properties for Organization schema
  const requiredProps = ['name', 'url'];
  
  for (const prop of requiredProps) {
    if (!schema[prop]) {
      errors.push({
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageUrl,
        schemaType: 'Organization',
        property: prop,
        errorType: 'missing_required',
        message: `Missing required property '${prop}' for Organization schema`,
        severity: 'high'
      });
    }
  }
};

const validateArticleSchema = (
  schema: any, 
  pageUrl: string, 
  errors: SchemaValidationError[], 
  warnings: SchemaWarning[]
) => {
  // Required properties for Article schema
  const requiredProps = ['headline', 'datePublished'];
  
  for (const prop of requiredProps) {
    if (!schema[prop]) {
      errors.push({
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageUrl,
        schemaType: 'Article',
        property: prop,
        errorType: 'missing_required',
        message: `Missing required property '${prop}' for Article schema`,
        severity: 'high'
      });
    }
  }
};

const validateGenericSchema = (
  schema: any, 
  pageUrl: string, 
  errors: SchemaValidationError[], 
  warnings: SchemaWarning[]
) => {
  // For generic schemas, just ensure they have a name if it's a thing
  if (schema['@type'] && 
      (schema['@type'] === 'Thing' || schema['@type'].includes('CreativeWork'))) {
    if (!schema.name && !schema.headline) {
      warnings.push({
        id: `warn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        pageUrl,
        schemaType: schema['@type'],
        property: 'name',
        warningType: 'recommended_missing',
        message: `Recommended property 'name' or 'headline' is missing`,
      });
    }
  }
};

// Function to generate a schema compliance report
export const generateSchemaComplianceReport = async (urls: string[]): Promise<SchemaComplianceReport> => {
  const reportId = `compliance_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const errors: SchemaValidationError[] = [];
  const warnings: SchemaWarning[] = [];
  const pagesChecked: PageCompliance[] = [];
  
  // In a real implementation, this would fetch the HTML content of each page
  // and extract the schema.org structured data from the JSON-LD scripts
  for (const url of urls) {
    // Simulate fetching page content and extracting schema
    // In a real implementation, we would:
    // 1. Fetch the page HTML
    // 2. Parse for JSON-LD scripts
    // 3. Extract schema objects
    // 4. Validate each schema object
    
    // For this example, we'll simulate with mock data
    const mockSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: 'Sample Product',
      image: 'https://example.com/sample.jpg',
      description: 'Sample product description',
      offers: {
        '@type': 'Offer',
        price: '19.99',
        priceCurrency: 'USD'
      }
    };
    
    const validationResult = validateSchemaCompliance(mockSchema, url);
    
    pagesChecked.push({
      url,
      schemaType: mockSchema['@type'],
      isValid: validationResult.isValid,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      lastChecked: Date.now()
    });
    
    errors.push(...validationResult.errors);
    warnings.push(...validationResult.warnings);
  }
  
  const compliantPages = pagesChecked.filter(page => page.isValid).length;
  const nonCompliantPages = pagesChecked.length - compliantPages;
  const complianceRate = pagesChecked.length > 0 ? (compliantPages / pagesChecked.length) * 100 : 0;
  
  const report: SchemaComplianceReport = {
    id: reportId,
    timestamp: Date.now(),
    total: urls.length,
    compliant: compliantPages,
    nonCompliant: nonCompliantPages,
    errors,
    warnings,
    complianceRate,
    pagesChecked
  };
  
  // Add to reports history
  complianceReports.unshift(report);
  
  // Keep only the last 20 reports to prevent memory issues
  if (complianceReports.length > 20) {
    complianceReports.length = 20;
  }
  
  // Check if compliance rate is below threshold to trigger notification
  if (complianceConfig.enabled && (100 - complianceRate) > complianceConfig.notificationThreshold) {
    await sendComplianceAlert(report);
  }
  
  return report;
};

// Function to send compliance alert if needed
const sendComplianceAlert = async (report: SchemaComplianceReport) => {
  // In a real implementation, this would send notifications to configured channels
  console.log(`Schema compliance alert: ${report.nonCompliant} non-compliant pages out of ${report.total} (${(100 - report.complianceRate).toFixed(2)}% non-compliant)`);
  
  // Send notifications based on configured channels
  const promises: Promise<void>[] = [];
  
  if (complianceConfig.notificationChannels.includes('email')) {
    promises.push(sendEmailAlert(report));
  }
  
  if (complianceConfig.notificationChannels.includes('webhook')) {
    promises.push(sendWebhookAlert(report));
  }
  
  if (complianceConfig.notificationChannels.includes('dashboard')) {
    // Dashboard notifications are handled by storing the report
    console.log('Schema compliance alert logged to dashboard:', report);
  }
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending compliance alerts:', error);
  }
};

// Simulated notification functions
const sendEmailAlert = async (report: SchemaComplianceReport): Promise<void> => {
  // In a real implementation, this would send an email using a service like SendGrid, AWS SES, etc.
  console.log('Sending email compliance alert:', {
    to: 'admin@example.com',
    subject: `Schema Compliance Alert: ${(100 - report.complianceRate).toFixed(2)}% Non-Compliant`,
    report
  });
  
  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

const sendWebhookAlert = async (report: SchemaComplianceReport): Promise<void> => {
  // In a real implementation, this would send a POST request to the configured webhook URL
  console.log('Sending webhook compliance alert:', {
    url: 'configured-webhook-url',
    report
  });
  
  // Simulate API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to get all compliance reports
export const getComplianceReports = (limit?: number): SchemaComplianceReport[] => {
  return limit ? complianceReports.slice(0, limit) : [...complianceReports];
};

// Function to get the latest compliance report
export const getLatestComplianceReport = (): SchemaComplianceReport | undefined => {
  return complianceReports[0];
};

// Function to check compliance for a single page
export const checkPageCompliance = async (url: string): Promise<PageCompliance> => {
  // In a real implementation, this would fetch the page and validate its schema
  // For this example, we'll simulate with mock data
  
  // Simulate fetching page content and extracting schema
  const mockSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Sample Product',
    image: 'https://example.com/sample.jpg',
    description: 'Sample product description',
    offers: {
      '@type': 'Offer',
      price: '19.99',
      priceCurrency: 'USD'
    }
  };
  
  const validationResult = validateSchemaCompliance(mockSchema, url);
  
  const pageCompliance: PageCompliance = {
    url,
    schemaType: mockSchema['@type'],
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    lastChecked: Date.now()
  };
  
  return pageCompliance;
};

// Function to run a full site compliance scan
export const runFullComplianceScan = async (urls: string[]): Promise<SchemaComplianceReport> => {
  const report = await generateSchemaComplianceReport(urls);
  return report;
};