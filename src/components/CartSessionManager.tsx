'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

export default function CartSessionManager() {
  const { setUserId } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    const currentUserId = user?.id || user?.email || null;
    
    // Update the userId in the cart store
    // This makes the storage key automatically switch to the current user
    setUserId(currentUserId);
    
    // Force a cart reload from the current user's storage
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }, [user, setUserId]);

  return null; // This component does not render anything
}
