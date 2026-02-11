// lib/accessibility.ts

// Function to check color contrast ratio
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

// Helper function to calculate luminance
const getLuminance = (color: string): number => {
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match) {
      [r, g, b] = match.map(Number);
    }
  }

  // Normalize values
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  // Calculate luminance
  const sR = normR <= 0.03928 ? normR / 12.92 : Math.pow((normR + 0.055) / 1.055, 2.4);
  const sG = normG <= 0.03928 ? normG / 12.92 : Math.pow((normG + 0.055) / 1.055, 2.4);
  const sB = normB <= 0.03928 ? normB / 12.92 : Math.pow((normB + 0.055) / 1.055, 2.4);

  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
};

// Function to validate if contrast meets WCAG standards
export const isValidContrast = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2);
  if (level === 'AA') {
    return ratio >= 4.5; // Minimum for normal text
  } else {
    return ratio >= 7.0; // Enhanced contrast
  }
};

// Function to generate accessible color combinations
export const generateAccessibleColor = (backgroundColor: string, targetLevel: 'AA' | 'AAA' = 'AA'): string => {
  const bgLuminance = getLuminance(backgroundColor);
  const threshold = targetLevel === 'AA' ? 4.5 : 7.0;
  
  // Determine if we need light or dark text based on background
  if (bgLuminance > 0.5) {
    // Light background, use dark text
    return '#000000'; // Black
  } else {
    // Dark background, use light text
    return '#FFFFFF'; // White
  }
};

// Function to check if an element has proper focus management
export const hasProperFocusManagement = (element: HTMLElement): boolean => {
  // Check if element is focusable
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex === '-1') {
    return false; // Explicitly not focusable
  }

  // Check if element has proper role if it's not a standard focusable element
  const isStandardFocusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(element.tagName);
  if (!isStandardFocusable) {
    const role = element.getAttribute('role');
    if (!role) {
      return false; // Non-standard focusable element without role
    }
  }

  return true;
};

// Function to validate ARIA attributes
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const errors: string[] = [];
  const role = element.getAttribute('role');
  
  // Check for required ARIA attributes based on role
  if (role === 'button') {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby') && !element.textContent?.trim()) {
      errors.push('Button must have aria-label, aria-labelledby, or visible text content');
    }
  } else if (role === 'dialog' || role === 'alertdialog') {
    if (!element.hasAttribute('aria-modal')) {
      errors.push('Dialog must have aria-modal attribute');
    }
    if (!element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
      errors.push('Dialog must have aria-labelledby or aria-label');
    }
  }
  
  return errors;
};