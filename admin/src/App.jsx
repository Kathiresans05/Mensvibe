import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminCoupons from './pages/AdminCoupons';
import AdminBanners from './pages/AdminBanners';
import AdminLogin from './pages/AdminLogin';
import AdminInventory from './pages/AdminInventory';
import AdminCustomers from './pages/AdminCustomers';
import AdminReturns from './pages/AdminReturns';
import AdminReviews from './pages/AdminReviews';
import { useAdminAuth } from './context/AdminAuthContext';

const ProtectedLayout = () => {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/inventory" element={<AdminInventory />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/returns" element={<AdminReturns />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/reviews" element={<AdminReviews />} />
            <Route path="/coupons" element={<AdminCoupons />} />
            <Route path="/banners" element={<AdminBanners />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default App;
