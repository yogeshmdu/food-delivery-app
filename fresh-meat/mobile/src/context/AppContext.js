// Global Application Context & State Management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMenu, getOrdersByPhone } from '../api/client';

// Optional AsyncStorage loader with fallback
let storageModule = null;
try {
  storageModule = require('@react-native-async-storage/async-storage').default;
} catch {
  storageModule = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {}
  };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [shop, setShop] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [user, setUser] = useState({ name: '', phone: '', address: '' });
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial menu and persistent storage
  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        // Load stored cart & user
        const storedCart = await storageModule.getItem('mm_cart');
        const storedUser = await storageModule.getItem('mm_user');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedUser) setUser(JSON.parse(storedUser));

        // Fetch menu from backend
        const menuData = await getMenu();
        setShop(menuData.shop);
        setCategories(menuData.categories);
        setCategoryImages(menuData.categoryImages || {});
        setProducts(menuData.products);
      } catch (err) {
        console.warn('Initialization error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  // Sync cart to storage
  const persistCart = async (newCart) => {
    setCart(newCart);
    try {
      await storageModule.setItem('mm_cart', JSON.stringify(newCart));
    } catch {}
  };

  const addToCart = (productId) => {
    const currentQty = cart[productId] || 0;
    const nextQty = Math.min(20, currentQty + 1);
    persistCart({ ...cart, [productId]: nextQty });
  };

  const decrementCart = (productId) => {
    const currentQty = cart[productId] || 0;
    const nextCart = { ...cart };
    if (currentQty <= 1) {
      delete nextCart[productId];
    } else {
      nextCart[productId] = currentQty - 1;
    }
    persistCart(nextCart);
  };

  const clearCart = () => {
    persistCart({});
  };

  const getCartItems = () => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find(p => String(p.id) === String(id));
        return product ? { product, qty } : null;
      })
      .filter(Boolean);
  };

  const getCartSubtotal = () => {
    return getCartItems().reduce((acc, item) => acc + item.product.price * item.qty, 0);
  };

  const getCartCount = () => {
    return getCartItems().reduce((acc, item) => acc + item.qty, 0);
  };

  const saveUserProfile = async (profile) => {
    const cleanUser = {
      name: String(profile.name || '').trim(),
      phone: String(profile.phone || '').trim(),
      address: String(profile.address || '').trim()
    };
    setUser(cleanUser);
    try {
      await storageModule.setItem('mm_user', JSON.stringify(cleanUser));
    } catch {}
  };

  const refreshUserOrders = async () => {
    if (user.phone) {
      try {
        const fetched = await getOrdersByPhone(user.phone);
        setOrders(fetched);
      } catch {}
    }
  };

  const reloadMenu = async () => {
    try {
      const menuData = await getMenu();
      setShop(menuData.shop);
      setCategories(menuData.categories);
      setProducts(menuData.products);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        shop,
        categories,
        categoryImages,
        products,
        cart,
        user,
        activeOrder,
        orders,
        loading,
        error,
        addToCart,
        decrementCart,
        clearCart,
        getCartItems,
        getCartSubtotal,
        getCartCount,
        saveUserProfile,
        setActiveOrder,
        refreshUserOrders,
        reloadMenu
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
