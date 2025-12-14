'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { ShoppingBag, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderRow {
  id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  items: number;
  createdAt: string;
}

export default function DashboardOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { t } = useTranslation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser.role !== 'admin' && currentUser.role !== 'vendor') {
      router.push('/dashboard');
      return;
    }

    setUser(currentUser);

    const load = async () => {
      try {
        setIsLoading(true);
        const endpoint = currentUser.role === 'admin' ? '/api/orders' : '/api/vendor/orders';
        const res = await fetch(endpoint);
        const data = await res.json();

        if (data && Array.isArray(data.data)) {
          setOrders(data.data as OrderRow[]);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to load orders', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [router]);

  if (!user) return null;

  const filtered = orders.filter((o) =>
    statusFilter === 'all' ? true : o.status === statusFilter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
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
      />

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow p-4">
          <div>
            <p className="text-sm text-gray-600">
              Showing {filtered.length} of {orders.length} orders
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">{t.status.pending}</option>
            <option value="processing">{t.status.processing}</option>
            <option value="shipped">{t.status.shipped}</option>
            <option value="delivered">{t.status.delivered}</option>
            <option value="cancelled">{t.status.cancelled}</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-brown border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-dark dark:text-dark-text">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{order.items} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-dark dark:text-dark-text">${order.total.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {t.status[order.status as keyof typeof t.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/my-orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
