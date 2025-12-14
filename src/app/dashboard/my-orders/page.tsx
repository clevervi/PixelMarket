'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface UserOrderSummary {
  id: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<UserOrderSummary[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Cargar órdenes reales del backend
    fetch(`/api/users/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.orders)) {
          const mapped: UserOrderSummary[] = data.orders.map((o: any) => ({
            id: o.id,
            status: o.status,
            total: Number(o.total ?? 0),
            createdAt: o.createdAt ?? o.created_at,
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => {
        console.error('Failed to load user orders', err);
      });
  }, [router]);

  if (!user) return null;

  // Filtrar órdenes basado en el término de búsqueda
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.createdAt && order.createdAt.includes(searchTerm))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing': return <Package className="w-5 h-5 text-yellow-600" />;
      default: return <ShoppingBag className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={t.order.orderStatus}
        breadcrumbs={[
          { label: t.common.dashboard, href: '/dashboard' },
          { label: t.order.orderStatus }
        ]}
        onSearch={setSearchTerm}
        searchPlaceholder="Search orders by ID, status, or date..."
      />

      <div className="p-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No orders found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="font-semibold text-dark dark:text-dark-text">{order.id}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.status}</p>
                    <p className="text-lg font-bold text-dark dark:text-dark-text">${order.total.toLocaleString('es-CO')}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/dashboard/my-orders/${order.id}`)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
