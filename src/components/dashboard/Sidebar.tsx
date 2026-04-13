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
  LogOut,
  Terminal,
  Cpu,
  Zap,
  Shield,
  Layers
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
  roles?: string[]; // Roles allowed to see this item
}

const navItems: NavItem[] = [
  // Admin, Vendor & Customer
  { 
    name: 'Ops Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['admin', 'vendor', 'customer']
  },
  // Admin & Vendor
  { 
    name: 'Deployments', 
    href: '/dashboard/orders', 
    icon: ShoppingBag, 
    badge: '12',
    roles: ['admin', 'vendor']
  },
  { 
    name: 'Repository', 
    href: '/dashboard/products', 
    icon: Package,
    roles: ['admin', 'vendor']
  },
  // Admin only
  { 
    name: 'Architects', 
    href: '/dashboard/users', 
    icon: Users,
    roles: ['admin']
  },
  // Admin & Vendor
  { 
    name: 'Traffic Analysis', 
    href: '/dashboard/analytics', 
    icon: BarChart3,
    roles: ['admin', 'vendor']
  },
  // Admin only
  { 
    name: 'Peer Reviews', 
    href: '/dashboard/reviews', 
    icon: MessageSquare,
    roles: ['admin']
  },
  { 
    name: 'Market Scaling', 
    href: '/dashboard/promotions', 
    icon: Tag,
    roles: ['admin', 'vendor']
  },
  { 
    name: 'Audit Reports', 
    href: '/dashboard/reports', 
    icon: FileText,
    roles: ['admin']
  },
  // All roles
  { 
    name: 'System Config', 
    href: '/dashboard/settings', 
    icon: Settings,
    roles: ['admin', 'vendor', 'customer']
  },
  // Customer only
  { 
    name: 'My Assets', 
    href: '/dashboard/my-orders', 
    icon: ShoppingBag,
    roles: ['customer']
  },
  { 
    name: 'Watchlist', 
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
    // Get the current user's role
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUserRole(currentUser.role || 'customer');
  }, [router]);

  // Filter menu items based on the user's role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true; 
    return item.roles.includes(userRole);
  });

  const handleLogout = () => {
    logout();
    toast.success('Session terminated successfully');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 dark:text-slate-300"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 
          transition-all duration-500 ease-in-out z-40 shadow-2xl shadow-indigo-500/5
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/60">
          {isOpen && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div className="transition-all duration-300 opacity-100">
                <h1 className="font-black text-slate-900 dark:text-white text-lg leading-tight uppercase tracking-tighter">PixelMarket</h1>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em]">Nexus Ops</p>
              </div>
            </Link>
          )}
          {!isOpen && (
             <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Terminal className="w-6 h-6 text-white" />
             </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors z-50 text-slate-400"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-176px)] custom-scrollbar">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                {isOpen && (
                  <>
                    <span className="flex-grow font-semibold text-sm tracking-tight">{item.name}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-widest
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
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

          {/* System Performance (when expanded) */}
          {isOpen && (
            <div className="mt-8 mx-2 p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Zap className="w-12 h-12 text-indigo-600" />
               </div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-widest">Resource Load</h3>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-500 uppercase">Throughput</span>
                  <span className="text-indigo-600 dark:text-indigo-400">75%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 p-[1px]">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-1 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: '75%' }} />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">System operating at optimal capacity</p>
              </div>
            </div>
          )}
        </nav>

        {/* User Card & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 w-full text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
            {isOpen && <span className="flex-grow font-bold text-sm text-left tracking-tight">Terminate Session</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
