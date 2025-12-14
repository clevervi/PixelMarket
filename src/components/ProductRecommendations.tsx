'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { products } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import StarRating from './StarRating';
import { useReviewStore } from '@/store/reviewStore';
import type { Product } from '@/types';

interface ProductRecommendationsProps {
  currentProductId: string;
  currentCategory?: string;
  maxRecommendations?: number;
}

export default function ProductRecommendations({
  currentProductId,
  currentCategory,
  maxRecommendations = 4,
}: ProductRecommendationsProps) {
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { getAverageRating } = useReviewStore();

  // Algoritmo de recomendación
  const recommendations = useMemo(() => {
    const currentProduct = products.find(p => p.id === currentProductId);
    if (!currentProduct) return [];

    // Filtrar productos de la misma categoría
    const sameCategory = products.filter(
      p => p.id !== currentProductId && p.category === currentCategory
    );

    // Productos con colores similares (si aplica)
    const similarColor = products.filter(
      p => p.id !== currentProductId && 
           p.category !== currentCategory &&
           p.color === currentProduct.color
    );

    // Productos en rango de precio similar (±30%)
    const priceRange = currentProduct.price * 0.3;
    const similarPrice = products.filter(
      p => p.id !== currentProductId &&
           Math.abs(p.price - currentProduct.price) <= priceRange
    );

    // Combinar y priorizar
    const combined = [
      ...sameCategory.slice(0, 2),      // 2 de la misma categoría
      ...similarColor.slice(0, 1),      // 1 de color similar
      ...similarPrice.slice(0, 1),      // 1 de precio similar
    ];

    // Eliminar duplicados
    const unique = combined.filter(
      (product, index, self) => self.findIndex(p => p.id === product.id) === index
    );

    // Si no hay suficientes, agregar productos aleatorios
    if (unique.length < maxRecommendations) {
      const remaining = products
        .filter(p => p.id !== currentProductId && !unique.find(u => u.id === p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, maxRecommendations - unique.length);
      unique.push(...remaining);
    }

    return unique.slice(0, maxRecommendations);
  }, [currentProductId, currentCategory, maxRecommendations]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center md:text-left text-dark dark:text-dark-text">
        ✨ You may also like...
      </h2>
      
      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recommended products at this time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              rating={getAverageRating(product.id)}
              onAddToCart={() => addItem(product, 1)}
              onToggleWishlist={() => toggleItem(product.id)}
              isInWishlist={isInWishlist(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  rating,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: {
  product: Product;
  rating: number;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isInWishlist: boolean;
}) {
  return (
    <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-brown">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              ⭐ Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3 flex-grow flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-sm md:text-base text-dark dark:text-dark-text hover:text-amber-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {rating > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={rating} size={16} />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-lg md:text-xl font-bold text-amber-600 dark:text-amber-500 block mb-3">
            ${product.price.toLocaleString('es-CO')}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onAddToCart}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:shadow-lg"
            >
              <FaShoppingCart className="text-sm" />
              <span>Add</span>
            </button>
            <button
              onClick={onToggleWishlist}
              className={`p-2 border-2 rounded-lg transition-all duration-200 font-semibold ${
                isInWishlist
                  ? 'bg-amber-50 border-amber-600 text-amber-600 dark:bg-amber-900/30'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-amber-600 hover:text-amber-600'
              }`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FaHeart className={isInWishlist ? 'text-amber-600' : ''} size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
