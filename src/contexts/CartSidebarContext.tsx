'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartSidebarContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(undefined);

export function CartSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleCart = () => {
    if (isOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  return (
    <CartSidebarContext.Provider value={{ isOpen, openCart, closeCart, toggleCart }}>
      {children}
    </CartSidebarContext.Provider>
  );
}

export function useCartSidebar() {
  const context = useContext(CartSidebarContext);
  if (context === undefined) {
    throw new Error('useCartSidebar must be used within a CartSidebarProvider');
  }
  return context;
}
