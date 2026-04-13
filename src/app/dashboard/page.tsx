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
  Shield,
  Layers,
  Cpu
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardHeader 
        title="System Operations" 
        breadcrumbs={[
          { label: 'Nexus', href: '/' },
          { label: 'Ops Dashboard' }
        ]} 
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        {user && (
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-8 text-white shadow-2xl border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">
                  Status: Online. Welcome, {user.firstName || 'Architect'}.
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                  Operational overview for <strong className="font-semibold text-indigo-400">PixelMarket Nexus</strong>. 
                  Monitoring system throughput, asset licensing, and global developer impact.
                </p>
              </div>
              <div className="flex gap-3">
                {user.role === 'admin' && (
                  <button 
                    onClick={() => router.push('/dashboard/analytics')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    Global Analytics
                  </button>
                )}
                {(user.role === 'admin' || user.role === 'store_manager') && (
                  <button 
                    onClick={() => router.push('/dashboard/products')}
                    className="bg-slate-800/50 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700/50 transition-all border border-slate-700 active:scale-95"
                  >
                    Manage Repository
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
            iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Total Deployments"
            value={stats.totalOrders.toString()}
            change={stats.ordersChange}
            icon={ShoppingCart}
            iconColor="bg-gradient-to-br from-indigo-500 to-blue-600"
          />
          <StatCard
            title="Active Entities"
            value={stats.totalCustomers.toString()}
            change={stats.customersChange}
            icon={Users}
            iconColor="bg-gradient-to-br from-violet-500 to-purple-600"
          />
          <StatCard
            title="Avg Licensing Value"
            value={`$${stats.averageOrderValue.toFixed(2)}`}
            change={stats.aovChange}
            icon={TrendingUp}
            iconColor="bg-gradient-to-br from-slate-500 to-slate-700"
          />
        </div>

        {/* Quick Stats Row - Tech Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                23%
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Asset Pull Requests</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">1,234</p>
            <p className="text-xs text-slate-400 mt-2">Successful deployments across all nodes</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-violet-500" />
              </div>
              <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                12%
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Verified Clusters</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
            <p className="text-xs text-slate-400 mt-2">Core repositories active in session</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-500/10 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-slate-500" />
              </div>
              <span className="text-sm text-emerald-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                18%
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">System Stability</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</p>
            <p className="text-xs text-slate-400 mt-2">Platform uptime and integrity score</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
          
          {/* Revenue Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Asset Distribution</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">By repository class</p>
            
            <div className="space-y-6">
              {[
                { name: 'Core Architecture', value: 35, amount: '$15,831', color: 'from-indigo-600 to-indigo-400' },
                { name: 'Frontend Modules', value: 30, amount: '$13,569', color: 'from-violet-600 to-violet-400' },
                { name: 'Security Layers', value: 20, amount: '$9,046', color: 'from-emerald-600 to-emerald-400' },
                { name: 'Dev Ops Tools', value: 15, amount: '$6,785', color: 'from-slate-600 to-slate-400' },
              ].map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                    <span className="text-sm font-semibold text-indigo-500">{category.amount}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{category.value}% allocation</p>
                  </div>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Audit Log</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Real-time system event monitoring</p>
          
          <div className="space-y-4">
            {[
              { 
                action: 'License Provisioned',
                details: 'Entity #NX-4829 - Secure Kernel Asset',
                time: '2 minutes ago',
                icon: Shield,
                color: 'bg-emerald-500/10 text-emerald-500'
              },
              { 
                action: 'Repository Updated',
                details: 'UI/UX Cluster - Patch v2.4.0 deployed',
                time: '45 minutes ago',
                icon: Layers,
                color: 'bg-indigo-500/10 text-indigo-500'
              },
              { 
                action: 'New Architect Joined',
                details: 'Validated via RSA Fingerprint',
                time: '2 hours ago',
                icon: Users,
                color: 'bg-violet-500/10 text-violet-500'
              },
              { 
                action: 'Integrity Check',
                details: 'All nodes reporting optimal status',
                time: '4 hours ago',
                icon: Cpu,
                color: 'bg-slate-500/10 text-slate-500'
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className={`${activity.color} p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white leading-none mb-1">{activity.action}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{activity.details}</p>
                </div>
                <span className="text-xs font-medium text-slate-400 flex-shrink-0 tracking-tighter uppercase">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
