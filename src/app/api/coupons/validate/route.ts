import { NextRequest, NextResponse } from 'next/server';
import { findCouponByCode, hasUserUsedCoupon } from '@/lib/repositories/couponRepository';
import { getAuthUser } from '@/lib/auth';

// POST /api/coupons/validate
// Body: { code: string, amount: number }
export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 },
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Cart amount must be a positive number' },
        { status: 400 },
      );
    }

    const coupon = await findCouponByCode(code);
    if (!coupon || !coupon.is_active) {
      return NextResponse.json(
        { success: false, error: 'Coupon not found or inactive' },
        { status: 404 },
      );
    }

    const now = new Date();
    const startsAt = new Date(coupon.starts_at);
    const expiresAt = new Date(coupon.expires_at);

    if (now < startsAt || now > expiresAt) {
      return NextResponse.json(
        { success: false, error: 'Coupon expired or not yet valid' },
        { status: 400 },
      );
    }

    // Global usage limit
    if (
      coupon.usage_limit !== null &&
      coupon.usage_count !== null &&
      coupon.usage_count >= coupon.usage_limit
    ) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 },
      );
    }

    const user = getAuthUser(req);
    if (user && coupon.usage_limit_per_user && coupon.usage_limit_per_user <= 1) {
      const alreadyUsed = await hasUserUsedCoupon(user.sub, coupon.id);
      if (alreadyUsed) {
        return NextResponse.json(
          { success: false, error: 'Coupon already used by this user' },
          { status: 409 },
        );
      }
    }

    const minPurchase = coupon.min_purchase_amount ? parseFloat(coupon.min_purchase_amount) : 0;
    if (minPurchase > 0 && amount < minPurchase) {
      return NextResponse.json(
        {
          success: false,
          error: 'Minimum purchase amount not met',
          minPurchase,
        },
        { status: 400 },
      );
    }

    const discountValue = parseFloat(coupon.discount_value);
    const maxDiscountAmount = coupon.max_discount_amount
      ? parseFloat(coupon.max_discount_amount)
      : null;
    let discount = 0;

    if (coupon.type === 'percentage') {
      discount = amount * (discountValue / 100);
      if (maxDiscountAmount !== null) {
        discount = Math.min(discount, maxDiscountAmount);
      }
    } else if (coupon.type === 'fixed_amount') {
      discount = discountValue;
    }

    if (discount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Coupon does not apply to this amount' },
        { status: 400 },
      );
    }

    if (discount > amount) {
      discount = amount;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: discountValue,
        minPurchase,
        maxDiscountAmount,
        discount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
