import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ExternalLink, Sparkles } from 'lucide-react';

const AdminHeader = () => {
  const { admin } = useAdminAuth();

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center space-x-2.5 text-xs font-medium text-slate-600">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-wide text-slate-700">MensVibe Atelier</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-400 font-normal">Store Management Active</span>
      </div>

      <div className="flex items-center space-x-5">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Customer Store</span>
        </a>

        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 font-semibold text-xs flex items-center justify-center shadow-xs">
            {admin?.name ? admin.name[0].toUpperCase() : 'M'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 tracking-tight">{admin?.name || 'MensVibe Admin'}</p>
            <p className="text-[11px] text-slate-500 font-medium">{admin?.email || 'admin@mensvibe.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
