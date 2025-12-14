'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Package, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderItemRow {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  createdAt: string;
  items: OrderItemRow[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
  } | null;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const orderId = params.id as string;
  const {} = useTranslation();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    // Cargar detalles reales del pedido
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) return;
        const mapped: OrderDetails = {
          id: data.id,
          status: data.status,
          total: Number(data.total ?? 0),
          subtotal: Number(data.subtotal ?? 0),
          shipping: Number(data.shipping ?? 0),
          tax: Number(data.tax ?? 0),
          createdAt: data.createdAt ?? data.created_at,
          items: (data.items || []).map((it: any) => ({
            id: it.id,
            name: it.name ?? it.product_name,
            quantity: it.quantity,
            price: Number(it.unitPrice ?? it.unit_price ?? it.price ?? 0),
            image: undefined,
          })),
          shippingAddress: data.shippingAddress
            ? {
                fullName: data.shippingAddress.fullName,
                street: data.shippingAddress.street,
                city: data.shippingAddress.city,
                postalCode: data.shippingAddress.postalCode,
                country: data.shippingAddress.country,
              }
            : null,
        };
        setOrder(mapped);
      })
      .catch((err) => {
        console.error('Failed to load order details', err);
      });
  }, [router, orderId]);

  if (!user || !order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'shipped': return <Truck className="w-6 h-6 text-blue-600" />;
      case 'processing': return <Package className="w-6 h-6 text-yellow-600" />;
      default: return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title={`Order ${order.id}`} 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'My Orders', href: '/dashboard/my-orders' },
          { label: order.id }
        ]} 
      />

      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-dark-text">Order Items</h2>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <img
                      src={item.image || '/assets/assets11/sombrero-vueltiao.webp'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-dark dark:text-dark-text">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-dark dark:text-dark-text">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold text-dark dark:text-dark-text">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold text-dark dark:text-dark-text">
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-semibold text-dark dark:text-dark-text">${order.tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="font-bold text-dark dark:text-dark-text">Total</span>
                    <span className="font-bold text-primary text-lg">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {order.shippingAddress && (
                  <>
                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}</p>
                    <p>{order.shippingAddress.country}</p>
                  </>
                )}
              </div>
            </div>

            {/* Order Date */}
            <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-4">Order Date</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
