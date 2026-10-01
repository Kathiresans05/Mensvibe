import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@aurafashion.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 p-8 sm:p-10 rounded-3xl max-w-md w-full shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-wider">MensVibe</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] text-brand-600 font-bold">
            Men's Fashion Operations
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1.5">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="admin@aurafashion.com"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Enter Studio Console'}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          Authorized personnel only. Aura Fashion Brand Store Operations.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
