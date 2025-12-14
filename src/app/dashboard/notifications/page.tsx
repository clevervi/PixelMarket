'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Bell, Package, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  type: 'order' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  date: Date;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  const allNotifications: Notification[] = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'New order received #ORD-1234',
      time: '5 min ago',
      unread: true,
      date: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 2,
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Product stock low: Vueltiao Hat',
      time: '1 hour ago',
      unread: true,
      date: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: 3,
      type: 'info',
      title: 'Review Pending',
      message: 'Customer review pending approval',
      time: '2 hours ago',
      unread: false,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 4,
      type: 'success',
      title: 'Order Delivered',
      message: 'Order #ORD-1230 has been delivered successfully',
      time: '3 hours ago',
      unread: false,
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: 5,
      type: 'order',
      title: 'New Order Received',
      message: 'New order received #ORD-1233',
      time: '5 hours ago',
      unread: false,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 6,
      type: 'alert',
      title: 'Payment Failed',
      message: 'Payment failed for order #ORD-1229',
      time: '1 day ago',
      unread: false,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 7,
      type: 'success',
      title: 'Product Updated',
      message: 'Your product "Wayuu Bag" has been updated successfully',
      time: '2 days ago',
      unread: false,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  // Filtrar notificaciones
  const notifications = allNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && notification.unread);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = allNotifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-50 border-blue-200';
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAllAsRead = () => {
    // Aquí implementarías la lógica para marcar todas como leídas
    console.log('Mark all as read');
  };

  const deleteNotification = (id: number) => {
    // Aquí implementarías la lógica para eliminar la notificación
    console.log('Delete notification:', id);
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Notifications" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications' }
        ]}
        onSearch={setSearchTerm}
        searchPlaceholder="Search notifications..."
      />

      <div className="p-6">
        {/* Header with stats and actions */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-dark dark:text-dark-text">All Notifications</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              Mark all as read
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-dark-surface rounded-lg shadow-md border-l-4 transition-all hover:shadow-lg ${
                  getTypeColor(notification.type)
                } ${notification.unread ? 'border-l-4' : 'border-l-4 opacity-75'}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-dark dark:text-dark-text">
                              {notification.title}
                            </h3>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
