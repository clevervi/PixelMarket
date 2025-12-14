'use client';

import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { addNotification } = useNotificationStore();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      city: 'Cartagena',
      state: 'Bolívar',
      zipCode: '130001',
      isDefault: true,
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleAdd = () => {
    if (!form.label || !form.street || !form.city) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        duration: 5000,
      });
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...form,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddress]);
    setForm({ label: '', street: '', city: '', state: '', zipCode: '' });
    setIsAdding(false);

    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Address added successfully',
      duration: 3000,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Address deleted',
        duration: 3000,
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">My Addresses</h1>
          <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
          >
            <FaPlus size={16} />
            Add Address
          </button>
        )}
      </div>

      {/* Add Address Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Address</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Label (Home, Office, etc.)</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                placeholder="e.g., Home"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State/Province</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP/Postal Code</label>
              <input
                type="text"
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
              >
                <FaSave size={16} />
                Save Address
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setForm({ label: '', street: '', city: '', state: '', zipCode: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{address.label}</h3>
                {address.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold mt-1 inline-block">
                    Default Address
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-gray-700 mb-4">
              <p className="font-medium">{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
            </div>

            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="w-full py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {addresses.length === 0 && !isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
          <p className="mb-4">No addresses added yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-block bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}
