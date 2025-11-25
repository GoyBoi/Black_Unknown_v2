// Format currency for South African market (ZAR)
export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date for South African format (DD/MM/YYYY)
export const formatDateZA = (date: Date): string => {
  return date.toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Validate South African ID number
export const validateSAId = (id: string): boolean => {
  if (id.length !== 13 || !/^\d{13}$/.test(id)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = id.length - 1; i >= 0; i--) {
    let digit = parseInt(id.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit = digit.toString().split('').map(Number).reduce((a, b) => a + b, 0);
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Validate South African phone number
export const validateSAPhone = (phone: string): boolean => {
  const regex = /^(?:\+27|27|0)(\d{9})$/;
  return regex.test(phone);
};

// Calculate VAT (15% in South Africa)
export const calculateVAT = (amount: number): number => {
  return amount * 0.15;
};

// Add VAT to an amount
export const addVAT = (amount: number): number => {
  return amount * 1.15;
};