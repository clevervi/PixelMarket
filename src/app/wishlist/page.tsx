'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { products } from '@/data/products';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from '@/hooks/useTranslation';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { t } = useTranslation();

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {t.common.wishlist} - empty
          </h1>
          <p className="text-gray-600 mb-8">
            Save your favorite products to buy them later
          </p>
          <Link
            href="/shop"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <FiHeart className="text-4xl text-red-500" />
          <h1 className="text-4xl font-bold text-gray-800">{t.common.wishlist}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link href={`/products/${product.id}`} className="block relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 hover:text-amber-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-amber-600">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  {product.color && (
                    <span className="text-sm text-gray-500">{product.color}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                  >
                    <FiShoppingCart /> {t.common.addToCart}
                  </button>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Eliminar de la lista"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'product' : 'products'} in your list
          </p>
          <Link
            href="/collections"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Continue Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
