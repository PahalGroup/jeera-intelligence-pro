// Universal Unit Normalization Engine for Jeera (Cumin - HS Code 090931)
// Follows the /indian-commodity-intelligence and /zero-shortcut-execution protocols

export type UnitType = 'maund' | 'bag' | 'quintal' | 'kg' | 'usd_mt';

export interface UnitConfig {
  id: UnitType;
  name: string;
  shortLabel: string;
  subLabel: string;
  kgMultiplier: number; // how many kg in 1 unit
  isUsd?: boolean;
}

export const CROP_UNITS: Record<UnitType, UnitConfig> = {
  maund: {
    id: 'maund',
    name: 'Maund (Man)',
    shortLabel: '₹/Maund',
    subLabel: '20 kg Auction Shouted Unit',
    kgMultiplier: 20,
  },
  bag: {
    id: 'bag',
    name: 'Standard Bag',
    shortLabel: '₹/Bag',
    subLabel: '55 kg Jute Sack',
    kgMultiplier: 55,
  },
  quintal: {
    id: 'quintal',
    name: 'Quintal',
    shortLabel: '₹/Qtl',
    subLabel: '100 kg (NCDEX standard)',
    kgMultiplier: 100,
  },
  kg: {
    id: 'kg',
    name: 'Kilogram',
    shortLabel: '₹/kg',
    subLabel: 'Wholesale / Retail base',
    kgMultiplier: 1,
  },
  usd_mt: {
    id: 'usd_mt',
    name: 'USD / Metric Tonne',
    shortLabel: '$/MT FOB',
    subLabel: 'Mundra Port FOB benchmark',
    kgMultiplier: 1000,
    isUsd: true,
  },
};

// Benchmark exchange rate: 1 USD = 84.00 INR
export const LIVE_USD_INR = 84.0;

/**
 * Converts a base price in ₹/kg to the selected unit
 */
export function convertFromKg(priceInRsPerKg: number, targetUnit: UnitType, usdInr: number = LIVE_USD_INR): number {
  if (targetUnit === 'usd_mt') {
    // 1 MT = 1000 kg. Price in USD/MT = (Rs/kg * 1000) / USD_INR
    return (priceInRsPerKg * 1000) / usdInr;
  }
  const config = CROP_UNITS[targetUnit];
  return priceInRsPerKg * config.kgMultiplier;
}

/**
 * Converts a price in any unit to the base price in ₹/kg
 */
export function convertToKg(price: number, fromUnit: UnitType, usdInr: number = LIVE_USD_INR): number {
  if (fromUnit === 'usd_mt') {
    // Price in Rs/kg = (USD_per_MT * USD_INR) / 1000
    return (price * usdInr) / 1000;
  }
  const config = CROP_UNITS[fromUnit];
  return price / config.kgMultiplier;
}

/**
 * Formats a base price in ₹/kg into the user's active unit with proper formatting
 */
export function formatPriceByUnit(
  priceInRsPerKg: number,
  targetUnit: UnitType,
  options?: {
    showUnit?: boolean;
    precision?: number;
    usdInr?: number;
  }
): string {
  const usdInr = options?.usdInr ?? LIVE_USD_INR;
  const showUnit = options?.showUnit ?? true;
  const converted = convertFromKg(priceInRsPerKg, targetUnit, usdInr);
  
  let formattedNumber: string;
  if (targetUnit === 'usd_mt') {
    const prec = options?.precision ?? 0;
    formattedNumber = `$${converted.toLocaleString('en-US', { minimumFractionDigits: prec, maximumFractionDigits: prec })}`;
    return showUnit ? `${formattedNumber}/MT` : formattedNumber;
  }

  const prec = options?.precision ?? (targetUnit === 'kg' ? 1 : 0);
  formattedNumber = `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: prec, maximumFractionDigits: prec })}`;
  
  if (!showUnit) return formattedNumber;
  return `${formattedNumber} / ${CROP_UNITS[targetUnit].name.split(' ')[0]}`;
}

/**
 * Normalizes physical bag quantities to Metric Tonnes and Lakh Bags
 * Standard Jeera Bag W_bag = 55 kg
 */
export const BAG_WEIGHT_KG = 55;

export function bagsToMetricTonnes(bags: number): number {
  return (bags * BAG_WEIGHT_KG) / 1000;
}

export function metricTonnesToBags(mt: number): number {
  return (mt * 1000) / BAG_WEIGHT_KG;
}

export function lakhBagsToMetricTonnes(lakhBags: number): number {
  return (lakhBags * 100000 * BAG_WEIGHT_KG) / 1000; // = lakhBags * 5,500 MT
}

export function metricTonnesToLakhBags(mt: number): number {
  return (mt * 1000) / (BAG_WEIGHT_KG * 100000); // = mt / 5,500
}

