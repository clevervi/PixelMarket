"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useQuickView } from "@/contexts/QuickViewContext";
import { useCartSidebar } from "@/contexts/CartSidebarContext";
import ProductBadges from "./ProductBadges";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { ReactNode } from "react";
import { useTranslation } from '@/hooks/useTranslation';

interface ProductCardProps {
  product: Product;
  showBadges?: boolean;
  stock?: number;
  isNew?: boolean;
  discount?: number;
}

interface TooltipProps {
  children: ReactNode;
  text: string;
  isActive: boolean;
}

const Tooltip = ({ children, text, isActive }: TooltipProps) => {
  return (
    <div className="relative group">
      {children}
      <div className={`
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs whitespace-nowrap rounded-md
        transition-opacity duration-200 pointer-events-none z-40
        ${isActive ? 'opacity-100' : 'opacity-0'}
      `}>
        {text}
      </div>
    </div>
  );
};

export default function ProductCard({ 
  product, 
  showBadges = true, 
  stock = 100, 
  isNew = false, 
  discount 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const router = useRouter();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();
  const { openQuickView } = useQuickView();
  const { openCart } = useCartSidebar();
  const { t } = useTranslation();
  
  const inWishlist = isInWishlist(product.id);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleItem(product.id);
    addNotification({
      type: inWishlist ? 'info' : 'success',
      title: inWishlist ? 'Removed from favorites' : 'Added to favorites',
      message: product.name
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    addNotification({
      type: 'success',
      title: 'Added to cart',
      message: product.name
    });
    openCart();
  };

  return (
    <div 
      className="card group relative overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Product image */}
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(`/products/${product.id}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            router.push(`/products/${product.id}`);
          }
        }}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        className="relative h-48 sm:h-56 md:h-64 bg-gray-200 cursor-pointer flex-shrink-0 w-full overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Badges */}
        {showBadges && (
          <ProductBadges 
            product={product} 
            stock={stock} 
            isNew={isNew} 
            discount={discount} 
          />
        )}

        {/* Overlay with quick actions - covers image only */}
        <div className={`
          absolute inset-0 top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm 
          flex items-center justify-center gap-2 sm:gap-3
          transition-opacity duration-300 z-10
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <Tooltip text={t.common.addToCart} isActive={activeTooltip === 'cart'}>
            <button
              onClick={(e) => { e.stopPropagation(); handleQuickAdd(e); }}
              onMouseEnter={() => setActiveTooltip('cart')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="p-2 sm:p-3 bg-white text-black rounded-full hover:bg-[#8B4513] hover:text-white transition-colors shadow-lg"
              aria-label={t.common.addToCart}
            >
              <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Tooltip>
          
          <Tooltip text="Quick view" isActive={activeTooltip === 'quickview'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openQuickView(product);
              }}
              onMouseEnter={() => setActiveTooltip('quickview')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="p-2 sm:p-3 bg-white text-black rounded-full hover:bg-[#8B4513] hover:text-white transition-colors shadow-lg"
              aria-label="Quick view"
            >
              <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Tooltip>
          
          <Tooltip text={t.common.viewDetails} isActive={activeTooltip === 'details'}>
            <Link
              href={`/products/${product.id}`}
              onMouseEnter={() => setActiveTooltip('details')}
              onMouseLeave={() => setActiveTooltip(null)}
              className="p-2 sm:p-3 bg-white text-black rounded-full hover:bg-[#8B4513] hover:text-white transition-colors shadow-lg"
              aria-label={t.common.viewDetails}
            >
              <span className="text-lg font-bold">ⓘ</span>
            </Link>
          </Tooltip>
        </div>
      </div>

      {/* Wishlist button (always visible) */}
      <button
        onClick={handleWishlistToggle}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        className={`
          absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 rounded-full transition-all shadow-lg
          ${inWishlist 
            ? 'bg-red-500 text-white scale-110' 
            : isImageHovered 
              ? 'bg-[#8B4513] text-white' 
              : 'bg-white/90 backdrop-blur-sm text-black hover:bg-[#8B4513] hover:text-white'
          }
        `}
        title={inWishlist ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={inWishlist ? 'Remove from favorites' : 'Add to favorites'}
      >
        <FiHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Product information */}
      <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow bg-white">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-black hover:underline transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2 text-xs sm:text-sm">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <div className="flex text-yellow-500 text-xs sm:text-sm">
              {'⭐'.repeat(Math.round(product.rating))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewsCount || 0})
            </span>
          </div>
        )}

        {/* Price and category */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary">{formattedPrice}</span>
            {discount && (
              <div className="text-xs sm:text-sm text-gray-500 line-through">
                ${Math.round(product.price / (1 - discount / 100)).toLocaleString('es-CO')}
              </div>
            )}
          </div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
            {product.category}
          </span>
        </div>

        {/* View details button */}
        <Link
          href={`/products/${product.id}`}
          className="text-xs sm:text-sm w-full text-center block mt-auto py-2 px-3 sm:px-4 rounded font-semibold transition-colors bg-primary text-white hover:bg-primary-dark"
        >
          {t.common.viewDetails}
        </Link>
      </div>
    </div>
  );
}
