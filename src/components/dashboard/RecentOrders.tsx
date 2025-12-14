import { RecentOrder } from '@/store/dashboardStore';
import { ShoppingBag, Clock } from 'lucide-react';

interface RecentOrdersProps {
  orders: RecentOrder[];
}

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-1">Recent Orders</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Latest customer transactions</p>
        </div>
        <ShoppingBag className="w-6 h-6 text-secondary" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Customer</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Product</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors duration-200"
              >
                <td className="py-3 px-2 text-sm font-medium text-primary">{order.id}</td>
                <td className="py-3 px-2 text-sm text-dark dark:text-dark-text">{order.customer}</td>
                <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">{order.product}</td>
                <td className="py-3 px-2 text-sm font-semibold text-dark dark:text-dark-text">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
