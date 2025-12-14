'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartSidebar } from '@/contexts/CartSidebarContext';
import { useCartStore } from '@/store/cartStore';
import { FiX, FiTrash2, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

export default function CartSidebar() {
  const { isOpen, closeCart } = useCartSidebar();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const totalPrice = getTotal();
  const totalItems = getItemCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-dark-surface shadow-2xl z-[9999] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <FiShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-dark dark:text-dark-text">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-brown rounded-full transition-colors"
            aria-label="Close cart"
          >
            <FiX className="w-6 h-6 text-dark dark:text-dark-text" />
          </button>
        </div>

        {/* Items Count */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-primary/10 border-b border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium text-dark dark:text-dark-text">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-dark-brown rounded-full flex items-center justify-center mb-4">
                <FiShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-dark dark:text-dark-text mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some beautiful Colombian handicrafts to get started!
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="btn-primary inline-block"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-dark-brown rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={closeCart}
                      className="font-semibold text-dark dark:text-dark-text hover:text-primary transition-colors line-clamp-2 mb-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                      {item.product.category}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-dark-brown-2 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-dark-brown-2 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4 bg-white dark:bg-dark-surface">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-dark dark:text-dark-text">
                Subtotal:
              </span>
              <span className="font-bold text-2xl text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Shipping Note */}
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Shipping and taxes calculated at checkout
            </p>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full btn-primary text-center block"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full block text-center px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-dark dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
              >
                View Cart
              </Link>
            </div>

            {/* Continue Shopping Link */}
            <button
              onClick={closeCart}
              className="w-full text-center text-primary font-semibold hover:text-secondary transition-colors underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
