'use client';

import Link from 'next/link';
import LogoPixelMarket from './LogoPixelMarket';
import type { Product } from '@/types';
import { products } from '@/data/products';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { useCartSidebar } from '@/contexts/CartSidebarContext';
import { getCurrentUser } from '@/lib/auth-storage';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewHeader() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalResults, setModalResults] = useState<Product[]>([]);
  const modalRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { t } = useTranslation();

  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, logout } = useUserStore();
  const { openCart } = useCartSidebar();

  const cartItemsCount = getItemCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Update user state when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', handleRouteChange);
    
    // Check user on mount and when component updates
    const interval = setInterval(() => {
      const user = getCurrentUser();
      if (user !== currentUser) {
        setCurrentUser(user);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleRouteChange);
      clearInterval(interval);
    };
  }, [currentUser]);

  return (
    <header className={`fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-2xl shadow-primary/5' : 'border-b border-slate-100'}`}>
      {/* Header: tech top bar (tagline) and white bar with title */}
      <div className="w-full flex flex-col" style={{ position: 'relative', zIndex: 100 }}>
        <div
          className="bg-slate-950 text-white h-10 text-[11px] font-black uppercase tracking-[0.2em] flex items-center relative overflow-hidden"
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
        >
          {/* Animated background line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <span className="ml-18 opacity-80">{t.home.heroTagline}</span>

          {/* Logo on the left */}
          <div
            className="absolute z-50"
            style={{
              top: "10px",
              left: "16px"
            }}
          >
            <LogoPixelMarket size={70} />
          </div>

          {/* Actions on the right */}
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <div className="flex items-center gap-6 whitespace-nowrap font-black">
              <Link href="/wishlist" className="flex items-center text-white/70 hover:text-white transition-colors relative">
                <FaHeart size={12} className="mr-2 text-accent" />
                <span>{t.common.wishlist}</span>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
              </Link>
              {currentUser ? (
                <Link href="/dashboard" className="text-white/70 hover:text-primary transition-colors">
                  <span>{t.common.dashboard}</span>
                </Link>
              ) : (
                <Link href="/login" className="text-white/70 hover:text-primary transition-colors">
                  <span>{t.common.login}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center bg-transparent h-20 relative px-4">
          {/* Left: brand/logo/title */}
          <div className="flex items-center z-10">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl ml-18 md:text-3xl font-black text-slate-900 tracking-tighter transition-all group-hover:tracking-normal">
                Pixel<span className="text-primary">Market</span>
              </h1>
            </Link>
          </div>
          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            {[
              { name: t.nav.home, href: '/' },
              { name: t.nav.shop, href: '/shop' },
              { name: t.nav.collections, href: '/collections' },
              { name: t.nav.essence, href: '/essence' },
              { name: t.nav.contact, href: '/contact' }
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-slate-500 hover:text-primary transition-all font-bold text-sm uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
          {/* Right Actions */}
          <div className="flex items-center gap-6 ml-auto pr-4 z-10">
            {/* Search Icon */}
            <button
              className="hidden md:flex text-slate-400 hover:text-primary transition-colors p-2 rounded-xl hover:bg-slate-50"
              onClick={() => setShowSearchModal(true)}
              aria-label="Open search modal"
            >
              <FaSearch size={18} />
            </button>
            {/* Cart */}
            <button onClick={openCart} className="relative text-slate-900 hover:text-primary transition-all p-2 rounded-xl hover:bg-slate-50">
              <FaShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse shadow-lg shadow-primary/20">
                  {cartItemsCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-900 p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-4 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''} rounded-full`} />
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''} rounded-full`} />
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''} rounded-full`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xl" onClick={() => setShowSearchModal(false)} />
          <div ref={modalRef} className="bg-white rounded-[32px] shadow-2xl p-10 w-full max-w-2xl relative z-10 border border-white/20 transform animate-in fade-in zoom-in duration-300">
            <button
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full"
              onClick={() => { setShowSearchModal(false); setModalSearchTerm(""); setModalResults([]); }}
              aria-label="Close"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{t.common.search}</h2>
              <p className="text-slate-500 font-medium lowercase">Search through our digital inventory</p>
            </div>

            <div className="relative mb-8">
              <input
                type="text"
                autoFocus
                value={modalSearchTerm}
                onChange={e => {
                  setModalSearchTerm(e.target.value);
                  const term = e.target.value.trim().toLowerCase();
                  if (!term) { setModalResults([]); return; }
                  const results = products.filter((p: Product) =>
                    p.name.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term) ||
                    p.category_id.toLowerCase().includes(term)
                  );
                  setModalResults(results);
                }}
                placeholder="Core module, UI kit, hardware..."
                className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-slate-900 placeholder-slate-400"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary">
                 <FaSearch size={22} className="opacity-40" />
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {modalResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {modalResults.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/products/${product.id}`} 
                      className="group flex items-center p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all"
                      onClick={() => setShowSearchModal(false)}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{product.category_id}</div>
                      </div>
                      <div className="text-slate-300">
                        <svg className="w-6 h-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : modalSearchTerm ? (
                <div className="text-center py-10">
                   <div className="text-slate-300 mb-2 font-black text-5xl">404</div>
                   <div className="text-slate-500 font-bold tracking-tight">System could not locate requested module.</div>
                </div>
              ) : (
                <div className="text-center py-10 opacity-30 italic font-medium text-slate-400 italic">
                  Start typing to initialize search protocol...
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-white transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <nav className="container mx-auto px-8 py-32 flex flex-col space-y-8">
          {[
            { name: t.nav.home, href: '/' },
            { name: t.nav.shop, href: '/shop' },
            { name: t.nav.collections, href: '/collections' },
            { name: t.nav.essence, href: '/essence' },
            { name: t.nav.contact, href: '/contact' }
          ].map((link, idx) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-4xl font-black text-slate-900 tracking-tighter hover:text-primary transition-all flex items-center gap-4 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
              style={{ transitionDelay: `${idx * 50}ms` }}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-slate-200 text-lg">0{idx + 1}</span>
              {link.name}
            </Link>
          ))}
          
          <div className="pt-12 border-t border-slate-100 space-y-6">
            <Link 
              href="/wishlist" 
              className="text-xl font-bold text-slate-600 hover:text-primary transition-colors flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.common.wishlist}
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-lg">{wishlistCount}</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block text-xl font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>{t.common.profile}</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left text-xl font-bold text-red-500">{t.common.logout}</button>
              </>
            ) : (
              <Link href="/login" className="block text-xl font-bold text-primary" onClick={() => setIsMenuOpen(false)}>{t.common.login}</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
