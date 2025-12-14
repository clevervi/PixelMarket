'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';

interface StoreInfo {
  id: string;
  name: string;
  description: string;
  city: string;
  phone: string;
  email: string;
  logo: string;
}

export default function StoreSettingsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { addNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    id: user?.id || '',
    name: user?.firstName || '',
    description: 'My store description',
    city: '',
    phone: user?.phone || '',
    email: user?.email || '',
    logo: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreInfo({
      ...storeInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/store-manager/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeInfo),
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Store settings updated successfully',
          duration: 3000,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to update store settings',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save settings',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/store-manager"
          className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B3410] font-medium"
        >
          <FaArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-[#8B4513]">Store Settings</h1>
        <p className="text-gray-600 mb-6">Manage your store information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Store Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={storeInfo.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="Your store name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Store Description
            </label>
            <textarea
              id="description"
              name="description"
              value={storeInfo.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="Tell us about your store..."
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-[#8B4513] mb-2">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={storeInfo.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="Your city"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={storeInfo.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={storeInfo.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder="Your email"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logo" className="block text-sm font-semibold text-[#8B4513] mb-2">
              Store Logo URL
            </label>
            <input
              id="logo"
              name="logo"
              type="url"
              value={storeInfo.logo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
              placeholder="https://example.com/logo.jpg"
            />
            {storeInfo.logo && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
                <img
                  src={storeInfo.logo}
                  alt="Store logo"
                  className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Logo';
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2 rounded-lg hover:bg-[#6B3410] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
            <Link
              href="/store-manager"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
