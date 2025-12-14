'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';

interface ProductListViewProps {
  product: Product;
}

export default function ProductListView({ product }: ProductListViewProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();
  
  const inWishlist = isInWishlist(product.id);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product.id);
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
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <Link href={`/products/${product.id}`} className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0 bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 256px"
          />
          
          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={`
              absolute top-3 right-3 z-20 p-2 rounded-full transition-all shadow-lg
              ${inWishlist 
                ? 'bg-red-500 text-white scale-110' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
              }
            `}
            title={inWishlist ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </Link>

        {/* Content Section */}
        <div className="flex-grow p-6 flex flex-col justify-between">
          <div>
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-3 capitalize">
              {product.category}
            </span>

            {/* Product Name */}
            <Link href={`/products/${product.id}`}>
              <h3 className="text-2xl font-bold mb-2 text-dark dark:text-dark-text hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating.toFixed(1)} ({product.reviewsCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Product Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.color && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-brown text-gray-600 dark:text-gray-400 rounded">
                  Color: {product.color}
                </span>
              )}
              <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 rounded">
                In Stock
              </span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors shadow-md font-semibold"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-brown border border-gray-300 dark:border-gray-700 text-dark dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-dark-brown-2 transition-colors font-semibold"
              >
                <FiEye className="w-5 h-5" />
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
