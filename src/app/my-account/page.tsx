'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import Link from 'next/link';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function MyAccountPage() {
  const { user, isAuthenticated, logout } = useUserStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <FaUser size={64} className="mx-auto mb-4 text-[#8B4513]" />
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to access your account dashboard.
          </p>
          <Link 
            href="/profile" 
            className="inline-block bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaUser },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
    { id: 'account', label: 'Account Details', icon: FaCog },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#8B4513] dark:text-[#F4A460]">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 rounded-full bg-[#8B4513] flex items-center justify-center mx-auto mb-3">
                <FaUser size={32} className="text-white" />
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-[#8B4513] text-white shadow-md'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 mt-4"
              >
                <FaSignOutAlt size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#8B4513] dark:text-[#F4A460]">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your account details.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FFF8DC] dark:bg-gray-700 p-6 rounded-lg border-2 border-[#D2691E]">
                    <FaShoppingBag size={32} className="text-[#8B4513] dark:text-[#F4A460] mb-3" />
                    <h3 className="font-bold text-lg mb-2">Orders</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      View and track your orders
                    </p>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-[#8B4513] dark:text-[#F4A460] hover:underline font-semibold"
                    >
                      View Orders →
                    </button>
                  </div>

                  <div className="bg-[#FFF8DC] dark:bg-gray-700 p-6 rounded-lg border-2 border-[#D2691E]">
                    <FaMapMarkerAlt size={32} className="text-[#8B4513] dark:text-[#F4A460] mb-3" />
                    <h3 className="font-bold text-lg mb-2">Addresses</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Manage shipping addresses
                    </p>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className="text-[#8B4513] dark:text-[#F4A460] hover:underline font-semibold"
                    >
                      Manage Addresses →
                    </button>
                  </div>

                  <div className="bg-[#FFF8DC] dark:bg-gray-700 p-6 rounded-lg border-2 border-[#D2691E]">
                    <FaCog size={32} className="text-[#8B4513] dark:text-[#F4A460] mb-3" />
                    <h3 className="font-bold text-lg mb-2">Account Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Edit your account information
                    </p>
                    <button 
                      onClick={() => setActiveTab('account')}
                      className="text-[#8B4513] dark:text-[#F4A460] hover:underline font-semibold"
                    >
                      Edit Details →
                    </button>
                  </div>

                  <div className="bg-[#FFF8DC] dark:bg-gray-700 p-6 rounded-lg border-2 border-[#D2691E]">
                    <FaUser size={32} className="text-[#8B4513] dark:text-[#F4A460] mb-3" />
                    <h3 className="font-bold text-lg mb-2">Wishlist</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      View your saved items
                    </p>
                    <Link 
                      href="/profile/wishlist"
                      className="text-[#8B4513] dark:text-[#F4A460] hover:underline font-semibold"
                    >
                      View Wishlist →
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#8B4513] dark:text-[#F4A460]">Your Orders</h2>
                {user.orders && user.orders.length > 0 ? (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Order #{order.id}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-lg">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total)}
                          </p>
                          <Link 
                            href={`/profile/orders/${order.id}`}
                            className="text-[#8B4513] dark:text-[#F4A460] hover:underline font-semibold"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
                    <Link 
                      href="/collections"
                      className="inline-block bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#D2691E] transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#8B4513] dark:text-[#F4A460]">Your Addresses</h2>
                  <button className="bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#D2691E] transition-colors">
                    Add New Address
                  </button>
                </div>
                
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold">{address.type || 'Address'}</h3>
                          <button className="text-[#8B4513] dark:text-[#F4A460] hover:underline text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {address.street}<br />
                          {address.city}, {address.state} {address.zipCode}<br />
                          {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaMapMarkerAlt size={64} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No addresses saved yet.</p>
                    <button className="bg-[#8B4513] text-white px-6 py-3 rounded-lg hover:bg-[#D2691E] transition-colors">
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[#8B4513] dark:text-[#F4A460]">Account Details</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-bold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Current Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent dark:bg-gray-700"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                          <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="submit"
                      className="bg-[#8B4513] text-white px-8 py-3 rounded-lg hover:bg-[#D2691E] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
