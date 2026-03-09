import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  BarChart3,
  Store,
  Megaphone,
  MessageCircleQuestion,
  Star,
  FileText,
  Settings,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
  {
    label: 'GENEL',
    items: [
      { to: '/',         label: 'Genel Bakış',      icon: LayoutDashboard },
      { to: '/products', label: 'Ürün Yönetimi',    icon: Package },
    ],
  },
  {
    label: 'SATIŞ & FİNANS',
    items: [
      { to: '/sales',   label: 'Satış Takibi',    icon: TrendingUp },
      { to: '/finance', label: 'Finansal Analiz', icon: BarChart3 },
    ],
  },
  {
    label: 'PAZARYERI',
    items: [
      { to: '/marketplaces', label: 'Platformlar',       icon: Store },
      { to: '/ads',          label: 'Reklam Yönetimi',  icon: Megaphone },
    ],
  },
  {
    label: 'MÜŞTERİ',
    items: [
      { to: '/questions', label: 'Müşteri Soruları',  icon: MessageCircleQuestion },
      { to: '/reviews',   label: 'Müşteri Yorumları', icon: Star },
    ],
  },
  {
    label: 'SİSTEM',
    items: [
      { to: '/reports',  label: 'Raporlar', icon: FileText },
      { to: '/settings', label: 'Ayarlar',  icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPage = NAV_GROUPS.flatMap(g => g.items).find(i => i.path === location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow">
              <Store size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-800">E-Trade</p>
              <p className="text-[11px] text-slate-400">CRM Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <span
                          className={cn(
                            'flex items-center justify-center w-7 h-7 rounded-lg transition-all',
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                          )}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <ChevronRight size={13} className="text-blue-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">Admin</p>
              <p className="text-[11px] text-slate-400 truncate">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 gap-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Panel</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-800">
              {NAV_GROUPS.flatMap(g => g.items).find(i => i.to === location.pathname)?.label ?? 'Sayfa'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
              <Bell size={18} className="text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
