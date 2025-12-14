'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

export default function CartSessionManager() {
  const { setUserId } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    const currentUserId = user?.id || user?.email || null;
    
    // Actualizar el userId en el store del carrito
    // Esto hará que el storage cambie automáticamente a la key del usuario actual
    setUserId(currentUserId);
    
    // Forzar recarga del carrito desde el storage del usuario actual
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }, [user, setUserId]);

  return null; // Este componente no renderiza nada
}
