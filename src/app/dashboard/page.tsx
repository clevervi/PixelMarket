'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import { useDashboardStore } from '@/store/dashboardStore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import SalesChart from '@/components/dashboard/SalesChart';
import TopProducts from '@/components/dashboard/TopProducts';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Eye
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { stats, salesData, topProducts, recentOrders, fetchDashboardData, isLoading } = useDashboardStore();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchDashboardData();
  }, [fetchDashboardData, router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Dashboard" 
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' }
        ]} 
      />

      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        {user && (
          <div className="bg-gradient-to-r from-[#8B4513] to-[#D2691E] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Hola {user.firstName || 'artesano/a'}, bienvenido al panel.
                </h2>
                <p className="text-white/90 text-lg max-w-2xl">
                  Aquí puedes ver el rendimiento de <strong className="font-semibold">Ancestral heartbeat</strong>:
                  ventas, pedidos y el impacto económico que la plataforma genera en las comunidades artesanas.
                </p>
              </div>
              <div className="flex gap-3">
                {user.role === 'admin' && (
                  <button 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="bg-white text-[#8B4513] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Ver analítica global
                  </button>
                )}
                {(user.role === 'admin' || user.role === 'store_manager') && (
                  <button 
                    onClick={() => router.push('/dashboard/products')}
                    className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Gestionar catálogo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={DollarSign}
            iconColor="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            change={stats.ordersChange}
            icon={ShoppingCart}
            iconColor="bg-gradient-to-br from-primary to-secondary"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            change={stats.customersChange}
            icon={Users}
            iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Average Order Value"
            value={`$${stats.averageOrderValue.toFixed(2)}`}
            change={stats.aovChange}
            icon={TrendingUp}
            iconColor="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Quick Stats Row - impacto en comunidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                23%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Piezas artesanales vendidas</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">1,234</p>
            <p className="text-xs text-gray-500 mt-2">vs. mes anterior en la plataforma</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Comunidades activas</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">8</p>
            <p className="text-xs text-gray-500 mt-2">Wayuu, Caribe, Andina y otras regiones</p>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                18%
              </span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Ingreso promedio por artesano</h3>
            <p className="text-2xl font-bold text-dark dark:text-dark-text">$1.2M COP</p>
            <p className="text-xs text-gray-500 mt-2">Estimado frente al periodo previo a la plataforma</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-1">Revenue Breakdown</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">By product category</p>
            
            <div className="space-y-4">
              {[
                { name: 'Hats & Accessories', value: 35, amount: '$15,831', color: 'from-primary to-primary/70' },
                { name: 'Bags & Textiles', value: 30, amount: '$13,569', color: 'from-secondary to-secondary/70' },
                { name: 'Home Decor', value: 20, amount: '$9,046', color: 'from-accent to-accent/70' },
                { name: 'Jewelry', value: 15, amount: '$6,785', color: 'from-purple-500 to-purple-400' },
              ].map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dark dark:text-dark-text">{category.name}</span>
                    <span className="text-sm font-semibold text-primary">{category.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{category.value}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProducts products={topProducts} />
          <RecentOrders orders={recentOrders} />
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Latest store activities and updates</p>
          
          <div className="space-y-4">
            {[
              { 
                action: 'New order placed',
                details: 'Order #ORD-1234 - Vueltiao Hat',
                time: '5 minutes ago',
                icon: ShoppingCart,
                color: 'bg-green-500'
              },
              { 
                action: 'Product updated',
                details: 'Wayuu Bag - Stock updated to 32 units',
                time: '1 hour ago',
                icon: Package,
                color: 'bg-blue-500'
              },
              { 
                action: 'New customer registered',
                details: 'Sarah Johnson joined',
                time: '2 hours ago',
                icon: Users,
                color: 'bg-purple-500'
              },
              { 
                action: 'Low stock alert',
                details: 'Hammock Chair - Only 18 units left',
                time: '3 hours ago',
                icon: TrendingUp,
                color: 'bg-red-500'
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors">
                <div className={`${activity.color} p-2 rounded-lg flex-shrink-0`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-dark dark:text-dark-text">{activity.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
