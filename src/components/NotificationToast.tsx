"use client";

import { useNotificationStore } from '@/store/notificationStore';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const iconMap = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];
        const colorClass = colorMap[notification.type];

        return (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-in-right"
          >
            <div className="flex items-start p-4">
              <div className={`${colorClass} rounded-full p-2 mr-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className={`h-1 ${colorClass} animate-progress`} />
          </div>
        );
      })}
    </div>
  );
}
