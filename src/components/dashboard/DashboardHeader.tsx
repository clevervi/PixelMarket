'use client';

import { Bell, Search, User, ChevronDown, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-storage';
import { toast } from 'react-hot-toast';

interface DashboardHeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onSearch?: (searchTerm: string) => void;
  searchPlaceholder?: string;
}

export default function DashboardHeader({ title, breadcrumbs, onSearch, searchPlaceholder = "Search..." }: DashboardHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const notifications = [
    { id: 1, message: 'New order received #ORD-1234', time: '5 min ago', unread: true },
    { id: 2, message: 'Product stock low: Vueltiao Hat', time: '1 hour ago', unread: true },
    { id: 3, message: 'Customer review pending approval', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title & Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-dark-text">{title}</h1>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Search, Theme, Notifications, User */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-dark-brown rounded-lg px-4 py-2 w-80">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="bg-transparent border-none outline-none text-sm w-full text-dark dark:text-dark-text placeholder:text-gray-400"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="font-semibold text-dark dark:text-dark-text">Notifications</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      You have {unreadCount} unread notifications
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors cursor-pointer ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm text-dark dark:text-dark-text">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200 dark:border-gray-800">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        router.push('/dashboard/notifications');
                      }}
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-dark dark:text-dark-text">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user?.role?.replace('_', ' ') || 'User'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <p className="font-semibold text-dark dark:text-dark-text">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.email || 'user@example.com'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">
                      {user?.role?.replace('_', ' ') || 'User'}
                    </p>
                  </div>
                  <div className="p-2">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </a>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </a>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-800">
                    <button 
                      onClick={() => {
                        logout();
                        toast.success('Logged out successfully');
                        router.push('/login');
                      }}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
