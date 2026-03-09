import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProductsPage from './pages/Products';
import AdsPage from './pages/Ads';

// Placeholder sayfalar
const Placeholder = ({ title }: { title: string }) => (
    <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <p className="text-4xl mb-3">🚧</p>
            <h2 className="text-xl font-bold text-slate-700">{title}</h2>
            <p className="text-slate-400 text-sm mt-1">Bu sayfa yapım aşamasında</p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <DashboardLayout>
                <Routes>
                    <Route path="/"            element={<Placeholder title="Genel Bakış" />} />
                    <Route path="/products"    element={<ProductsPage />} />
                    <Route path="/ads"         element={<AdsPage />} />
                    <Route path="/marketplaces" element={<Placeholder title="Platformlar" />} />
                    <Route path="/sales"       element={<Placeholder title="Satış Takibi" />} />
                    <Route path="/finance"     element={<Placeholder title="Finansal Analiz" />} />
                    <Route path="/questions"   element={<Placeholder title="Müşteri Soruları" />} />
                    <Route path="/reviews"     element={<Placeholder title="Müşteri Yorumları" />} />
                    <Route path="/reports"     element={<Placeholder title="Raporlar" />} />
                    <Route path="/settings"    element={<Placeholder title="Ayarlar" />} />
                </Routes>
            </DashboardLayout>
        </BrowserRouter>
    );
}

export default App;