import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Megaphone, TrendingUp, TrendingDown, DollarSign, Eye,
  MousePointerClick, Target, ShoppingCart, Instagram, Globe,
  Search, Filter, ChevronDown, ArrowUpRight, ArrowDownRight,
  Play, Pause, AlertCircle, CheckCircle2, Clock,
} from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdStatus = 'active' | 'paused' | 'ended' | 'pending';
type AdChannel = 'Trendyol' | 'Hepsiburada' | 'N11' | 'Pazarama' | 'Instagram' | 'Facebook' | 'Google';

interface Ad {
  id: string;
  name: string;
  channel: AdChannel;
  status: AdStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  startDate: string;
  endDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const spendTrend = [
  { day: 'Pzt', trendyol: 420, hepsiburada: 310, google: 580, social: 230 },
  { day: 'Sal', trendyol: 380, hepsiburada: 290, google: 620, social: 310 },
  { day: 'Çar', trendyol: 510, hepsiburada: 410, google: 710, social: 270 },
  { day: 'Per', trendyol: 490, hepsiburada: 380, google: 650, social: 390 },
  { day: 'Cum', trendyol: 620, hepsiburada: 520, google: 820, social: 480 },
  { day: 'Cmt', trendyol: 710, hepsiburada: 590, google: 940, social: 560 },
  { day: 'Paz', trendyol: 580, hepsiburada: 440, google: 870, social: 430 },
];

const roasTrend = [
  { month: 'Oca', marketplace: 3.2, social: 1.8, google: 2.9 },
  { month: 'Şub', marketplace: 3.5, social: 2.1, google: 3.1 },
  { month: 'Mar', marketplace: 3.8, social: 2.4, google: 3.4 },
  { month: 'Nis', marketplace: 4.1, social: 2.2, google: 3.7 },
  { month: 'May', marketplace: 3.9, social: 2.6, google: 3.5 },
  { month: 'Haz', marketplace: 4.4, social: 2.9, google: 4.0 },
];

const channelShare = [
  { name: 'Trendyol',    value: 34, color: '#f97316' },
  { name: 'Hepsiburada', value: 22, color: '#3b82f6' },
  { name: 'Google',      value: 21, color: '#22c55e' },
  { name: 'Instagram',   value: 12, color: '#a855f7' },
  { name: 'Facebook',    value: 7,  color: '#0ea5e9' },
  { name: 'Diğer',       value: 4,  color: '#94a3b8' },
];

const allAds: Ad[] = [
  { id: '1',  name: 'Tişört Koleksiyon Kampanyası', channel: 'Trendyol',    status: 'active',  budget: 5000,  spent: 3240, impressions: 128000, clicks: 4320, conversions: 215, revenue: 32100, startDate: '2024-06-01', endDate: '2024-06-30' },
  { id: '2',  name: 'Yaz İndirimi – Pantolon',      channel: 'Hepsiburada', status: 'active',  budget: 3500,  spent: 2100, impressions:  87000, clicks: 2940, conversions: 134, revenue: 18760, startDate: '2024-06-05', endDate: '2024-06-25' },
  { id: '3',  name: 'Marka Bilinirliği',             channel: 'Google',      status: 'active',  budget: 8000,  spent: 5600, impressions: 210000, clicks: 8400, conversions: 380, revenue: 57000, startDate: '2024-05-01', endDate: '2024-07-31' },
  { id: '4',  name: 'Story Reklamı – Yeni Ürünler', channel: 'Instagram',   status: 'active',  budget: 2000,  spent: 1450, impressions:  64000, clicks: 1920, conversions:  82, revenue:  9840, startDate: '2024-06-10', endDate: '2024-06-30' },
  { id: '5',  name: 'Retargeting Kampanyası',        channel: 'Facebook',    status: 'paused',  budget: 4000,  spent: 1800, impressions:  91000, clicks: 3640, conversions: 145, revenue: 21750, startDate: '2024-05-20', endDate: '2024-06-20' },
  { id: '6',  name: 'Flash Satış – 48 Saat',         channel: 'Trendyol',   status: 'ended',   budget: 1500,  spent: 1500, impressions:  42000, clicks: 2100, conversions: 198, revenue: 29700, startDate: '2024-05-15', endDate: '2024-05-17' },
  { id: '7',  name: 'Ürün Listeleme Reklamı',        channel: 'N11',         status: 'pending', budget: 2500,  spent: 0,    impressions:  0,     clicks: 0,    conversions:   0, revenue:     0, startDate: '2024-07-01', endDate: '2024-07-31' },
  { id: '8',  name: 'Çiçeksepeti Vitrin',            channel: 'Pazarama',    status: 'active',  budget: 1800,  spent: 940,  impressions:  31000, clicks: 1240, conversions:  54, revenue:  6480, startDate: '2024-06-08', endDate: '2024-06-28' },
  { id: '9',  name: 'Arama Ağı – Markot',            channel: 'Google',      status: 'active',  budget: 6000,  spent: 4200, impressions: 185000, clicks: 7400, conversions: 310, revenue: 46500, startDate: '2024-05-01', endDate: '2024-07-31' },
  { id: '10', name: 'Reel Reklamı – Koleksiyon',     channel: 'Instagram',   status: 'paused',  budget: 3000,  spent: 2200, impressions:  74000, clicks: 2960, conversions: 118, revenue: 14160, startDate: '2024-05-25', endDate: '2024-06-25' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}B`;
  return n.toString();
}

function fmtTL(n: number) {
  return `₺${n.toLocaleString('tr-TR')}`;
}

const STATUS_CONFIG: Record<AdStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  active:  { label: 'Aktif',   icon: CheckCircle2,  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  paused:  { label: 'Durduruldu', icon: Pause,     cls: 'bg-amber-50   text-amber-700   border-amber-200'   },
  ended:   { label: 'Tamamlandı', icon: Clock,     cls: 'bg-slate-50   text-slate-600   border-slate-200'   },
  pending: { label: 'Beklemede',  icon: AlertCircle, cls: 'bg-blue-50  text-blue-700    border-blue-200'    },
};

const CHANNEL_CONFIG: Record<AdChannel, { color: string; bg: string }> = {
  Trendyol:    { color: 'text-orange-600', bg: 'bg-orange-50' },
  Hepsiburada: { color: 'text-blue-600',   bg: 'bg-blue-50'   },
  N11:         { color: 'text-purple-600', bg: 'bg-purple-50' },
  Pazarama:    { color: 'text-teal-600',   bg: 'bg-teal-50'   },
  Instagram:   { color: 'text-pink-600',   bg: 'bg-pink-50'   },
  Facebook:    { color: 'text-sky-600',    bg: 'bg-sky-50'    },
  Google:      { color: 'text-emerald-600',bg: 'bg-emerald-50'},
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  title, value, sub, icon: Icon, trend, trendValue, color,
}: {
  title:      string;
  value:      string;
  sub:        string;
  icon:       typeof DollarSign;
  trend:      'up' | 'down' | 'neutral';
  trendValue: string;
  color:      string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={cn(
          'flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full',
          trend === 'up'   ? 'bg-emerald-50 text-emerald-700' :
          trend === 'down' ? 'bg-red-50 text-red-600' :
                             'bg-slate-100 text-slate-500',
        )}>
          {trend === 'up'   ? <ArrowUpRight size={12} />   :
           trend === 'down' ? <ArrowDownRight size={12} /> : null}
          {trendValue}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{title}</p>
      </div>
      <p className="text-xs text-slate-400 border-t border-slate-100 pt-2">{sub}</p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, iconColor }: {
  icon: typeof Megaphone; title: string; subtitle?: string; iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor)}>
        <Icon size={15} className="text-white" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function AdTable({ ads }: { ads: Ad[] }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Reklam</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Kanal</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Durum</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">Bütçe / Harcama</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">Gösterim</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">Tıklama</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">Dönüşüm</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">Gelir</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">ROAS</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wide text-slate-500 text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => {
            const roas    = ad.spent > 0 ? (ad.revenue / ad.spent).toFixed(2) : '—';
            const ctr     = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0';
            const budgetPct = ad.budget > 0 ? Math.round((ad.spent / ad.budget) * 100) : 0;
            const StatusIcon = STATUS_CONFIG[ad.status].icon;
            const ch = CHANNEL_CONFIG[ad.channel];

            return (
              <TableRow key={ad.id} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                {/* Name */}
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{ad.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(ad.startDate).toLocaleDateString('tr-TR')} – {new Date(ad.endDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </TableCell>

                {/* Channel */}
                <TableCell>
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', ch.bg, ch.color)}>
                    {ad.channel}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-semibold',
                    STATUS_CONFIG[ad.status].cls,
                  )}>
                    <StatusIcon size={10} />
                    {STATUS_CONFIG[ad.status].label}
                  </span>
                </TableCell>

                {/* Budget */}
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-slate-700">{fmtTL(ad.spent)}</span>
                    <span className="text-[10px] text-slate-400">/ {fmtTL(ad.budget)}</span>
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', budgetPct > 90 ? 'bg-red-400' : budgetPct > 70 ? 'bg-amber-400' : 'bg-blue-400')}
                        style={{ width: `${budgetPct}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Impressions */}
                <TableCell className="text-right">
                  <span className="font-semibold text-slate-700 text-sm">{fmt(ad.impressions)}</span>
                </TableCell>

                {/* Clicks */}
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-slate-700 text-sm">{fmt(ad.clicks)}</span>
                    <span className="text-[10px] text-slate-400">%{ctr} CTR</span>
                  </div>
                </TableCell>

                {/* Conversions */}
                <TableCell className="text-right">
                  <span className="font-semibold text-slate-700 text-sm">{ad.conversions}</span>
                </TableCell>

                {/* Revenue */}
                <TableCell className="text-right">
                  <span className="font-semibold text-emerald-600 text-sm">{fmtTL(ad.revenue)}</span>
                </TableCell>

                {/* ROAS */}
                <TableCell className="text-right">
                  <span className={cn(
                    'font-bold text-sm',
                    roas !== '—' && parseFloat(roas) >= 3 ? 'text-emerald-600' :
                    roas !== '—' && parseFloat(roas) >= 1.5 ? 'text-amber-600' : 'text-red-500',
                  )}>
                    {roas !== '—' ? `${roas}x` : '—'}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {ad.status === 'active' ? (
                      <button className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors" title="Duraklat">
                        <Pause size={13} />
                      </button>
                    ) : ad.status === 'paused' ? (
                      <button className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors" title="Devam Ettir">
                        <Play size={13} />
                      </button>
                    ) : null}
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors">
                      Detay
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-semibold text-slate-800">{typeof p.value === 'number' && p.value > 10 ? fmtTL(p.value) : `${p.value}x`}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdsPage() {
  const [tableFilter, setTableFilter] = useState<'all' | AdChannel | AdStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const totalSpent       = allAds.reduce((s, a) => s + a.spent, 0);
  const totalRevenue     = allAds.reduce((s, a) => s + a.revenue, 0);
  const totalImpressions = allAds.reduce((s, a) => s + a.impressions, 0);
  const totalClicks      = allAds.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = allAds.reduce((s, a) => s + a.conversions, 0);
  const totalRoas        = totalSpent > 0 ? (totalRevenue / totalSpent) : 0;
  const avgCTR           = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const marketplaceAds = allAds.filter(a => ['Trendyol','Hepsiburada','N11','Pazarama'].includes(a.channel));
  const socialAds      = allAds.filter(a => ['Instagram','Facebook'].includes(a.channel));
  const googleAds      = allAds.filter(a => a.channel === 'Google');

  const filteredAds = allAds.filter((a) => {
    const matchFilter = tableFilter === 'all' || a.channel === tableFilter || a.status === tableFilter;
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.channel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeCount  = allAds.filter(a => a.status === 'active').length;
  const pausedCount  = allAds.filter(a => a.status === 'paused').length;

  return (
    <div className="space-y-7">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reklam Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tüm kanallar · <span className="text-emerald-600 font-semibold">{activeCount} aktif</span>
            {' · '}<span className="text-amber-600 font-semibold">{pausedCount} durdurulmuş</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-200 transition-colors">
          <Megaphone size={15} />
          Yeni Kampanya
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard title="Toplam Harcama"  value={fmtTL(totalSpent)}                icon={DollarSign}        trend="up"      trendValue="+12%"    color="bg-blue-500"    sub="Bu ay toplam" />
        <StatCard title="Toplam Gelir"    value={fmtTL(totalRevenue)}              icon={TrendingUp}        trend="up"      trendValue="+18%"    color="bg-emerald-500" sub="Reklam kaynaklı" />
        <StatCard title="ROAS"            value={`${totalRoas.toFixed(2)}x`}       icon={Target}            trend="up"      trendValue="+0.3"    color="bg-violet-500"  sub="Reklam Harcama Getirisi" />
        <StatCard title="Gösterim"        value={fmt(totalImpressions)}            icon={Eye}               trend="up"      trendValue="+24%"    color="bg-sky-500"     sub="Toplam gösterim" />
        <StatCard title="Tıklama"         value={fmt(totalClicks)}                 icon={MousePointerClick} trend="up"      trendValue="+9%"     color="bg-indigo-500"  sub="Toplam tıklama" />
        <StatCard title="Ort. CTR"        value={`%${avgCTR.toFixed(2)}`}          icon={ArrowUpRight}      trend="neutral" trendValue="~"       color="bg-amber-500"   sub="Tıklama oranı" />
        <StatCard title="Dönüşüm"         value={totalConversions.toLocaleString()} icon={ShoppingCart}     trend="up"      trendValue="+15%"    color="bg-rose-500"    sub="Toplam satış" />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Spend Trend */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={TrendingUp} title="Haftalık Reklam Harcaması" subtitle="Son 7 gün · Kanal bazlı (₺)" iconColor="bg-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={spendTrend} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                {[['trendyol','#f97316'],['hepsiburada','#3b82f6'],['google','#22c55e'],['social','#a855f7']].map(([k,c]) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0.01} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
              <Area type="monotone" dataKey="trendyol"    name="Trendyol"    stroke="#f97316" fill="url(#grad-trendyol)"    strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="hepsiburada" name="Hepsiburada" stroke="#3b82f6" fill="url(#grad-hepsiburada)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="google"      name="Google"      stroke="#22c55e" fill="url(#grad-google)"      strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="social"      name="Sosyal Medya" stroke="#a855f7" fill="url(#grad-social)"    strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Distribution Pie */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <SectionTitle icon={Target} title="Kanal Dağılımı" subtitle="Toplam harcama payı" iconColor="bg-violet-500" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={channelShare}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {channelShare.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `%${value}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {channelShare.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span>{c.name}</span>
                <span className="ml-auto font-semibold text-slate-800">%{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROAS Trend ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={TrendingUp} title="Aylık ROAS Karşılaştırması" subtitle="Reklam harcama getiri oranı (son 6 ay)" iconColor="bg-emerald-500" />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={roasTrend} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
            <Bar dataKey="marketplace" name="Pazaryeri" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="social"      name="Sosyal Medya" fill="#a855f7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="google"      name="Google"    fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Channel Sections ── */}
      <Tabs defaultValue="marketplace">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className="bg-slate-100 h-10 p-1 rounded-lg">
            <TabsTrigger value="marketplace" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
              <Store2 size={12} className="mr-1.5" />Pazaryeri Reklamları
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
              <Instagram size={12} className="mr-1.5" />Sosyal Medya
            </TabsTrigger>
            <TabsTrigger value="google" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
              <Search size={12} className="mr-1.5" />Google Reklamları
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm px-4">
              Tümü
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Per-tab metric strip */}
        {[
          { key: 'marketplace', ads: marketplaceAds, icon: ShoppingCart,  label: 'Pazaryeri Reklamları',  iconColor: 'bg-orange-500' },
          { key: 'social',      ads: socialAds,      icon: Instagram,     label: 'Sosyal Medya Reklamları', iconColor: 'bg-pink-500'   },
          { key: 'google',      ads: googleAds,      icon: Globe,         label: 'Google Reklamları',    iconColor: 'bg-emerald-500' },
        ].map(({ key, ads, icon, label, iconColor }) => {
          const spend = ads.reduce((s, a) => s + a.spent, 0);
          const rev   = ads.reduce((s, a) => s + a.revenue, 0);
          const roas  = spend > 0 ? (rev / spend).toFixed(2) : '0';
          return (
            <TabsContent key={key} value={key} className="mt-5 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <SectionTitle icon={icon} title={label} iconColor={iconColor} />
                <div className="ml-auto flex items-center gap-4 flex-wrap">
                  {[
                    { label: 'Harcama', val: fmtTL(spend) },
                    { label: 'Gelir',   val: fmtTL(rev) },
                    { label: 'ROAS',    val: `${roas}x` },
                    { label: 'Aktif',   val: `${ads.filter(a=>a.status==='active').length} kampanya` },
                  ].map(({ label: l, val }) => (
                    <div key={l} className="text-center">
                      <p className="text-xs text-slate-500">{l}</p>
                      <p className="text-sm font-bold text-slate-800">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              <AdTable ads={ads} />
            </TabsContent>
          );
        })}

        <TabsContent value="all" className="mt-5 space-y-4">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Kampanya veya kanal ara…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'paused', 'ended'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setTableFilter(s)}
                  className={cn(
                    'px-3 py-2 text-xs font-semibold rounded-lg border transition-colors',
                    tableFilter === s
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300',
                  )}
                >
                  {s === 'all' ? 'Tümü' : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <AdTable ads={filteredAds} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// tiny helper to avoid importing Store twice
function Store2({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <line x1="3" x2="21" y1="6" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
