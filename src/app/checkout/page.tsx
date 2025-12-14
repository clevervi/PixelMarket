'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCouponStore } from '@/store/couponStore';
import { getCurrentUser } from '@/lib/auth-storage';
import { PaymentMethodType, Order, OrderItem } from '@/types';
import { FiCreditCard, FiDollarSign, FiTruck } from 'react-icons/fi';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import { toast } from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { appliedCoupon, calculateDiscount, removeCoupon } = useCouponStore();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('You must be logged in to checkout');
      router.push('/login?redirect=/checkout');
      return;
    }
    setUser(currentUser);
    setIsLoading(false);
  }, [router]);
  
  const [formData, setFormData] = useState({
    fullName: user?.addresses?.[0]?.fullName || '',
    email: user?.email || '',
    phone: user?.addresses?.[0]?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'Colombia',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [transferData] = useState({
    bankName: '',
    accountNumber: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const discount = calculateDiscount(subtotal);
  const subtotalAfterDiscount = subtotal - discount;
  const shipping = 15000;
  const tax = subtotalAfterDiscount * 0.19;
  const total = subtotalAfterDiscount + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de pago (gateway externo, etc.)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Preparar items para la orden
    const orderItems: OrderItem[] = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      variant: item.variant,
      price: item.product.price + (item.variant?.priceModifier || 0),
    }));

    // Crear orden en el backend (PostgreSQL)
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems,
        subtotal: subtotalAfterDiscount,
        tax,
        shipping,
        total,
        discount,
        couponCode: appliedCoupon?.code,
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      console.error('Order creation error:', data);
      setIsProcessing(false);
      toast.error(data?.error || 'Failed to create order');
      return;
    }

    const created = data.data as { id: string; orderNumber: string; createdAt: string; total: number };

    const order: Order = {
      id: created.orderNumber || created.id,
      userId: user?.id || 'guest',
      items: orderItems,
      subtotal: subtotalAfterDiscount,
      tax,
      shipping,
      total,
      discount,
      couponCode: appliedCoupon?.code,
      status: 'pending',
      shippingAddress: {
        id: '1',
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      paymentMethod: {
        id: '1',
        type: paymentMethod,
        ...(paymentMethod === 'card' && {
          cardLastFour: cardData.number.slice(-4),
          cardBrand: 'Visa',
        }),
        ...(paymentMethod === 'transfer' && {
          bankName: transferData.bankName,
          accountNumber: transferData.accountNumber,
        }),
      },
      createdAt: created.createdAt,
      updatedAt: created.createdAt,
    };

    // Generar factura PDF (usando los datos locales)
    generateInvoicePDF(order);

    // Limpiar carrito y cupón
    clearCart();
    removeCoupon();

    setIsProcessing(false);
    toast.success('Order placed successfully!');

    // Redirigir a página de confirmación
    router.push(`/order-confirmed?orderId=${order.id}`);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    // Mostrar estado vacío en la página de checkout en lugar de redirigir a una ruta inexistente
    return (
      <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="max-w-2xl w-full text-center p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{t.cart.empty}</h1>
            <p className="text-gray-600 mb-6">No products in your cart. Add some before proceeding to checkout.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/shop')}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                View products
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Return to homepage
              </button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.checkout.title}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de envío */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiTruck /> {t.checkout.shippingInfo}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.phone} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.address} *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.city} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.state} *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.checkout.postalCode}
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiDollarSign /> {t.checkout.paymentMethod}
                </h2>

                <div className="space-y-4">
                  {/* Opciones de pago */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                        className="mr-2"
                      />
                      <FiCreditCard className="inline mr-2" /> {t.payment.creditCard}
                    </label>

                    <label
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                        className="mr-2"
                      />
                      {t.payment.paypal}
                    </label>

                    <label
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                        className="mr-2"
                      />
                      {t.payment.bankTransfer}
                    </label>

                    <label
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'cash_on_delivery'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
                        className="mr-2"
                      />
                      {t.payment.cashOnDelivery}
                    </label>
                  </div>

                  {/* Formulario de tarjeta */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          required
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card*
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiration Date *
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            placeholder="MM/YY"
                            required
                            maxLength={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="123"
                            required
                            maxLength={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Información de transferencia */}
                  {paymentMethod === 'transfer' && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Make your transfer to the following account and send the receipt to our email address.
                      </p>
                      <div className="bg-white p-4 rounded border">
                        <p><strong>Bank:</strong> Bancolombia</p>
                        <p><strong>Account:</strong> 1234567890</p>
                        <p><strong>Type:</strong>  savings</p>
                        <p><strong>Holder:</strong>  ancestral heartbeat</p>
                      </div>
                    </div>
                  )}

                  {/* Información contra entrega */}
                  {paymentMethod === 'cash_on_delivery' && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        You will pay in cash when you receive your order. The driver will accept cash or card.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.checkout.orderSummary}</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t.cart.subtotal}</span>
                    <span>${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  {discount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-${discount.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal after discount</span>
                        <span>${subtotalAfterDiscount.toLocaleString('es-CO')}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>{t.cart.shipping}</span>
                    <span>${shipping.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t.cart.tax} (19%)</span>
                    <span>${tax.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>{t.cart.total}</span>
                      <span>${total.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : t.checkout.placeOrder}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
