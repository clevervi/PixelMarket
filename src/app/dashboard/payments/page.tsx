'use client';

import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaCreditCard } from 'react-icons/fa';
import { useNotificationStore } from '@/store/notificationStore';

interface PaymentMethod {
  id: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

export default function PaymentsPage() {
  const { addNotification } = useNotificationStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardName: 'Visa',
      cardNumber: '**** **** **** 1234',
      expiryDate: '12/25',
      isDefault: true,
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
  });

  const handleAdd = () => {
    if (!form.cardName || !form.cardNumber || !form.expiryDate) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        duration: 5000,
      });
      return;
    }

    // Mask card number
    const maskedNumber = `**** **** **** ${form.cardNumber.slice(-4)}`;

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      cardName: form.cardName,
      cardNumber: maskedNumber,
      expiryDate: form.expiryDate,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setForm({ cardName: '', cardNumber: '', expiryDate: '' });
    setIsAdding(false);

    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Payment method added successfully',
      duration: 3000,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Payment method deleted',
        duration: 3000,
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(p => ({
      ...p,
      isDefault: p.id === id,
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Payment Methods</h1>
          <p className="text-gray-600 mt-1">Manage your payment options</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
          >
            <FaPlus size={16} />
            Add Payment Method
          </button>
        )}
      </div>

      {/* Add Payment Method Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Payment Method</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Name (e.g., Visa, Mastercard)</label>
              <input
                type="text"
                value={form.cardName}
                onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                placeholder="e.g., My Visa Card"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                placeholder="1234 5678 9012 3456"
              />
              <p className="text-xs text-gray-500 mt-1">Only last 4 digits will be stored for security</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  value={form.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    setForm({ ...form, expiryDate: value });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                  placeholder="MM/YY"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium"
              >
                <FaSave size={16} />
                Save Payment Method
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setForm({ cardName: '', cardNumber: '', expiryDate: '' });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-start justify-between mb-8">
              <FaCreditCard size={32} className="text-[#D2691E]" />
              {method.isDefault && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-semibold">
                  Default
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">Card Number</p>
              <p className="text-lg font-mono tracking-widest">{method.cardNumber}</p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Card Name</p>
                <p className="font-semibold">{method.cardName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Expires</p>
                <p className="font-semibold">{method.expiryDate}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-700">
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  Set as Default
                </button>
              )}
              <button
                onClick={() => handleDelete(method.id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Delete"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {paymentMethods.length === 0 && !isAdding && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
          <p className="mb-4">No payment methods added yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-block bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors"
          >
            Add Your First Payment Method
          </button>
        </div>
      )}
    </div>
  );
}
