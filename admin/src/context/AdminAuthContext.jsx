import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem('aura_admin_token');
      if (token) {
        try {
          const res = await adminApi.get('/auth/me');
          if (res.data.success && res.data.user.role === 'admin') {
            setAdmin(res.data.user);
          } else {
            localStorage.removeItem('aura_admin_token');
            setAdmin(null);
          }
        } catch (error) {
          localStorage.removeItem('aura_admin_token');
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    fetchAdmin();
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.post('/auth/login', { email, password });
    if (res.data.success) {
      if (res.data.user.role !== 'admin') {
        throw new Error('Access denied: Admin role required');
      }
      localStorage.setItem('aura_admin_token', res.data.token);
      setAdmin(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('aura_admin_token');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
