'use client';

import { useState } from 'react';
import { useCouponStore } from '@/store/couponStore';
import { FiTag, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface DiscountCodeProps {
  cartTotal: number;
}

export default function DiscountCode({ cartTotal }: DiscountCodeProps) {
  const { appliedCoupon, applyCoupon, removeCoupon, validateCoupon, calculateDiscount } = useCouponStore();
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { t } = useTranslation();

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplying(true);

    const validation = await validateCoupon(code, cartTotal);

    if (!validation.valid || !validation.coupon) {
      toast.error(validation.message || 'Invalid coupon code');
      setIsApplying(false);
      return;
    }

    applyCoupon(validation.coupon);
    toast.success('Coupon applied successfully!');
    setCode('');
    setIsApplying(false);
  };

  const handleRemove = () => {
    removeCoupon();
    toast.success('Coupon removed');
  };

  const discount = calculateDiscount(cartTotal);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-dark dark:text-dark-text">
          Discount Code
        </h3>
      </div>

      {appliedCoupon ? (
        <div className="space-y-3">
          {/* Applied Coupon Display */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">
                  {appliedCoupon.code}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  {appliedCoupon.type === 'percentage' 
                    ? `${appliedCoupon.value}% off` 
                    : `$${appliedCoupon.value.toLocaleString('es-CO')} off`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-full transition-colors"
              aria-label="Remove coupon"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Discount Amount */}
          <div className="flex items-center justify-between text-green-600 dark:text-green-400 font-semibold">
            <span>Discount Applied:</span>
            <span>-${discount.toLocaleString('es-CO')}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Coupon Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-brown text-dark dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={handleApply}
              disabled={isApplying || !code.trim()}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all ${
                isApplying || !code.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg'
              }`}
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>

          {/* Available Coupons Hint (example) */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium mb-1">Example coupon:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>BIENVENIDA10 - Welcome discount (configured in database)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
