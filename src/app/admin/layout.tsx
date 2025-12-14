'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaStore, FaBox, FaShoppingCart, FaUsers, FaCog, FaSearch, FaBell } from 'react-icons/fa';
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminSearchTerm, setAdminSearchTerm } = useSearchStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="fixed top-[120px] left-0 right-0 bg-white border-b border-gray-200 z-40 h-16 flex items-center px-6 shadow-sm">
        <div className="flex items-center justify-between w-full max-w-full ml-64">
          <h2 className="text-xl font-bold text-[#8B4513]">Admin Panel</h2>
          
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-80">
                <FaSearch className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products, orders, users..."
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
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
        <aside className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-[136px] bottom-0">
          <div className="p-6">
            <nav className="space-y-2">
              <NavLink href="/admin" icon={<FaHome size={20} />} currentPath={pathname}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/vendors" icon={<FaStore size={20} />} currentPath={pathname}>
                Vendors
              </NavLink>
              <NavLink href="/admin/products" icon={<FaBox size={20} />} currentPath={pathname}>
                Products
              </NavLink>
              <NavLink href="/admin/orders" icon={<FaShoppingCart size={20} />} currentPath={pathname}>
                Orders
              </NavLink>
              <NavLink href="/admin/users" icon={<FaUsers size={20} />} currentPath={pathname}>
                Users
              </NavLink>
              <NavLink href="/admin/settings" icon={<FaCog size={20} />} currentPath={pathname}>
                Settings
              </NavLink>
            </nav>
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
