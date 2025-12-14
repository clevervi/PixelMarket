'use client';

import { useCartStore } from '@/store/cartStore';
import { useCouponStore } from '@/store/couponStore';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import DiscountCode from '@/components/cart/DiscountCode';
import { useTranslation } from '@/hooks/useTranslation';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, clearCart, discountCode, discountAmount } = useCartStore();
  const { calculateDiscount } = useCouponStore();
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20">
        <div className="max-w-2xl mx-auto text-center px-4">
          <FiShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t.cart.empty}</h1>
          <p className="text-gray-600 mb-8">
            {/* Simple static subtitle; could be moved to translations if desired */}
            Explore our crafts and find something special
          </p>
          <Link
            href="/collections"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {t.home.ourCollections}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const couponDiscount = calculateDiscount(subtotal);
  const cartDiscount = (subtotal * discountAmount / 100);
  const totalDiscount = couponDiscount + cartDiscount;
  const shipping = 15000;
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const tax = subtotalAfterDiscount * 0.19;
  const finalTotal = subtotalAfterDiscount + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.product.price + (item.variant?.priceModifier || 0);
              const itemTotal = itemPrice * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.variant?.id || 'default'}`}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      ${itemPrice.toLocaleString('es-CO')}
                    </p>
                    
                    {item.variant && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.variant.color && <p>{t.product.color}: {item.variant.color}</p>}
                        {item.variant.size && <p>{t.product.size}: {item.variant.size}</p>}
                        {item.variant.material && <p>{t.product.material}: {item.variant.material}</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1),
                              item.variant?.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.variant?.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">
                      ${itemTotal.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              {t.cart.removeItem}
            </button>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1 space-y-4">
            {/* Discount Code */}
            <DiscountCode cartTotal={subtotal} />
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.checkout.orderSummary}</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t.cart.subtotal}</span>
                  <span>${subtotal.toLocaleString('es-CO')}</span>
                </div>
                {discountCode && cartDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>{`Discount (${discountCode} ${discountAmount}%)`}</span>
                    <span>-${cartDiscount.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon</span>
                    <span>-${couponDiscount.toLocaleString('es-CO')}</span>
                  </div>
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
                    <span>${finalTotal.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-amber-600 text-white text-center px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium mb-3"
              >
                {t.cart.proceedToCheckout}
              </Link>

              <Link
                href="/shop"
                className="block w-full bg-gray-200 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
