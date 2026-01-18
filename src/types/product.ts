export interface PlatformData {
    platformName: 'Trendyol' | 'Hepsiburada' | 'Pazarama' | 'Web Sitesi';
    listingPrice: number;     // Satış Fiyatı
    commissionRate: number;   // Komisyon %
    shippingCost: number;     // Kargo Maliyeti
    isActive: boolean;
    stock: number;
}

export interface Product {
    id: string;
    sku: string;              // Stok Kodu
    name: string;
    baseCost: number;         // Ürün Alış Maliyeti
    taxRate: number;          // KDV %
    packagingCost: number;    // Paketleme/Gider
    platforms: PlatformData[];
}