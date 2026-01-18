import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProductsPage from './pages/Products';

// Geçici placeholder sayfalar
const Overview = () => <h1 className="text-2xl font-bold">Genel Bakış</h1>;
const MarketPlaces = () => <h1 className="text-2xl font-bold">Pazaryerleri</h1>;

function App() {
    return (
        <BrowserRouter>
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/marketplaces" element={<MarketPlaces />} />
                    {/* Diğer rotalar buraya eklenecek */}
                </Routes>
            </DashboardLayout>
        </BrowserRouter>
    );
}

export default App;