'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBox, FaShoppingCart, FaChartLine, FaDollarSign, FaArrowUp } from 'react-icons/fa';
import { useUserStore } from '@/store/userStore';
import { products } from '@/data/products';
import { useSearchStore } from '@/store/searchStore';

interface StoreStat {
  productsCount: number;
  salesCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  link: string;
  color: string;
  change?: string;
}

function StatCard({ icon, title, value, link, color, change }: StatCardProps) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#D2691E] cursor-pointer h-full">
        <div className="flex items-center justify-between mb-4">
          <div style={{ color }} className="text-4xl">{icon}</div>
          <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {change && (
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <FaArrowUp size={12} />
            <span>{change}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function StoreManagerDashboard() {
  const { user } = useUserStore();
  const [stats, setStats] = useState<StoreStat>({
    productsCount: 0,
    salesCount: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { managerSearchTerm } = useSearchStore();
  
  const allFeaturedProducts = products.filter((p) => p.featured);
  
  // Filtrar productos basado en el término de búsqueda
  const featuredProducts = allFeaturedProducts.filter(product =>
    product.name.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(managerSearchTerm.toLowerCase())
  );

  useEffect(() => {
    // Fetch store manager stats from API
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/store-manager/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Usar datos de prueba
        setStats({
          productsCount: 24,
          salesCount: 156,
          totalRevenue: 45200,
          averageOrderValue: 290,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-[#8B4513]">Welcome back, {user?.firstName}! 👋</h1>
        <p className="text-gray-600">Here's your store performance overview.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaBox />}
          title="My Products"
          value={stats.productsCount}
          link="/store-manager/products"
          color="#f59e0b"
          change={`${stats.productsCount} listed`}
        />
        <StatCard
          icon={<FaShoppingCart />}
          title="Sales"
          value={stats.salesCount}
          link="/store-manager/sales"
          color="#ec4899"
          change="This month"
        />
        <StatCard
          icon={<FaDollarSign />}
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          link="/store-manager/sales"
          color="#10b981"
          change="This month"
        />
        <StatCard
          icon={<FaChartLine />}
          title="Avg Order Value"
          value={`$${stats.averageOrderValue}`}
          link="/store-manager/sales"
          color="#3b82f6"
          change="Per order"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/store-manager/products/new"
            className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-lg border-2 border-amber-300 transition-all"
          >
            <h3 className="font-bold text-lg mb-2 text-amber-900">Add New Product</h3>
            <p className="text-sm text-amber-700">Create and list a new product</p>
          </Link>
          <Link 
            href="/store-manager/sales"
            className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-lg border-2 border-pink-300 transition-all"
          >
            <h3 className="font-bold text-lg mb-2 text-pink-900">View Sales</h3>
            <p className="text-sm text-pink-700">Check your sales and orders</p>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Featured Products</h2>
        {featuredProducts.length === 0 && managerSearchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching "{managerSearchTerm}"</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/store-manager/products/${product.id}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#D2691E]"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#8B4513]">${product.price}</span>
                  {product.featured && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-semibold">Featured</span>
                  )}
                </div>
              </div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
