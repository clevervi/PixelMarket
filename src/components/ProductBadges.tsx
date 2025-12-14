"use client";

import { Product } from '@/types';
import { FiStar, FiTag, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

interface ProductBadgesProps {
  product: Product;
  stock?: number;
  isNew?: boolean;
  discount?: number;
}

export default function ProductBadges({ 
  product, 
  stock = 100, 
  isNew = false, 
  discount 
}: ProductBadgesProps) {
  return (
    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
      {/* Badges izquierdos */}
      <div className="flex flex-col gap-2">
        {/* Badge de Nuevo */}
        {isNew && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiStar className="w-3 h-3" />
            New
          </span>
        )}

        {/* Badge de Destacado */}
        {product.featured && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiStar className="w-3 h-3" />
            Featured
          </span>
        )}

        {/* Badge de Descuento */}
        {discount && discount > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiTag className="w-3 h-3" />
            -{discount}%
          </span>
        )}
      </div>

      {/* Badges derechos - Stock */}
      <div className="flex flex-col gap-2">
        {stock === 0 ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-xs font-bold rounded-full shadow-lg">
            <FiAlertCircle className="w-3 h-3" />
            OUT OF STOCK
          </span>
        ) : stock < 5 ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiAlertCircle className="w-3 h-3" />
            LAST UNITS!
          </span>
        ) : stock < 10 ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiAlertCircle className="w-3 h-3" />
            FEW UNITS
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
            <FiCheckCircle className="w-3 h-3" />
            IN STOCK
          </span>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar stock inline en la página de producto
export function StockIndicator({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Product out of stock</p>
          <p className="text-sm text-red-700">We will notify you when it becomes available</p>
        </div>
      </div>
    );
  }

  if (stock < 5) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <FiAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-yellow-900">Only {stock} units left!</p>
          <p className="text-sm text-yellow-700">Buy now before it runs out</p>
        </div>
      </div>
    );
  }

  if (stock < 10) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg">
        <FiAlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-orange-900">Few units available</p>
          <p className="text-sm text-orange-700">{stock} units in stock</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
      <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <div>
        <p className="font-semibold text-green-900">Available</p>
        <p className="text-sm text-green-700">In stock and ready to ship</p>
      </div>
    </div>
  );
}
