import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      const local = localStorage.getItem('aura_wishlist');
      if (local) setWishlist(JSON.parse(local));
      return;
    }
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) setWishlist(res.data.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    if (!isAuthenticated) {
      const products = [...(wishlist.products || [])];
      const index = products.findIndex((p) => (p._id || p.id) === productId);
      if (index > -1) {
        products.splice(index, 1);
      } else {
        products.push(product);
      }
      const newWish = { products };
      setWishlist(newWish);
      localStorage.setItem('aura_wishlist', JSON.stringify(newWish));
      return;
    }

    try {
      const res = await api.post('/wishlist/toggle', { productId });
      if (res.data.success) setWishlist(res.data.wishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return (wishlist.products || []).some((p) => (p._id || p.id || p) === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
