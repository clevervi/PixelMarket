'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/auth-storage';
import { FiUser, FiMapPin, FiCreditCard, FiPackage, FiHeart, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('You must be logged in to view your profile');
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Welcome, {user.firstName} {user.lastName}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Información Personal */}
          <Link
            href="/profile/information"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <FiUser className="text-2xl text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600">
                  Update your personal information
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not registered'}</p>
            </div>
          </Link>

          {/* Direcciones */}
          <Link
            href="/profile/addresses"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FiMapPin className="text-2xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Addresses</h2>
                <p className="text-sm text-gray-600">
                  Manage your shipping addresses
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{user.addresses?.length || 0} {user.addresses?.length === 1 ? 'address' : 'addresses'} saved</p>
            </div>
          </Link>

          {/* Métodos de Pago */}
          <Link
            href="/profile/payment-methods"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FiCreditCard className="text-2xl text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Methods
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your payment methods
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{user.paymentMethods?.length || 0} {user.paymentMethods?.length === 1 ? 'method' : 'methods'} saved</p>
            </div>
          </Link>

          {/* Pedidos */}
          <Link
            href="/profile/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FiPackage className="text-2xl text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  My Orders
                </h2>
                <p className="text-sm text-gray-600">
                  Your purchase history
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{user.orders?.length || 0} {user.orders?.length === 1 ? 'order' : 'orders'} placed</p>
            </div>
          </Link>

          {/* Lista de Deseos */}
          <Link
            href="/wishlist"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiHeart className="text-2xl text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Wishlist
                </h2>
                <p className="text-sm text-gray-600">
                  Your favorite products
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{user.wishlist?.length || 0} {user.wishlist?.length === 1 ? 'product' : 'products'}</p>
            </div>
          </Link>

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <FiLogOut className="text-2xl text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Log Out
                </h2>
                <p className="text-sm text-gray-600">
                  Sign out of your account
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
