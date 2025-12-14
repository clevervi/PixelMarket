'use client';

import { useState } from 'react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useCartSidebar } from '@/contexts/CartSidebarContext';
import type { Product } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addNotification } = useNotificationStore();
  const { openCart } = useCartSidebar();
  const { t } = useTranslation();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    addNotification({
      type: 'success',
      title: 'Added to cart',
      message: `${quantity} ${quantity > 1 ? 'units' : 'unit'} of ${product.name}`
    });
    openCart();
  };

  const handleToggleFavorite = () => {
    toggleItem(product.id);
    addNotification({
      type: inWishlist ? 'info' : 'success',
      title: inWishlist ? 'Removed from favorites' : 'Added to favorites',
      message: product.name
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button 
        onClick={handleAddToCart}
        className="btn-primary flex-1 flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        <FaShoppingCart />
        {t.common.addToCart}
      </button>
      <button 
        onClick={handleToggleFavorite}
        className={`px-6 py-3 border-2 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg ${
          inWishlist
            ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
            : 'border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white'
        }`}
      >
        <FaHeart fill={inWishlist ? 'currentColor' : 'none'} />
        {inWishlist ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
}
