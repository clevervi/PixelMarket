'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  TrendingUp,
  FileText,
  Heart,
  MessageSquare,
  Tag,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-storage';
import { toast } from 'react-hot-toast';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  roles?: string[]; // Roles que pueden ver este ítem
}

const navItems: NavItem[] = [
  // Admin, Vendor & Customer
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['admin', 'vendor', 'customer']
  },
  // Admin & Vendor
  { 
    name: 'Orders', 
    href: '/dashboard/orders', 
    icon: ShoppingBag, 
    badge: '12',
    roles: ['admin', 'vendor']
  },
  { 
    name: 'Products', 
    href: '/dashboard/products', 
    icon: Package,
    roles: ['admin', 'vendor']
  },
  // Admin only
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: Users,
    roles: ['admin']
  },
  // Admin & Vendor
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart3,
    roles: ['admin', 'vendor']
  },
  // Admin only
  { 
    name: 'Reviews', 
    href: '/dashboard/reviews', 
    icon: MessageSquare,
    roles: ['admin']
  },
  { 
    name: 'Promotions', 
    href: '/dashboard/promotions', 
    icon: Tag,
    roles: ['admin', 'vendor']
  },
  { 
    name: 'Reports', 
    href: '/dashboard/reports', 
    icon: FileText,
    roles: ['admin']
  },
  // All roles
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    roles: ['admin', 'vendor', 'customer']
  },
  // Customer only
  { 
    name: 'My Orders', 
    href: '/dashboard/my-orders', 
    icon: ShoppingBag,
    roles: ['customer']
  },
  { 
    name: 'Wishlist', 
    href: '/dashboard/wishlist', 
    icon: Heart,
    roles: ['customer']
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('customer');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Obtener el rol del usuario actual
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Redirigir al login si no hay usuario autenticado
      router.push('/login');
      return;
    }
    setUserRole(currentUser.role || 'customer');
  }, [router]);

  // Filtrar elementos del menú según el rol del usuario
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true; // Si no se especifican roles, se muestra a todos
    return item.roles.includes(userRole);
  });

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-dark-surface shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 
          transition-all duration-300 z-40
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          {isOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-dark dark:text-dark-text text-lg">Latido</h1>
                <p className="text-xs text-gray-500">Ancestral</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-176px)]">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-brown'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {isOpen && (
                  <>
                    <span className="flex-grow font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-0.5 text-xs rounded-full font-semibold
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary text-white'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Quick Stats (when expanded) */}
          {isOpen && (
            <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-dark dark:text-dark-text">Monthly Goal</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Sales</span>
                  <span className="font-semibold text-dark dark:text-dark-text">$45,231</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">75% of $60,000 goal</p>
              </div>
            </div>
          )}
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-surface">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="flex-grow font-medium text-left">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
