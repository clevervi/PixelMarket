'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaFilter } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface VendorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
}

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<VendorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    setFilteredApplications(filtered);
  }, [statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/vendor/apply');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load vendor applications',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch('/api/vendor/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action: 'approve',
          adminId: '1', // En producción, usar el ID del admin autenticado
        }),
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === applicationId ? { ...app, status: 'approved' } : app
        ));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Vendor application approved. User can now login as store-manager.',
          duration: 3000,
        });
        setShowModal(false);
      } else {
        throw new Error('Failed to approve application');
      }
    } catch (error) {
      console.error('Approve error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to approve application',
        duration: 5000,
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const response = await fetch('/api/vendor/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action: 'reject',
          adminId: '1',
        }),
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        ));
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Vendor application rejected',
          duration: 3000,
        });
        setShowModal(false);
      } else {
        throw new Error('Failed to reject application');
      }
    } catch (error) {
      console.error('Reject error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to reject application',
        duration: 5000,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#8B4513]">Vendor Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage vendor store manager applications</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        <FaFilter size={20} className="text-gray-500" />
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-[#8B4513] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Business</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{app.name}</td>
                    <td className="px-6 py-4 text-gray-700">{app.email}</td>
                    <td className="px-6 py-4 text-gray-700">{app.business}</td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <FaCheck size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <FaTimes size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-[#8B4513]">{selectedApp.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{selectedApp.business}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-800">{selectedApp.email}</p>
              </div>
              {selectedApp.phone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-800">{selectedApp.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About Products</label>
                <p className="text-gray-800 whitespace-pre-wrap">{selectedApp.message}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                {getStatusBadge(selectedApp.status)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Applied on</label>
                <p className="text-gray-800">{new Date(selectedApp.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              {selectedApp.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
