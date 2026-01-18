import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    MessageSquare,
    Store,
    MessageCircleQuestionIcon,
    SquarePercent
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: 'Genel Bakış', path: '/' },
    { icon: Package, label: 'Ürün Yönetimi', path: '/products' },
    { icon: ShoppingCart, label: 'Satış Takibi', path: '/sales' },
    { icon: SquarePercent, label: 'Finansal Analiz', path: '/sales' },
    { icon: Store, label: 'Platformlar', path: '/platforms' },
    { icon: MessageCircleQuestionIcon, label: 'Müşteri Soruları', path: '/messages' },
    { icon: MessageSquare, label: 'Müşteri Yorumları', path: '/messages' },
    { icon: BarChart3, label: 'Raporlar', path: '/reports' },
    { icon: Settings, label: 'Ayarlar', path: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-50/50">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-white hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        E-Trade Manager
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Developer Mode</p>
                            <p className="text-xs text-slate-500 truncate">admin@company.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b bg-white flex items-center justify-between px-8">
                    <h1 className="font-semibold text-slate-700">Panel / {menuItems.find(i => i.path === location.pathname)?.label}</h1>
                    <div className="flex items-center gap-4">
                        {/* Buraya bildirim ve arama gelecek */}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}