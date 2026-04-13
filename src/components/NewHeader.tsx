'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Search, 
  ShoppingCart, 
  Cpu, 
  Activity,
  User,
  Menu,
  X
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCartSidebar } from '@/contexts/CartSidebarContext';
import { getCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sysTime, setSysTime] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  useTranslation();

  const { getItemCount } = useCartStore();
  const { openCart } = useCartSidebar();

  const cartItemsCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      const now = new Date();
      setSysTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    const user = getCurrentUser();
    setCurrentUser(user);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 py-4 lg:px-8 
      ${isScrolled ? 'pt-4' : 'pt-6'}`}
    >
      {/* Top Status Ticker (Mini) */}
      <div className="container mx-auto max-w-7xl mb-2">
        <div className="flex justify-between items-center text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_oklch(62.6%_0.19_253)]" />
              <span>NEXUS-LIVE: 1,204 NODES</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Activity size={10} className="text-cyan-500/50" />
              <span>THROUGHPUT: 98.4%</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 font-mono">
              <Terminal size={10} />
              <span>TIME: {sysTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Glass Bridge */}
      <div 
        className={`container mx-auto max-w-7xl transition-all duration-500 rounded-2xl 
        ${isScrolled 
          ? 'glass-nexus py-3 px-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] scale-[0.98]' 
          : 'bg-transparent py-4 px-4'}`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group relative z-50">
            <div className={`p-2 rounded-xl transition-all duration-500 
              ${isScrolled ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-slate-900 text-cyan-400 border border-white/5'}`}>
              <Cpu size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className={`font-nexus text-xl font-black tracking-tighter uppercase italic transition-colors 
                ${isScrolled ? 'text-white' : 'text-white'}`}>
                Pixel<span className="text-cyan-500">Nexus</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase -mt-1 group-hover:text-cyan-400/50 transition-colors">
                Market Infrastructure
              </span>
            </div>
          </Link>

          {/* Navigation - Cyber Desktop */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { name: 'Console', href: '/' },
              { name: 'Data Shop', href: '/shop' },
              { name: 'Ecosystems', href: '/collections' },
              { name: 'Essence', href: '/essence' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all relative group"
              >
                {link.name}
                <motion.span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-500 rounded-full group-hover:w-4 transition-all duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button className="p-3 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all group">
              <Search size={18} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={openCart}
              className="relative p-3 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all group"
            >
              <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/40"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Identity Node */}
            <div className="h-6 w-[1px] bg-slate-800 mx-2 hidden md:block" />
            
            <Link 
              href={currentUser ? "/dashboard" : "/login"}
              className={`hidden md:flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-all 
              ${isScrolled 
                ? 'border-white/10 hover:border-cyan-500/30 bg-white/5' 
                : 'border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5'}`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-cyan-500">
                <User size={14} />
              </div>
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-[9px] font-black text-white uppercase tracking-wider">
                  {currentUser ? 'Node Active' : 'Initialize'}
                </span>
                <span className="text-[8px] font-bold text-slate-500 truncate max-w-[80px]">
                  {currentUser ? currentUser.firstName : 'Entity 0x0'}
                </span>
              </div>
            </Link>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-slate-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Terminal Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-[100%] left-4 right-4 mt-2 p-6 glass-nexus rounded-3xl border border-white/10 shadow-2xl z-50"
          >
            <div className="flex flex-col gap-6">
              {['Console', 'Data Shop', 'Ecosystems', 'Essence'].map((link, i) => (
                <Link 
                  key={link} 
                  href="/" 
                  className="text-2xl font-black text-white italic uppercase font-nexus tracking-tighter"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-cyan-500 mr-4 font-mono text-sm not-italic opacity-40">0{i+1}</span>
                  {link}
                </Link>
              ))}
              <div className="h-[1px] bg-white/5 my-2" />
              <Link href="/dashboard" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Operations Control</span>
                <Terminal size={16} className="text-cyan-500" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
