'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'store_manager', 'customer']}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Sidebar />
        <div className="lg:pl-64 transition-all duration-300">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
