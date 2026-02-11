// lib/schema-validation.ts

// Define types for schema validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface SchemaValidationOptions {
  strictMode?: boolean;
  validateRequiredFields?: boolean;
  validateTypes?: boolean;
  validateUrls?: boolean;
  validateImages?: boolean;
}

// Function to validate a product schema
export const validateProductSchema = (
  productSchema: any,
  options: SchemaValidationOptions = {}
): ValidationResult => {
  const { 
    strictMode = false, 
    validateRequiredFields = true, 
    validateTypes = true,
    validateUrls = true,
    validateImages = true
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check required fields
  if (validateRequiredFields) {
    const requiredFields = ['@context', '@type', 'name', 'image', 'description', 'offers'];
    for (const field of requiredFields) {
      if (!productSchema[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check if @type is Product
    if (productSchema['@type'] !== 'Product') {
      errors.push(`@type should be 'Product', got '${productSchema['@type']}'`);
    }

    // Validate offers structure
    if (productSchema.offers) {
      if (Array.isArray(productSchema.offers)) {
        if (productSchema.offers.length === 0) {
          errors.push('Offers array cannot be empty');
        } else {
          for (let i = 0; i < productSchema.offers.length; i++) {
            const offer = productSchema.offers[i];
            if (!offer.price || !offer.priceCurrency) {
              errors.push(`Offer at index ${i} is missing required fields: price and priceCurrency`);
            }
          }
        }
      } else {
        // Single offer object
        if (!productSchema.offers.price || !productSchema.offers.priceCurrency) {
          errors.push('Offer is missing required fields: price and priceCurrency');
        }
      }
    }
  }

  // Validate types
  if (validateTypes) {
    if (productSchema.name && typeof productSchema.name !== 'string') {
      errors.push('name must be a string');
    }

    if (productSchema.description && typeof productSchema.description !== 'string') {
      errors.push('description must be a string');
    }

    if (productSchema.image) {
      if (typeof productSchema.image === 'string') {
        // Valid
      } else if (Array.isArray(productSchema.image)) {
        // Valid
      } else {
        errors.push('image must be a string or array of strings');
      }
    }

    if (productSchema.offers) {
      if (Array.isArray(productSchema.offers)) {
        for (let i = 0; i < productSchema.offers.length; i++) {
          const offer = productSchema.offers[i];
          if (typeof offer.price !== 'string' && typeof offer.price !== 'number') {
            errors.push(`Offer at index ${i} price must be a string or number`);
          }
          if (typeof offer.priceCurrency !== 'string') {
            errors.push(`Offer at index ${i} priceCurrency must be a string`);
          }
        }
      } else {
        // Single offer object
        if (typeof productSchema.offers.price !== 'string' && typeof productSchema.offers.price !== 'number') {
          errors.push('Offer price must be a string or number');
        }
        if (typeof productSchema.offers.priceCurrency !== 'string') {
          errors.push('Offer priceCurrency must be a string');
        }
      }
    }
  }

  // Validate URLs
  if (validateUrls) {
    if (productSchema.image) {
      const images = Array.isArray(productSchema.image) ? productSchema.image : [productSchema.image];
      for (const img of images) {
        if (typeof img === 'string' && !isValidUrl(img)) {
          warnings.push(`Invalid image URL: ${img}`);
        }
      }
    }

    if (productSchema.url && !isValidUrl(productSchema.url)) {
      warnings.push(`Invalid product URL: ${productSchema.url}`);
    }
  }

  // Validate images
  if (validateImages) {
    if (productSchema.image) {
      const images = Array.isArray(productSchema.image) ? productSchema.image : [productSchema.image];
      for (const img of images) {
        if (typeof img === 'string' && !isValidImageUrl(img)) {
          warnings.push(`Potential invalid image URL: ${img}`);
        }
      }
    }
  }

  // Additional validations based on schema.org guidelines
  if (productSchema.aggregateRating) {
    if (typeof productSchema.aggregateRating.ratingValue !== 'number') {
      errors.push('aggregateRating.ratingValue must be a number');
    }
    if (productSchema.aggregateRating.bestRating !== undefined && typeof productSchema.aggregateRating.bestRating !== 'number') {
      errors.push('aggregateRating.bestRating must be a number');
    }
    if (productSchema.aggregateRating.worstRating !== undefined && typeof productSchema.aggregateRating.worstRating !== 'number') {
      errors.push('aggregateRating.worstRating must be a number');
    }
  }

  if (productSchema.brand && typeof productSchema.brand !== 'object') {
    warnings.push('brand should be an object with @type and name properties');
  }

  // Add suggestions for better schema compliance
  if (!productSchema.sku) {
    suggestions.push('Consider adding SKU for better product identification');
  }

  if (!productSchema.mpn) {
    suggestions.push('Consider adding MPN (Manufacturer Part Number)');
  }

  if (!productSchema.gtin13) {
    suggestions.push('Consider adding GTIN-13 for global product identification');
  }

  if (!productSchema.category) {
    suggestions.push('Consider adding category for better product classification');
  }

  if (!productSchema.aggregateRating) {
    suggestions.push('Consider adding aggregateRating to show product reviews');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Function to validate an organization schema
export const validateOrganizationSchema = (
  orgSchema: any,
  options: SchemaValidationOptions = {}
): ValidationResult => {
  const { 
    strictMode = false, 
    validateRequiredFields = true, 
    validateTypes = true,
    validateUrls = true
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check required fields
  if (validateRequiredFields) {
    const requiredFields = ['@context', '@type', 'name', 'url'];
    for (const field of requiredFields) {
      if (!orgSchema[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check if @type is Organization
    if (orgSchema['@type'] !== 'Organization' && orgSchema['@type'] !== 'Corporation') {
      errors.push(`@type should be 'Organization' or 'Corporation', got '${orgSchema['@type']}'`);
    }
  }

  // Validate types
  if (validateTypes) {
    if (orgSchema.name && typeof orgSchema.name !== 'string') {
      errors.push('name must be a string');
    }

    if (orgSchema.url && typeof orgSchema.url !== 'string') {
      errors.push('url must be a string');
    }

    if (orgSchema.logo && typeof orgSchema.logo !== 'string') {
      errors.push('logo must be a string');
    }
  }

  // Validate URLs
  if (validateUrls) {
    if (orgSchema.url && !isValidUrl(orgSchema.url)) {
      errors.push(`Invalid organization URL: ${orgSchema.url}`);
    }

    if (orgSchema.logo && !isValidUrl(orgSchema.logo)) {
      warnings.push(`Invalid logo URL: ${orgSchema.logo}`);
    }

    if (orgSchema.sameAs && Array.isArray(orgSchema.sameAs)) {
      for (const url of orgSchema.sameAs) {
        if (!isValidUrl(url)) {
          warnings.push(`Invalid social media URL: ${url}`);
        }
      }
    }
  }

  // Add suggestions for better schema compliance
  if (!orgSchema.logo) {
    suggestions.push('Consider adding logo for rich results');
  }

  if (!orgSchema.contactPoint) {
    suggestions.push('Consider adding contactPoint for better organization information');
  }

  if (!orgSchema.address) {
    suggestions.push('Consider adding address for local business information');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
};

// Helper function to validate URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return validExtensions.some(ext => url.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
};

// Function to validate any schema based on its type
export const validateSchema = (
  schema: any,
  options: SchemaValidationOptions = {}
): ValidationResult => {
  if (!schema || !schema['@type']) {
    return {
      isValid: false,
      errors: ['Schema is missing @type property'],
      warnings: [],
      suggestions: []
    };
  }

  switch (schema['@type']) {
    case 'Product':
      return validateProductSchema(schema, options);
    case 'Organization':
    case 'Corporation':
      return validateOrganizationSchema(schema, options);
    default:
      return {
        isValid: false,
        errors: [`Validation for @type '${schema['@type']}' is not implemented`],
        warnings: [],
        suggestions: [`Consider implementing validation for @type '${schema['@type']}'`]
      };
  }
};

// Function to generate schema validation report
export const generateValidationReport = (
  schema: any,
  options: SchemaValidationOptions = {}
): string => {
  const result = validateSchema(schema, options);
  
  let report = `Schema Validation Report\n`;
  report += `========================\n\n`;
  report += `Valid: ${result.isValid ? 'YES' : 'NO'}\n\n`;
  
  if (result.errors.length > 0) {
    report += `Errors (${result.errors.length}):\n`;
    result.errors.forEach((error, index) => {
      report += `  ${index + 1}. ${error}\n`;
    });
    report += `\n`;
  }
  
  if (result.warnings.length > 0) {
    report += `Warnings (${result.warnings.length}):\n`;
    result.warnings.forEach((warning, index) => {
      report += `  ${index + 1}. ${warning}\n`;
    });
    report += `\n`;
  }
  
  if (result.suggestions.length > 0) {
    report += `Suggestions (${result.suggestions.length}):\n`;
    result.suggestions.forEach((suggestion, index) => {
      report += `  ${index + 1}. ${suggestion}\n`;
    });
    report += `\n`;
  }
  
  return report;
};