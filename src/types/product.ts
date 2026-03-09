export interface MarketplaceLimits {
  nameMin: number;
  nameMax: number;
  descMin: number;
  descMax: number;
}

export const PLATFORM_LIMITS: Record<string, MarketplaceLimits> = {
  Trendyol:    { nameMin: 10, nameMax: 100, descMin: 100, descMax: 30000 },
  Hepsiburada: { nameMin: 10, nameMax: 150, descMin: 100, descMax: 10000 },
  N11:         { nameMin: 10, nameMax: 255, descMin: 100, descMax: 32000 },
  Pazarama:    { nameMin: 10, nameMax: 150, descMin: 100, descMax: 10000 },
  Çiçeksepeti: { nameMin: 10, nameMax: 150, descMin: 100, descMax: 10000 },
};

export const DEFAULT_COMMISSIONS: Record<string, number> = {
  Trendyol:    20,
  Hepsiburada: 18,
  N11:         15,
  Pazarama:    12,
  Çiçeksepeti: 15,
};

export const SEO_LIMITS = {
  titleMin: 30,
  titleMax: 60,
  descMin: 120,
  descMax: 160,
};

export const DEFAULT_MARKETPLACES = [
  'Trendyol',
  'Hepsiburada',
  'N11',
  'Pazarama',
  'Çiçeksepeti',
];

export type TaxRate = 10 | 18 | 20;

export interface MarketplacePlatformData {
  platformName:   string;
  name:           string;
  description:    string;
  price:          number;
  commissionRate: number;
  isActive:       boolean;
}

export interface Product {
  id:             string;
  sku:            string;
  name:           string;
  modelCode:      string;
  stock:          number;
  unitPrice:      number;
  taxRate:        TaxRate;
  platforms:      MarketplacePlatformData[];
  seoTitle:       string;
  seoDescription: string;
  createdAt:      string;
}

// Legacy – kept for Products.tsx table until full migration
export interface PlatformData {
  platformName:   string;
  listingPrice:   number;
  commissionRate: number;
  shippingCost:   number;
  isActive:       boolean;
  stock:          number;
}