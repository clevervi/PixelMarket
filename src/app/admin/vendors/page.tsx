'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface Vendor {
  id: number;
  email: string;
  storeName: string;
  firstName: string;
  lastName: string;
  status: 'pending' | 'approved' | 'rejected';
  productsCount: number;
  createdAt: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    let filtered = vendors;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVendors(filtered);
  }, [searchTerm, statusFilter, vendors]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load store managers',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (vendorId: number) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'approved' } : v));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Store manager approved',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Approve error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to approve',
        duration: 5000,
      });
    }
  };

  const handleReject = async (vendorId: number) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (response.ok) {
        setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'rejected' } : v));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Store manager rejected',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Reject error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to reject',
        duration: 5000,
      });
    }
  };

  const handleDelete = async (vendorId: number) => {
    if (!confirm('Are you sure you want to delete this store manager?')) return;

    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVendors(vendors.filter(v => v.id !== vendorId));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Store manager deleted',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#8B4513]">Store Managers</h1>
        <p className="text-gray-600 mt-1">Manage all store manager accounts</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, store name..."
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading store managers...</div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No store managers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-[#D2691E]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Store Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Manager</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{vendor.storeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vendor.firstName} {vendor.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vendor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{vendor.productsCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vendor.status)}`}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        {vendor.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor.id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Approve"
                            >
                              <FaCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(vendor.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Reject"
                            >
                              <FaTimes size={16} />
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/vendors/${vendor.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={16} />
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

      {/* Stats Footer */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredVendors.length} of {vendors.length} store managers
        </p>
      </div>
    </div>
  );
}
