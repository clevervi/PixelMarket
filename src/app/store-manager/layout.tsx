'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { FaHome, FaBox, FaChartBar, FaSignOutAlt, FaCog, FaSearch, FaBell } from 'react-icons/fa';
import { useSearchStore } from '@/store/searchStore';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPath: string;
}

function NavLink({ href, icon, children, currentPath }: NavLinkProps) {
  const isActive = currentPath === href || currentPath.startsWith(href + '/');
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#8B4513] text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

export default function StoreManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore() as any;
  const { managerSearchTerm, setManagerSearchTerm } = useSearchStore();

  // Proteger ruta - solo store-manager/admin puede acceder
  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'store-manager' && user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, user?.role, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logout();
      localStorage.removeItem('user-storage');
      router.push('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!isAuthenticated || (user?.role !== 'store-manager' && user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="fixed top-[120px] left-0 right-0 bg-white border-b border-gray-200 z-40 h-16 flex items-center px-6 shadow-sm">
        <div className="flex items-center justify-between w-full max-w-full ml-64">
          <h2 className="text-xl font-bold text-[#8B4513]">Store Manager</h2>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-80">
                <FaSearch className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products, sales..."
                  value={managerSearchTerm}
                  onChange={(e) => setManagerSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </form>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FaBell className="text-gray-600" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-[136px] bottom-0 overflow-y-auto">
          <div className="p-6">
            <nav className="space-y-2 mb-6">
              <NavLink href="/store-manager" icon={<FaHome size={20} />} currentPath={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/store-manager/products" icon={<FaBox size={20} />} currentPath={pathname}>
                My Products
              </NavLink>
              <NavLink href="/store-manager/sales" icon={<FaChartBar size={20} />} currentPath={pathname}>
                Sales
              </NavLink>
              <NavLink href="/store-manager/settings" icon={<FaCog size={20} />} currentPath={pathname}>
                Settings
              </NavLink>
            </nav>
            
            {/* User Info & Logout */}
            <div className="border-t pt-4">
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600">Store Manager</p>
                <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <FaSignOutAlt size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
