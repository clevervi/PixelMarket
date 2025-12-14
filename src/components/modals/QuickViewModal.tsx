'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuickView } from '@/contexts/QuickViewContext';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useNotificationStore } from '@/store/notificationStore';
import { FiX, FiHeart, FiShoppingCart, FiZoomIn, FiMinus, FiPlus } from 'react-icons/fi';

export default function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickView();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addNotification } = useNotificationStore();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeQuickView();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeQuickView]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} (x${quantity})`
    });
    closeQuickView();
  };

  const handleToggleWishlist = () => {
    toggleItem(product.id);
    addNotification({
      type: inWishlist ? 'info' : 'success',
      title: inWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      message: product.name
    });
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  // Mock multiple images (in real app, product would have gallery)
  const images = [product.image, product.image, product.image];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 animate-fade-in">
      {/* Modal Content */}
      <div 
        className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-dark-brown rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-dark-brown-2 transition-colors"
          aria-label="Close modal"
        >
          <FiX className="w-6 h-6 text-dark dark:text-dark-text" />
        </button>

        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
          {/* Left Side - Images */}
          <div className="lg:w-1/2">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-brown group">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Zoom Icon */}
                <Link
                  href={`/products/${product.id}`}
                  className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-dark-brown/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="View full details"
                >
                  <FiZoomIn className="w-5 h-5 text-primary" />
                </Link>

                {/* Badges */}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary scale-105'
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Category */}
            <span className="inline-block w-fit px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4 capitalize">
              {product.category}
            </span>

            {/* Title */}
            <h2 className="text-3xl lg:text-4xl font-bold text-dark dark:text-dark-text mb-4">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-yellow-500">
                  {'⭐'.repeat(Math.round(product.rating))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating.toFixed(1)} ({product.reviewsCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">{formattedPrice}</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Color */}
            {product.color && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Color:
                </span>
                <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-dark-brown rounded-lg text-sm font-medium">
                  {product.color}
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                Quantity:
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-brown transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-4 rounded-lg font-bold hover:bg-secondary transition-colors shadow-lg"
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button
                onClick={handleToggleWishlist}
                className={`p-4 rounded-lg border-2 transition-all ${
                  inWishlist
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
                aria-label="Toggle wishlist"
              >
                <FiHeart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* View Full Details Link */}
            <Link
              href={`/products/${product.id}`}
              className="text-center text-primary font-semibold hover:text-secondary transition-colors underline"
              onClick={closeQuickView}
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
