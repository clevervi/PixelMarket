'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth-storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser();
      
      // Si no hay usuario, redirigir al login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Si se especificaron roles permitidos, verificar el rol del usuario
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role || '')) {
        // Usuario no autorizado para esta ruta
        router.push('/unauthorized');
        return;
      }

      // Usuario autenticado y autorizado
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}

// Helper components para roles específicos
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const StoreManagerRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['admin', 'store_manager']}>
    {children}
  </ProtectedRoute>
);

export const CustomerRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRoles={['customer']}>
    {children}
  </ProtectedRoute>
);
