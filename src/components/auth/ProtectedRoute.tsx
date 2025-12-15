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
      try {
        const user = getCurrentUser();

        // If there is no user, redirect to login
        if (!user) {
          setIsAuthorized(false);
          router.push(redirectTo);
          return;
        }

        // If allowed roles were specified, check the user's role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role || '')) {
          // User is not authorized for this route
          setIsAuthorized(false);
          router.push('/unauthorized');
          return;
        }

        // User is authenticated and authorized
        setIsAuthorized(true);
      } finally {
        // Prevent the loader from getting "stuck" due to any early exit path
        setIsLoading(false);
      }
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

  if (!isAuthorized) {
    // While redirecting, avoid a blank screen flash
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper components for specific roles
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
