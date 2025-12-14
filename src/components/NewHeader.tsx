'use client';

import Link from 'next/link';
import LogoAncestral from './LogoAncestral';
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { t } = useTranslation();

  const { items, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useUserStore();
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
    <header className={`fixed w-full top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* Header: barra marrón con Welcome y barra blanca con título */}
      <div className="w-full flex flex-col" style={{ position: 'relative', zIndex: 100 }}>
        <div
          className="bg-[#8B4513] text-white h-10 text-sm flex items-center relative"
          style={{ paddingLeft: '16px', paddingRight: '16px' }}
        >
          <span className="ml-18">{t.home.heroTagline}</span>

          {/* Logo a la izquierda */}
          <div
            className="absolute z-50"
            style={{
              top: "10px",
              left: "16px"
            }}
          >
            <LogoAncestral size={70} />
          </div>

          {/* Acciones a la derecha */}
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <Link href="/wishlist" className="flex items-center text-white hover:text-gray-200 text-sm font-medium relative">
                <FaHeart size={14} className="mr-2" />
                <span>{t.common.wishlist}</span>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
              </Link>
              {currentUser ? (
                <Link href="/dashboard" className="text-white hover:text-gray-200 text-sm font-medium">
                  <span>{t.common.dashboard}</span>
                </Link>
              ) : (
                <Link href="/login" className="text-white hover:text-gray-200 text-sm font-medium">
                  <span>{t.common.login}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center bg-white h-20 relative px-4">
          {/* Left: brand/logo/title */}
          <div className="flex items-center z-10">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl ml-18 md:text-3xl font-bold text-[#8B4513]">Ancestral Heartbeat</h1>
            </Link>
          </div>
          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">{t.nav.home}</Link>
            <Link href="/shop" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">{t.nav.shop}</Link>
            <Link href="/collections" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">{t.nav.collections}</Link>
            <Link href="/essence" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">{t.nav.essence}</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#8B4513] transition-colors font-medium">{t.nav.contact}</Link>
          </nav>
          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto pr-4 z-10">
            {/* Search Icon */}
            <button
              className="hidden md:flex text-gray-700 hover:text-[#8B4513] transition-colors"
              onClick={() => setShowSearchModal(true)}
              aria-label="Open search modal"
            >
              <FaSearch size={20} />
            </button>
            {/* Cart */}
            <button onClick={openCart} className="relative text-gray-700 hover:text-[#8B4513] transition-colors">
              <FaShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D2691E] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Search Modal */}
      {showSearchModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFE4B5] bg-opacity-80">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => { setShowSearchModal(false); setModalSearchTerm(""); setModalResults([]); }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">{t.common.search}</h2>
            <input
              type="text"
              value={modalSearchTerm}
              onChange={e => setModalSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors mb-4"
              onClick={() => {
                const term = modalSearchTerm.trim().toLowerCase();
                if (!term) { setModalResults([]); return; }
                const results = products.filter((p: Product) =>
                  p.name.toLowerCase().includes(term) ||
                  p.description.toLowerCase().includes(term) ||
                  p.category.toLowerCase().includes(term) ||
                  (p.tags && p.tags.some((tag: string) => tag.toLowerCase().includes(term)))
                );
                setModalResults(results);
              }}
            >{t.common.search}</button>
            <div>
              {modalResults.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {modalResults.map(product => (
                    <li key={product.id} className="py-3 flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </div>
                      <Link href={`/products/${product.id}`} className="text-primary font-bold hover:underline" onClick={() => setShowSearchModal(false)}>
                        {t.common.viewDetails}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : modalSearchTerm ? (
                <div className="text-center text-gray-500">No results found.</div>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}
      <div className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <nav className="container mx-auto px-4 py-4 space-y-3">
          <Link href="/" className="block py-2 text-gray-700 hover:text-[#8B4513] font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.home}</Link>
          <Link href="/shop" className="block py-2 text-gray-700 hover:text-[#8B4513] font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.shop}</Link>
          <Link href="/collections" className="block py-2 text-gray-700 hover:text-[#8B4513] font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.collections}</Link>
          <Link href="/essence" className="block py-2 text-gray-700 hover:text-[#8B4513] font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.essence}</Link>
          <Link href="/contact" className="block py-2 text-gray-700 hover:text-[#8B4513] font-medium" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</Link>
          <div className="border-t pt-3 mt-3">
            <Link href="/wishlist" className="block py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setIsMenuOpen(false)}>{t.common.wishlist} ({wishlistCount})</Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setIsMenuOpen(false)}>{t.common.profile}</Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-red-600">{t.common.logout}</button>
              </>
            ) : (
              <Link href="/profile" className="block py-2 text-gray-700 hover:text-[#8B4513]" onClick={() => setIsMenuOpen(false)}>{t.common.login}</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
