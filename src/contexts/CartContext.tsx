import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  product_id: string;
  variant_id?: string | null;
  name: string;
  variant_title?: string | null;
  image?: string | null;
  sku?: string | null;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  subtotalCents: number;
  discountCents: number;
  couponCode: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const STORAGE_KEY = 'kairouan_cart';
const COUPON_KEY = 'kairouan_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [couponCode, setCouponCode] = useState<string | null>(() => {
    try { return localStorage.getItem(COUPON_KEY); } catch { return null; }
  });
  const [discountCents, setDiscountCents] = useState(0);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  const subtotalCents = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartTotal = subtotalCents - discountCents;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.product_id === item.product_id && i.variant_id === item.variant_id
      );
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id && i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string | null) => {
    setCart(prev => prev.filter(
      i => !(i.product_id === productId && i.variant_id === (variantId ?? null))
    ));
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) { removeFromCart(productId, variantId); return; }
    setCart(prev => prev.map(i =>
      i.product_id === productId && i.variant_id === (variantId ?? null)
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode(null);
    setDiscountCents(0);
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(COUPON_KEY); } catch {}
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const { data } = await supabase
      .from('ecom_coupons')
      .select('discount_type, discount_value, active')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (!data) return false;

    const disc = data.discount_type === 'percent'
      ? Math.round(subtotalCents * data.discount_value / 100)
      : data.discount_value;

    setCouponCode(code.toUpperCase());
    setDiscountCents(disc);
    try { localStorage.setItem(COUPON_KEY, code.toUpperCase()); } catch {}
    return true;
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscountCents(0);
    try { localStorage.removeItem(COUPON_KEY); } catch {}
  };

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartTotal, subtotalCents, discountCents,
      couponCode, addToCart, removeFromCart, updateQuantity,
      clearCart, applyCoupon, removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  );
};
