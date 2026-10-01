import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      const localCart = localStorage.getItem('aura_cart');
      if (localCart) setCart(JSON.parse(localCart));
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success) setCart(res.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (itemData) => {
    if (!isAuthenticated) {
      const items = [...(cart.items || [])];
      const existing = items.find(
        (i) => i.product?._id === itemData.productId && i.color === itemData.color && i.size === itemData.size
      );
      if (existing) {
        existing.quantity += itemData.quantity;
      } else {
        items.push({
          product: itemData.product,
          variantSku: itemData.variantSku,
          color: itemData.color,
          size: itemData.size,
          quantity: itemData.quantity,
          price: itemData.product.sellingPrice,
        });
      }
      const newCart = { items };
      setCart(newCart);
      localStorage.setItem('aura_cart', JSON.stringify(newCart));
      return;
    }

    try {
      const res = await api.post('/cart', itemData);
      if (res.data.success) setCart(res.data.cart);
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      const items = (cart.items || [])
        .map((i) => (i._id === itemId || i.variantSku === itemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      const newCart = { items };
      setCart(newCart);
      localStorage.setItem('aura_cart', JSON.stringify(newCart));
      return;
    }

    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) setCart(res.data.cart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) {
      const items = (cart.items || []).filter((i) => i._id !== itemId && i.variantSku !== itemId);
      const newCart = { items };
      setCart(newCart);
      localStorage.setItem('aura_cart', JSON.stringify(newCart));
      return;
    }

    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data.success) setCart(res.data.cart);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await api.delete('/cart');
    }
    setCart({ items: [] });
    localStorage.removeItem('aura_cart');
  };

  const cartCount = (cart.items || []).reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = (cart.items || []).reduce(
    (sum, item) => sum + (item.price || item.product?.sellingPrice || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        cartSubtotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
