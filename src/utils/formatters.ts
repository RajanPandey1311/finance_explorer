export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/A';
  
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value);
};
