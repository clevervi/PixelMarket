'use client';

import { useEffect, useState } from 'react';
import { FaDownload, FaEye, FaFilter } from 'react-icons/fa';
import { useUserStore } from '@/store/userStore';

interface Sale {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: number;
}

export default function SalesPage() {
  const { user } = useUserStore();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch sales data from API
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/store-manager/sales');
        if (response.ok) {
          const data = await response.json();
          setSales(data);
        }
      } catch (err) {
        console.error('Failed to fetch sales:', err);
        // Usar datos de prueba
        setSales([
          {
            id: '1',
            orderNumber: '#ORD-001',
            customerName: 'Juan Pérez',
            customerEmail: 'juan@example.com',
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            amount: 250000,
            status: 'completed',
            items: 2,
          },
          {
            id: '2',
            orderNumber: '#ORD-002',
            customerName: 'María García',
            customerEmail: 'maria@example.com',
            date: new Date(Date.now() - 172800000).toLocaleDateString(),
            amount: 180000,
            status: 'completed',
            items: 1,
          },
          {
            id: '3',
            orderNumber: '#ORD-003',
            customerName: 'Carlos López',
            customerEmail: 'carlos@example.com',
            date: new Date(Date.now() - 259200000).toLocaleDateString(),
            amount: 420000,
            status: 'pending',
            items: 3,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Filtrar y buscar
  const filteredSales = sales.filter((sale) => {
    const matchStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchSearch =
      sale.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Sale['status']) => {
    const labels = {
      completed: 'Completada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#8B4513]">Sales & Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your sales</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{filteredSales.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${(totalRevenue / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm font-semibold">Avg. Order Value</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            ${filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(0) : 0}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by order #, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaFilter className="inline mr-2" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading sales data...</div>
        ) : filteredSales.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No sales found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order #</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{sale.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{sale.customerName}</p>
                        <p className="text-sm text-gray-500">{sale.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{sale.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {sale.items}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        ${(sale.amount / 1000).toFixed(1)}K
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sale.status)}`}>
                        {getStatusLabel(sale.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Order">
                          <FaEye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Download Invoice">
                          <FaDownload size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="text-center text-sm text-gray-600">
        Showing {filteredSales.length} of {sales.length} orders
      </div>
    </div>
  );
}
