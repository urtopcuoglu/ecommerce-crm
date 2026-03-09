import { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray, useWatch, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, X, ChevronDown, Check, AlertCircle, Globe, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  PLATFORM_LIMITS, DEFAULT_COMMISSIONS, DEFAULT_MARKETPLACES, SEO_LIMITS,
} from '@/types/product';

// ─── Zod Schema ────────────────────────────────────────────────────────────────

const TAX_RATES = ['10', '18', '20'] as const;

const platformSchema = z.object({
  platformName:   z.string(),
  name:           z.string().min(1, 'Ürün adı zorunludur'),
  description:    z.string().min(1, 'Açıklama zorunludur'),
  price:          z.coerce.number().min(0.01, 'Fiyat girilmelidir'),
  commissionRate: z.coerce.number().min(0).max(100),
});

const formSchema = z.object({
  name:            z.string().min(3, 'En az 3 karakter giriniz'),
  sku:             z.string().min(1, 'SKU zorunludur'),
  modelCode:       z.string().min(1, 'Model kodu zorunludur'),
  stock:           z.coerce.number().min(0, 'Stok 0\'dan az olamaz'),
  unitPrice:       z.coerce.number().min(0.01, 'Birim fiyatı giriniz'),
  taxRate:         z.enum(TAX_RATES),
  platforms:       z.array(platformSchema),
  seoTitle:        z.string().max(SEO_LIMITS.titleMax, `En fazla ${SEO_LIMITS.titleMax} karakter`),
  seoDescription:  z.string().max(SEO_LIMITS.descMax, `En fazla ${SEO_LIMITS.descMax} karakter`),
});

// Manual type override: z.coerce.number() infers as 'unknown' in zod v4
type FormValues = {
  name:           string;
  sku:            string;
  modelCode:      string;
  stock:          number;
  unitPrice:      number;
  taxRate:        '10' | '18' | '20';
  platforms:      {
    platformName:   string;
    name:           string;
    description:    string;
    price:          number;
    commissionRate: number;
  }[];
  seoTitle:       string;
  seoDescription: string;
};

// ─── CharCounter ───────────────────────────────────────────────────────────────

function CharCounter({
  value, min, max,
}: { value: string; min?: number; max: number }) {
  const len = value?.length ?? 0;
  const isOver  = len > max;
  const isUnder = min !== undefined && len > 0 && len < min;
  const isGood  = !isOver && (min === undefined || len >= min) && len > 0;

  const color = isOver ? 'text-red-500' : isGood ? 'text-emerald-600' : isUnder ? 'text-amber-500' : 'text-slate-400';
  const bar   = isOver ? 'bg-red-500'  : isGood ? 'bg-emerald-500'  : isUnder ? 'bg-amber-400'   : 'bg-slate-200';
  const pct   = Math.min((len / max) * 100, 100);

  return (
    <div className="mt-1 space-y-1">
      <div className="flex justify-between items-center">
        <span className={cn('text-[11px]', color)}>
          {isOver  ? `${len - max} karakter fazla!` :
           isUnder ? `${min! - len} karakter daha girin` :
           isGood  ? 'Uygun aralıkta' : `Max ${max} karakter`}
        </span>
        <span className={cn('text-[11px] font-semibold tabular-nums', color)}>
          {len} / {max}
        </span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-300', bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Google Preview ────────────────────────────────────────────────────────────

function GooglePreview({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={12} className="text-slate-400" />
        <span className="text-[11px] text-slate-400 font-medium">Google Arama Önizlemesi</span>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-4 h-4 bg-slate-200 rounded-sm" />
        <span className="text-xs text-slate-500">www.example.com</span>
        <span className="text-xs text-slate-400">›</span>
        <span className="text-xs text-slate-500">urunler</span>
      </div>
      <p className="text-blue-700 text-base font-medium line-clamp-1 hover:underline cursor-pointer">
        {title || <span className="text-slate-300 italic">Sayfa başlığı buraya gelecek…</span>}
      </p>
      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {description || <span className="text-slate-300 italic">Meta açıklama buraya görünecek…</span>}
      </p>
    </div>
  );
}

// ─── Marketplace Multi-Select ──────────────────────────────────────────────────

interface MarketplaceSelectorProps {
  availableList:  string[];
  selectedNames:  string[];
  onToggle:       (name: string) => void;
  onAddNew:       (name: string) => void;
}

function MarketplaceSelector({
  availableList, selectedNames, onToggle, onAddNew,
}: MarketplaceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddNew(trimmed);
    setNewName('');
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white hover:bg-slate-50 transition-colors"
      >
        <span className={selectedNames.length ? 'text-slate-800' : 'text-slate-400'}>
          {selectedNames.length === 0
            ? 'Pazaryeri seçiniz…'
            : selectedNames.length === 1
            ? selectedNames[0]
            : `${selectedNames.length} pazaryeri seçildi`}
        </span>
        <ChevronDown size={15} className={cn('text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto py-1">
            {availableList.map((mp) => {
              const checked = selectedNames.includes(mp);
              return (
                <button
                  key={mp}
                  type="button"
                  onClick={() => onToggle(mp)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left"
                >
                  <span className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors',
                    checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                  )}>
                    {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                  </span>
                  <span className={cn('font-medium', checked ? 'text-blue-700' : 'text-slate-700')}>
                    {mp}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add new */}
          <div className="border-t border-slate-100 p-3 bg-slate-50/50">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Yeni Pazaryeri Ekle</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
                placeholder="Pazaryeri adı…"
                className="flex-1 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAdd}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Platform Field ────────────────────────────────────────────────────────────

interface PlatformFieldProps {
  index:     number;
  platform:  string;
  register:  ReturnType<typeof useForm<FormValues>>['register'];
  watch:     ReturnType<typeof useForm<FormValues>>['watch'];
  errors:    ReturnType<typeof useForm<FormValues>>['formState']['errors'];
}

function PlatformField({ index, platform, register, watch, errors }: PlatformFieldProps) {
  const limits   = PLATFORM_LIMITS[platform];
  const nameVal  = watch(`platforms.${index}.name`)  ?? '';
  const descVal  = watch(`platforms.${index}.description`) ?? '';

  return (
    <div className="space-y-4 pt-1">
      {limits && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>
            <strong>{platform}</strong> limitleri — Başlık: maks&nbsp;
            <strong>{limits.nameMax}</strong>&nbsp;karakter &nbsp;|&nbsp; Açıklama: maks&nbsp;
            <strong>{limits.descMax.toLocaleString('tr-TR')}</strong>&nbsp;karakter
          </span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
          Ürün Adı — {platform}
        </Label>
        <Input
          {...register(`platforms.${index}.name`)}
          placeholder={`${platform} için ürün başlığı…`}
          maxLength={limits ? limits.nameMax + 20 : undefined}
        />
        {limits && <CharCounter value={nameVal} min={limits.nameMin} max={limits.nameMax} />}
        {errors.platforms?.[index]?.name && (
          <p className="text-red-500 text-xs">{errors.platforms[index]!.name!.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
          Açıklama — {platform}
        </Label>
        <Textarea
          {...register(`platforms.${index}.description`)}
          placeholder={`${platform} için ürün açıklaması…`}
          rows={4}
          className="resize-none"
        />
        {limits && <CharCounter value={descVal} min={limits.descMin} max={limits.descMax} />}
        {errors.platforms?.[index]?.description && (
          <p className="text-red-500 text-xs">{errors.platforms[index]!.description!.message}</p>
        )}
      </div>

      {/* Price + Commission */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
            Satış Fiyatı (₺)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register(`platforms.${index}.price`)}
            placeholder="0.00"
          />
          {errors.platforms?.[index]?.price && (
            <p className="text-red-500 text-xs">{errors.platforms[index]!.price!.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wide">
            Komisyon Oranı (%)
          </Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="100"
            {...register(`platforms.${index}.commissionRate`)}
            placeholder={`${DEFAULT_COMMISSIONS[platform] ?? 15}`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── AddProductModal ───────────────────────────────────────────────────────────

export function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [availableMarketplaces, setAvailableMarketplaces] = useState<string[]>([...DEFAULT_MARKETPLACES]);
  const [activePlatformTab, setActivePlatformTab] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    mode: 'onChange',
    defaultValues: {
      name:           '',
      sku:            '',
      modelCode:      '',
      stock:          0,
      unitPrice:      0,
      taxRate:        '18',
      platforms:      [],
      seoTitle:       '',
      seoDescription: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'platforms' });

  const unitPrice = useWatch({ control, name: 'unitPrice' }) ?? 0;
  const taxRate   = useWatch({ control, name: 'taxRate' })   ?? '18';
  const seoTitle  = useWatch({ control, name: 'seoTitle' })  ?? '';
  const seoDesc   = useWatch({ control, name: 'seoDescription' }) ?? '';

  const taxRateNum  = parseInt(taxRate);
  const taxAmount   = Math.round(unitPrice * taxRateNum) / 100;
  const totalWithKDV = unitPrice + taxAmount;

  const selectedNames = fields.map(f => f.platformName);

  const toggleMarketplace = (name: string) => {
    const idx = fields.findIndex(f => f.platformName === name);
    if (idx >= 0) {
      remove(idx);
      if (activePlatformTab === name) {
        const remaining = fields.filter(f => f.platformName !== name);
        setActivePlatformTab(remaining[0]?.platformName ?? '');
      }
    } else {
      append({
        platformName:   name,
        name:           '',
        description:    '',
        price:          0,
        commissionRate: DEFAULT_COMMISSIONS[name] ?? 15,
      });
      setActivePlatformTab(name);
    }
  };

  const handleAddNewMarketplace = (name: string) => {
    if (!availableMarketplaces.includes(name)) {
      setAvailableMarketplaces(prev => [...prev, name]);
    }
    if (!selectedNames.includes(name)) toggleMarketplace(name);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log('Kaydedilecek ürün:', data);
    reset();
    setOpen(false);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      reset();
      setActivePlatformTab('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors">
          <Plus size={16} />
          Yeni Ürün Ekle
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[92vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle className="text-xl font-bold text-slate-800">Yeni Ürün Tanımla</DialogTitle>
          <p className="text-sm text-slate-500 mt-0.5">Ürün bilgilerini, pazaryeri içeriklerini ve SEO ayarlarını yapılandırın.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <Tabs defaultValue="info" className="flex flex-col flex-1 overflow-hidden">
            {/* Tab list */}
            <TabsList className="mx-6 mt-4 mb-0 shrink-0 grid grid-cols-3 bg-slate-100 h-10 rounded-lg">
              <TabsTrigger value="info"       className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Ürün Bilgileri</TabsTrigger>
              <TabsTrigger value="platforms"  className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Pazar Yerleri
                {fields.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                    {fields.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="seo"        className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">SEO Ayarları</TabsTrigger>
            </TabsList>

            {/* ── Tab: Ürün Bilgileri ── */}
            <TabsContent value="info" className="flex-1 overflow-y-auto px-6 py-5 space-y-5 mt-4">
              {/* Row 1 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Ürün Adı <span className="text-red-400">*</span></Label>
                <Input {...register('name')} placeholder="Örn: Oversize Siyah Pamuklu Tişört" />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">SKU (Stok Kodu) <span className="text-red-400">*</span></Label>
                  <Input {...register('sku')} placeholder="TSH-001" />
                  {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Model Kodu <span className="text-red-400">*</span></Label>
                  <Input {...register('modelCode')} placeholder="MDL-2024-001" />
                  {errors.modelCode && <p className="text-red-500 text-xs">{errors.modelCode.message}</p>}
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Stok Adedi <span className="text-red-400">*</span></Label>
                  <Input type="number" min="0" {...register('stock')} placeholder="0" />
                  {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Birim Fiyatı (₺) <span className="text-red-400">*</span></Label>
                  <Input type="number" step="0.01" min="0" {...register('unitPrice')} placeholder="0.00" />
                  {errors.unitPrice && <p className="text-red-500 text-xs">{errors.unitPrice.message}</p>}
                </div>
              </div>

              {/* Row 4 – KDV */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">KDV Oranı <span className="text-red-400">*</span></Label>
                  <Controller
                    control={control}
                    name="taxRate"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="KDV seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">%10 KDV</SelectItem>
                          <SelectItem value="18">%18 KDV</SelectItem>
                          <SelectItem value="20">%20 KDV</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* KDV Hesaplama */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">KDV Hesaplama</Label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Birim fiyat</span>
                      <span className="font-mono">₺{Number(unitPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>KDV (%{taxRateNum})</span>
                      <span className="font-mono">₺{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1 mt-1">
                      <span>KDV Dahil</span>
                      <span className="font-mono text-blue-700">₺{totalWithKDV.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Tab: Pazar Yerleri ── */}
            <TabsContent value="platforms" className="flex-1 overflow-y-auto px-6 py-5 space-y-5 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Pazaryeri Seçin
                </Label>
                <MarketplaceSelector
                  availableList={availableMarketplaces}
                  selectedNames={selectedNames}
                  onToggle={toggleMarketplace}
                  onAddNew={handleAddNewMarketplace}
                />
                <p className="text-[11px] text-slate-400">Birden fazla pazaryeri seçebilirsiniz. Her biri için ayrı içerik ve fiyat girilebilir.</p>
              </div>

              {/* Selected platform chips */}
              {fields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActivePlatformTab(f.platformName)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
                        activePlatformTab === f.platformName
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700'
                      )}
                    >
                      {f.platformName}
                      <span
                        onClick={(e) => { e.stopPropagation(); toggleMarketplace(f.platformName); }}
                        className="ml-0.5 hover:text-red-400 transition-colors"
                      >
                        <X size={11} strokeWidth={2.5} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Active platform form */}
              {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <Store size={24} className="mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Henüz pazaryeri seçilmedi</p>
                  <p className="text-xs mt-1">Yukarıdaki listeden pazaryeri seçin</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">{activePlatformTab}</span>
                    <span className="text-xs text-slate-400">
                      {fields.findIndex(f => f.platformName === activePlatformTab) + 1} / {fields.length}
                    </span>
                  </div>
                  <div className="p-4">
                    {fields.map((f, idx) =>
                      f.platformName === activePlatformTab ? (
                        <PlatformField
                          key={f.id}
                          index={idx}
                          platform={f.platformName}
                          register={register}
                          watch={watch}
                          errors={errors}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ── Tab: SEO Ayarları ── */}
            <TabsContent value="seo" className="flex-1 overflow-y-auto px-6 py-5 space-y-5 mt-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Meta Başlık (Title Tag)
                </Label>
                <Input
                  {...register('seoTitle')}
                  placeholder="Ürün sayfası başlığı…"
                  maxLength={SEO_LIMITS.titleMax + 10}
                />
                <CharCounter value={seoTitle} min={SEO_LIMITS.titleMin} max={SEO_LIMITS.titleMax} />
                <p className="text-[11px] text-slate-400">
                  Google arama sonuçlarında mavi başlık olarak görünür. İdeal: {SEO_LIMITS.titleMin}–{SEO_LIMITS.titleMax} karakter.
                </p>
                {errors.seoTitle && <p className="text-red-500 text-xs">{errors.seoTitle.message}</p>}
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Meta Açıklama (Meta Description)
                </Label>
                <Textarea
                  {...register('seoDescription')}
                  placeholder="Arama sonuçlarında görünecek kısa açıklama…"
                  rows={3}
                  className="resize-none"
                  maxLength={SEO_LIMITS.descMax + 10}
                />
                <CharCounter value={seoDesc} min={SEO_LIMITS.descMin} max={SEO_LIMITS.descMax} />
                <p className="text-[11px] text-slate-400">
                  Tıklanma oranını artırmak için açık ve çekici yazın. İdeal: {SEO_LIMITS.descMin}–{SEO_LIMITS.descMax} karakter.
                </p>
                {errors.seoDescription && <p className="text-red-500 text-xs">{errors.seoDescription.message}</p>}
              </div>

              {/* Google Preview */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Önizleme</Label>
                <GooglePreview title={seoTitle} description={seoDesc} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <p className="text-xs text-slate-400">
              {fields.length > 0 && `${fields.length} pazaryeri seçildi`}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                Ürünü Kaydet
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}