import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/guards';
import { findCouponByCode, hasUserUsedCoupon, markCouponUsed } from '@/lib/repositories/couponRepository';

// POST /api/coupons/use
// Body: { code: string }
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
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

    const alreadyUsed = await hasUserUsedCoupon(user.sub, coupon.id);
    if (alreadyUsed) {
      return NextResponse.json(
        { success: false, error: 'Coupon already used by this user' },
        { status: 409 },
      );
    }

    await markCouponUsed(user.sub, coupon.id, null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error using coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
