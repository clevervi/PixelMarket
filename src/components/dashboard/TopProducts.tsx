import Image from 'next/image';
import { TopProduct } from '@/store/dashboardStore';
import { TrendingUp, Package } from 'lucide-react';

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-1">Top Products</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Best performing items</p>
        </div>
        <TrendingUp className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-dark dark:text-dark-text truncate">{product.name}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span>{product.sales} sold</span>
                <span className="text-primary font-semibold">${product.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-medium ${product.stock < 30 ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
