'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEye, FaSearch } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface Order {
  id: number;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#8B4513]">Orders Management</h1>
        <p className="text-gray-600 mt-1">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-50 outline-none text-gray-700"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-[#D2691E]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.items} items</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}
