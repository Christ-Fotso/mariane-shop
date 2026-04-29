'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';

export interface CartItem extends ProductEntity {
  cartQuantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: ProductEntity) => void;
  updateQuantity: (index: number, newQuantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const addToCart = (product: ProductEntity) => {
    setCart((prevCart) => {
      const existingCart = [...prevCart];
      const existingProductIndex = existingCart.findIndex((item) => item.id === product.id);
      
      if (existingProductIndex >= 0) {
        existingCart[existingProductIndex].cartQuantity += 1;
      } else {
        existingCart.push({ ...product, cartQuantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      return existingCart;
    });
    setIsCartOpen(true); // Open the drawer whenever an item is added
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      if (newQuantity <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index].cartQuantity = newQuantity;
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, updateQuantity, clearCart, toggleCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
