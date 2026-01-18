import { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import type { Product, PlatformData } from "@/types/product";
import { AddProductModal } from '@/components/AddProductModal';

const mockProducts: (Product & { createdAt: string })[] = [
    {
        id: "1",
        sku: "TSHIRT-001",
        name: "Oversize Pamuklu Tişört",
        baseCost: 150,
        taxRate: 20,
        packagingCost: 10,
        createdAt: "2024-01-10T10:00:00Z",
        platforms: [
            { platformName: 'Trendyol', listingPrice: 350, commissionRate: 20, shippingCost: 45, isActive: true, stock: 100 },
            { platformName: 'Hepsiburada', listingPrice: 375, commissionRate: 18, shippingCost: 40, isActive: true, stock: 85 }
        ]
    },
    {
        id: "2",
        sku: "PANT-002",
        name: "Slim Fit Jean Pantolon",
        baseCost: 300,
        taxRate: 20,
        packagingCost: 15,
        createdAt: "2024-01-15T12:00:00Z",
        platforms: [
            { platformName: 'Trendyol', listingPrice: 650, commissionRate: 15, shippingCost: 45, isActive: true, stock: 50 },
            { platformName: 'Pazarama', listingPrice: 620, commissionRate: 12, shippingCost: 40, isActive: true, stock: 30 }
        ]
    }
];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [activePlatform, setActivePlatform] = useState("all");

    const calculateNetProfit = (product: Product, platform: PlatformData) => {
        const kdvAmount = (platform.listingPrice * product.taxRate) / 100;
        const commissionAmount = (platform.listingPrice * platform.commissionRate) / 100;
        const totalCost = product.baseCost + kdvAmount + commissionAmount + platform.shippingCost + product.packagingCost;
        return platform.listingPrice - totalCost;
    };

    const filteredAndSortedProducts = useMemo(() => {
        const result = mockProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase());

            // Platform Filtresi: 'all' değilse, ürünün içinde o platform var mı kontrol et
            const matchesPlatform = activePlatform === "all" ||
                product.platforms.some(p => p.platformName.toLowerCase() === activePlatform.toLowerCase());

            return matchesSearch && matchesPlatform;
        });

        if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        else if (sortBy === "oldest") result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        else if (sortBy === "az") result.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortBy === "za") result.sort((a, b) => b.name.localeCompare(a.name));

        return result;
    }, [searchTerm, sortBy, activePlatform]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">Ürün Yönetimi</h2>
                <AddProductModal />
            </div>

            {/* Genişletilmiş Filtreleme Alanı */}
            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-5">

                {/* Platform Seçim Butonları (Tabs) */}
                <Tabs defaultValue="all" onValueChange={setActivePlatform} className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-[800px] bg-slate-100/80 p-1 h-auto">
                        <TabsTrigger value="all" className="py-2">Tüm Ürünler</TabsTrigger>
                        <TabsTrigger value="Web Site" className="py-2">Web Sitesi</TabsTrigger>
                        <TabsTrigger value="Trendyol" className="py-2">Trendyol</TabsTrigger>
                        <TabsTrigger value="Hepsiburada" className="py-2">Hepsiburada</TabsTrigger>
                        <TabsTrigger value="Pazarama" className="py-2">Pazarama</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Ürün adı veya SKU ile ara..."
                            className="pl-10 border-slate-200 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Sırala:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px] border-slate-200">
                                <SelectValue placeholder="Sıralama seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">En Yeni Eklenen</SelectItem>
                                <SelectItem value="oldest">En Eski Eklenen</SelectItem>
                                <SelectItem value="az">A-Z Sırala</SelectItem>
                                <SelectItem value="za">Z-A Sırala</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Tablo */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                            <TableHead className="w-[120px] font-semibold text-slate-600">SKU</TableHead>
                            <TableHead className="font-semibold text-slate-600">Ürün Bilgisi</TableHead>
                            <TableHead className="font-semibold text-slate-600">Maliyet</TableHead>
                            <TableHead className="font-semibold text-slate-600">Pazaryeri Karlılık</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedProducts.length > 0 ? (
                            filteredAndSortedProducts.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/30 transition-colors border-b last:border-0">
                                    <TableCell className="font-mono text-xs text-slate-400 uppercase">{product.sku}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{product.name}</span>
                                            <span className="text-[10px] text-slate-400 mt-0.5">
                                                Tarih: {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-600">
                                        {product.baseCost + product.packagingCost} ₺
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-3">
                                            {product.platforms
                                                .filter(p => activePlatform === "all" || p.platformName.toLowerCase() === activePlatform.toLowerCase())
                                                .map((p) => {
                                                    const profit = calculateNetProfit(product, p);
                                                    return (
                                                        <div key={p.platformName} className="flex flex-col border-l-2 border-slate-100 pl-3 py-1">
                                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">{p.platformName}</span>
                                                            <span className="text-sm font-bold text-slate-800">{p.listingPrice} ₺</span>
                                                            <span className={`text-[11px] font-bold ${profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                                {profit > 0 ? "+" : ""}{profit.toFixed(2)} ₺ Net
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition">
                                            Düzenle
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                                    Seçilen platformda veya kriterlerde ürün bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}