import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  FolderTree,
  Boxes,
  ShoppingBag,
  TicketPercent,
  Image,
  LogOut,
  ExternalLink,
  Warehouse,
  Users,
  RotateCcw,
  Star,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminSidebar = () => {
  const { logout } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Shirt },
    { name: 'Categories', path: '/categories', icon: FolderTree },
    { name: 'Inventory', path: '/inventory', icon: Warehouse },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Returns', path: '/returns', icon: RotateCcw },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Coupons', path: '/coupons', icon: TicketPercent },
    { name: 'Banners', path: '/banners', icon: Image },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shadow-xs z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-2xl tracking-widest text-slate-900 block">MensVibe</span>
            <span className="text-[10px] block font-bold text-brand-600 uppercase tracking-[0.25em] mt-0.5">
              Men's Fashion
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold border-r-4 border-brand-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Links */}
      <div className="p-4 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-brand-600 hover:shadow-xs border border-transparent hover:border-slate-200 transition-all"
        >
          <span className="flex items-center space-x-2.5">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Customer Website</span>
          </span>
        </a>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
