'use client';

import { useUserStore } from '@/store/userStore';
import Link from 'next/link';
import { FiPackage, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';

export default function PedidosPage() {
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Sent',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4"
          >
            <FiArrowLeft /> Back to Profile
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">Your complete purchase history</p>
        </div>

        {(!user.orders || user.orders.length === 0) ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              You have no orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Explore our crafts and make your first purchase
            </p>
            <Link
              href="/collections"
              className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              View Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {user.orders?.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <button
                      onClick={() => generateInvoicePDF(order)}
                      className="p-2 text-amber-600 hover:text-amber-700"
                      title="Descargar factura"
                    >
                      <FiDownload size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.product.name}
                        </h4>
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            {item.variant.color && `Color: ${item.variant.color}`}
                            {item.variant.size && `, Talla: ${item.variant.size}`}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          ${(item.price * item.quantity).toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ${order.subtotal.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      ${order.shipping.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA:</span>
                    <span className="font-medium">
                      ${order.tax.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-amber-600">
                      ${order.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <strong>Shipping Address:</strong>{' '}
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </p>
                </div>
              </div>
            )) || []}
          </div>
        )}
      </div>
    </div>
  );
}
