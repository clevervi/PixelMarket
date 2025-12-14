'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useReviewStore } from '@/store/reviewStore';
import { useQuestionStore } from '@/store/questionStore';
import { getCurrentUser } from '@/lib/auth-storage';

// Solo hidratar los stores que lo necesitan (no settings)
export default function StoreHydration() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      useCartStore.persist.rehydrate();
      useWishlistStore.persist.rehydrate();
      useReviewStore.persist.rehydrate();
      useQuestionStore.persist.rehydrate();

      // Sincronizar wishlist con backend si el usuario está autenticado
      const user = getCurrentUser();
      if (user) {
        fetch('/api/wishlist')
          .then((res) => res.json())
          .then((data) => {
            if (data?.success && Array.isArray(data.data)) {
              const ids = data.data.map((item: any) => item.producto_id ?? item.productId ?? item.product_id);
              useWishlistStore.getState().setItems(ids.filter(Boolean));
            }
          })
          .catch((err) => {
            console.error('Failed to sync wishlist from backend', err);
          });
      }
    }
  }, []);

  return null;
}
