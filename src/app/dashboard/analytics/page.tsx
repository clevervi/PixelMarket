'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (currentUser.role !== 'admin' && currentUser.role !== 'store_manager') {
      router.push('/dashboard');
      return;
    }
    
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Analytics" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics' }
        ]} 
      />

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4" />
                12.5%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Revenue</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">$45,231</p>
            <p className="text-xs text-gray-500 mt-2">+$5,234 from last month</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4" />
                8.2%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Orders</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">1,234</p>
            <p className="text-xs text-gray-500 mt-2">+94 from last month</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4" />
                15.3%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Customers</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">8,549</p>
            <p className="text-xs text-gray-500 mt-2">+1,134 new customers</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="flex items-center gap-1 text-sm text-red-600 font-semibold">
                <TrendingDown className="w-4 h-4" />
                3.1%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Avg Order Value</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">$36.65</p>
            <p className="text-xs text-gray-500 mt-2">-$1.20 from last month</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Sales Trend</h2>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Top Selling Products</h2>
            <div className="space-y-4">
              {[
                { name: 'Vueltiao Hat', sales: 234, revenue: '$10,764' },
                { name: 'Wayuu Bag', sales: 189, revenue: '$16,991' },
                { name: 'Hammock Chair', sales: 156, revenue: '$20,278' },
                { name: 'Ceramic Vase', sales: 142, revenue: '$4,966' },
                { name: 'Woven Bracelet', sales: 128, revenue: '$2,047' },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-dark dark:text-dark-text">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <p className="font-semibold text-primary">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-6">Category Performance</h2>
          <div className="space-y-4">
            {[
              { name: 'Hats & Accessories', revenue: 35, amount: '$15,831', color: 'from-primary to-primary/70' },
              { name: 'Bags & Textiles', revenue: 30, amount: '$13,569', color: 'from-secondary to-secondary/70' },
              { name: 'Home Decor', revenue: 20, amount: '$9,046', color: 'from-accent to-accent/70' },
              { name: 'Jewelry', revenue: 15, amount: '$6,785', color: 'from-purple-500 to-purple-400' },
            ].map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark dark:text-dark-text">{category.name}</span>
                  <span className="text-sm font-semibold text-primary">{category.amount}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.revenue}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{category.revenue}% of total revenue</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
