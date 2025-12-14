'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStore, FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { products } from '@/data/products';
import { useSearchStore } from '@/store/searchStore';

interface Stats {
  vendors: number;
  products: number;
  orders: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    vendors: 0,
    products: 0,
    orders: 0,
    users: 0,
  });
  const { adminSearchTerm } = useSearchStore();

  const allFeaturedProducts = products.filter((p) => p.featured);
  
  // Filtrar productos basado en el término de búsqueda
  const featuredProducts = allFeaturedProducts.filter(product =>
    product.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  useEffect(() => {
    // Fetch stats from API
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#8B4513]">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<FaStore size={32} />}
          title="Vendors"
          value={stats.vendors}
          link="/admin/vendors"
          color="#8B4513"
        />
        <StatCard
          icon={<FaBox size={32} />}
          title="Products"
          value={stats.products}
          link="/admin/products"
          color="#D2691E"
        />
        <StatCard
          icon={<FaShoppingCart size={32} />}
          title="Orders"
          value={stats.orders}
          link="/admin/orders"
          color="#F4A460"
        />
        <StatCard
          icon={<FaUsers size={32} />}
          title="Users"
          value={stats.users}
          link="/admin/users"
          color="#8B4513"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/vendors/applications"
            className="p-6 bg-[#FFF8DC] hover:bg-[#FFE4B5] rounded-lg border-2 border-[#D2691E] transition-colors"
          >
            <h3 className="font-bold text-lg mb-2">Vendor Applications</h3>
            <p className="text-sm text-gray-600">Review pending applications</p>
          </Link>
          <Link 
            href="/admin/products/new"
            className="p-6 bg-[#FFF8DC] hover:bg-[#FFE4B5] rounded-lg border-2 border-[#D2691E] transition-colors"
          >
            <h3 className="font-bold text-lg mb-2">Add Product</h3>
            <p className="text-sm text-gray-600">Create new product listing</p>
          </Link>
          <Link 
            href="/admin/orders"
            className="p-6 bg-[#FFF8DC] hover:bg-[#FFE4B5] rounded-lg border-2 border-[#D2691E] transition-colors"
          >
            <h3 className="font-bold text-lg mb-2">Manage Orders</h3>
            <p className="text-sm text-gray-600">View and process orders</p>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#8B4513]">Featured Products</h2>
        {featuredProducts.length === 0 && adminSearchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching "{adminSearchTerm}"</p>
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
              href={`/admin/products/${product.id}`}
              className="group bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#D2691E]"
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
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{product.description}</p>
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

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  link: string;
  color: string;
}

function StatCard({ icon, title, value, link, color }: StatCardProps) {
  return (
    <Link href={link}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#D2691E]">
        <div className="flex items-center justify-between mb-4">
          <div style={{ color }}>{icon}</div>
          <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      </div>
    </Link>
  );
}
