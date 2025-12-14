import { create } from 'zustand';

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed_amount' | string;
  value: number; // percentage (e.g. 10) or fixed amount value
  minPurchase: number;
  maxDiscountAmount: number | null;
}

interface CouponStore {
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  validateCoupon: (
    code: string,
    cartTotal: number,
  ) => Promise<{ valid: boolean; message?: string; coupon?: Coupon }>;
  calculateDiscount: (cartTotal: number) => number;
}

export const useCouponStore = create<CouponStore>((set, get) => ({
  appliedCoupon: null,
  
  applyCoupon: (coupon) => {
    set({ appliedCoupon: coupon });
  },
  
  removeCoupon: () => {
    set({ appliedCoupon: null });
  },
  
  validateCoupon: async (code, cartTotal) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount: cartTotal }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return {
          valid: false,
          message: data?.error || 'Invalid coupon code',
        };
      }

      const c = data.data as {
        code: string;
        type: string;
        value: number;
        minPurchase?: number;
        maxDiscountAmount?: number | null;
      };
      const coupon: Coupon = {
        code: c.code,
        type: c.type,
        value: c.value,
        minPurchase: c.minPurchase ?? 0,
        maxDiscountAmount: c.maxDiscountAmount ?? null,
      };

      return { valid: true, coupon };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Error validating coupon' };
    }
  },
  
  calculateDiscount: (cartTotal) => {
    const { appliedCoupon } = get();
    if (!appliedCoupon) return 0;
    if (cartTotal <= 0) return 0;

    // Respect minimum purchase on the client as well
    if (appliedCoupon.minPurchase && cartTotal < appliedCoupon.minPurchase) {
      return 0;
    }

    let discount = 0;
    if (appliedCoupon.type === 'percentage') {
      discount = cartTotal * (appliedCoupon.value / 100);
      if (appliedCoupon.maxDiscountAmount !== null) {
        discount = Math.min(discount, appliedCoupon.maxDiscountAmount);
      }
    } else if (appliedCoupon.type === 'fixed_amount') {
      discount = appliedCoupon.value;
    }

    if (discount < 0) discount = 0;
    if (discount > cartTotal) discount = cartTotal;

    return discount;
  },
}));
