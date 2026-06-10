"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  description: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedCart = window.localStorage.getItem("central_donuts_cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error("Error loading cart from localStorage", e);
      } finally {
        setHasLoadedCart(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    try {
      localStorage.setItem("central_donuts_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, [cart, hasLoadedCart]);

  const addToCart = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prevCart, { ...item, quantity: qty }];
    });
    // Open cart drawer for immediate visual feedback when an item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
