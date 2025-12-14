'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';

interface QuickViewContextType {
  isOpen: boolean;
  product: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = (product: Product) => {
    setProduct(product);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setProduct(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <QuickViewContext.Provider value={{ isOpen, product, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
}
