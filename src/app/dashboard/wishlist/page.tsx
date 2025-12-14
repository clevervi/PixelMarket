'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { products } from '@/data/products';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { items: wishlistItems, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  // Obtener los productos completos del wishlist
  const wishlistProducts = wishlistItems.map(itemId => {
    const product = products.find(p => p.id === itemId);
    return product;
  }).filter((p): p is typeof products[0] => p !== undefined);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeItem(productId);
    toast.success('Removed from wishlist');
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={t.common.wishlist} 
        breadcrumbs={[
          { label: t.common.dashboard, href: '/dashboard' },
          { label: t.common.wishlist }
        ]} 
      />

      <div className="p-6">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <button 
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-dark-surface rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-dark dark:text-dark-text mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    <span className="text-sm text-green-600">In Stock</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Start adding products you love!
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
