import { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Product } from '@/types/product';
import { AddProductModal } from '@/components/AddProductModal';

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'TSHIRT-001',
    name: 'Oversize Pamuklu Tişört',
    modelCode: 'TSH-2024-001',
    stock: 100,
    unitPrice: 150,
    taxRate: 20,
    createdAt: '2024-01-10T10:00:00Z',
    seoTitle: 'Oversize Pamuklu Tişört | Unisex Yazlık',
    seoDescription: 'Unisex oversize kesim, %100 pamuklu tişört. Nefes alan kumaşı ile yaz aylarında konfor sağlar.',
    platforms: [
      {
        platformName: 'Trendyol',
        name: 'Oversize Pamuklu Tişört Unisex Siyah',
        description: 'Nefes alan %100 pamuk kumaş, oversize kesim.',
        price: 350,
        commissionRate: 20,
        isActive: true,
      },
      {
        platformName: 'Hepsiburada',
        name: 'Oversize Tişört Pamuklu Unisex – Siyah',
        description: 'Rahat oversize tasarım, premium pamuk kumaş.',
        price: 375,
        commissionRate: 18,
        isActive: true,
      },
    ],
  },
  {
    id: '2',
    sku: 'PANT-002',
    name: 'Slim Fit Jean Pantolon',
    modelCode: 'JNS-2024-002',
    stock: 50,
    unitPrice: 300,
    taxRate: 20,
    createdAt: '2024-01-15T12:00:00Z',
    seoTitle: 'Slim Fit Jean Pantolon | Erkek Denim',
    seoDescription: 'Erkek slim fit jean pantolon, esnek denim kumaş. Her ortama uygun şık tasarım.',
    platforms: [
      {
        platformName: 'Trendyol',
        name: 'Erkek Slim Fit Jean Pantolon Lacivert',
        description: 'Esnek denim, slim fit kesim, tüm kombilere uygun.',
        price: 650,
        commissionRate: 15,
        isActive: true,
      },
      {
        platformName: 'Pazarama',
        name: 'Slim Fit Erkek Jean – Lacivert Denim',
        description: 'Slim fit kesim, kaliteli denim kumaş, rahat giyim.',
        price: 620,
        commissionRate: 12,
        isActive: true,
      },
    ],
  },
];

const ALL_PLATFORMS = ['Trendyol', 'Hepsiburada', 'N11', 'Pazarama', 'Çiçeksepeti'];

function NetProfitBadge({ profit }: { profit: number }) {
  const positive = profit >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${positive ? 'text-emerald-600' : 'text-rose-500'}`}>
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {positive ? '+' : ''}{profit.toFixed(2)} ₺
    </span>
  );
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm]       = useState('');
  const [sortBy, setSortBy]               = useState('newest');
  const [activePlatform, setActivePlatform] = useState('all');

  const calculateNetProfit = (product: Product, platformName: string) => {
    const p = product.platforms.find(pl => pl.platformName === platformName);
    if (!p) return null;
    const commission = (p.price * p.commissionRate) / 100;
    const costWithTax = product.unitPrice * (1 + product.taxRate / 100);
    return p.price - commission - costWithTax;
  };

  const filteredProducts = useMemo(() => {
    const result = mockProducts.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.modelCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPlatform =
        activePlatform === 'all' ||
        product.platforms.some(p => p.platformName === activePlatform);

      return matchSearch && matchPlatform;
    });

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    else if (sortBy === 'az') result.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    else if (sortBy === 'za') result.sort((a, b) => b.name.localeCompare(a.name, 'tr'));

    return result;
  }, [searchTerm, sortBy, activePlatform]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ürün Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-0.5">{mockProducts.length} ürün listeleniyor</p>
        </div>
        <AddProductModal />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        {/* Platform Tabs */}
        <Tabs defaultValue="all" onValueChange={setActivePlatform}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-slate-100/70 p-1 rounded-lg">
            <TabsTrigger value="all" className="text-xs py-1.5 px-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Tüm Ürünler
            </TabsTrigger>
            {ALL_PLATFORMS.map((p) => (
              <TabsTrigger key={p} value={p} className="text-xs py-1.5 px-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                {p}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Ürün adı, SKU veya model kodu ile ara…"
              className="pl-9 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Sırala:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">En Yeni</SelectItem>
                <SelectItem value="oldest">En Eski</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
                <SelectItem value="za">Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 w-32">SKU / Model</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Ürün Bilgisi</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 w-28">Birim Fiyat</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Pazaryeri Karlılık</TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right w-24">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0">
                  {/* SKU / Model */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                        {product.sku}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{product.modelCode}</span>
                    </div>
                  </TableCell>

                  {/* Product Info */}
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Package2 size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{product.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Stok: <span className="font-semibold text-slate-600">{product.stock}</span> adet &nbsp;·&nbsp;
                          {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Unit Price */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 text-sm">₺{product.unitPrice.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">KDV %{product.taxRate}</span>
                      <span className="text-[11px] font-semibold text-blue-600 mt-0.5">
                        ₺{(product.unitPrice * (1 + product.taxRate / 100)).toFixed(2)} dahil
                      </span>
                    </div>
                  </TableCell>

                  {/* Marketplace Profitability */}
                  <TableCell>
                    <div className="flex flex-wrap gap-3">
                      {product.platforms
                        .filter(p => activePlatform === 'all' || p.platformName === activePlatform)
                        .map((p) => {
                          const profit = calculateNetProfit(product, p.platformName);
                          return (
                            <div key={p.platformName} className="flex flex-col gap-0.5 border-l-2 border-blue-100 pl-2.5 py-0.5">
                              <span className="text-[10px] font-black uppercase tracking-tight text-blue-500">{p.platformName}</span>
                              <span className="text-sm font-bold text-slate-800">₺{p.price.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-400">%{p.commissionRate} komisyon</span>
                              {profit !== null && <NetProfitBadge profit={profit} />}
                            </div>
                          );
                        })}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      Düzenle
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Package2 size={28} className="text-slate-300" />
                    <p className="text-sm font-medium">Ürün bulunamadı</p>
                    <p className="text-xs">Arama kriterlerini değiştirmeyi deneyin</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
