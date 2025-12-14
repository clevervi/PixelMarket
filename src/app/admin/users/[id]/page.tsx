'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useNotificationStore } from '@/store/notificationStore';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface UserForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'customer' | 'vendor' | 'store-manager' | 'admin';
}

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const isNew = userId === 'new';

  const [form, setForm] = useState<UserForm>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'customer',
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isNew) {
      fetchUser();
    }
  }, [userId, isNew]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setForm({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: '',
          role: data.role || 'customer',
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load user',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.firstName || !form.lastName) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
        duration: 5000,
      });
      return;
    }

    if (isNew && !form.password) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Password is required for new users',
        duration: 5000,
      });
      return;
    }

    try {
      setIsSaving(true);
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/users' : `/api/users/${userId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: isNew ? 'User created successfully' : 'User updated successfully',
          duration: 3000,
        });
        router.push('/admin/users');
      } else {
        const error = await response.json();
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to save user',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error saving user',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xl text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">
            {isNew ? 'Create New User' : 'Edit User'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isNew ? 'Add a new user account' : 'Update user information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              disabled={!isNew}
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password {isNew && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isNew ? 'Enter password' : 'Leave empty to keep current password'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserForm['role'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor (Legacy)</option>
              <option value="store-manager">Store Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium disabled:opacity-50"
          >
            <FaSave size={16} />
            {isSaving ? 'Saving...' : 'Save User'}
          </button>
          <Link
            href="/admin/users"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
