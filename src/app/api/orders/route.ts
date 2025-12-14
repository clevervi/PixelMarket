import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/guards';
import { createOrder, listOrdersForAdmin } from '@/lib/repositories/orderRepository';
import { findCouponByCode, markCouponUsed } from '@/lib/repositories/couponRepository';

// GET /api/orders - Admin: list orders (optionally filter by status)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const rows = await listOrdersForAdmin(status);

    const orders = rows.map((row) => ({
      id: row.order_number || row.id,
      customerName: row.customer_name ?? 'Unknown',
      email: row.email ?? 'N/A',
      total: Number(row.total),
      status: row.status,
      items: row.items_count,
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 },
    );
  }
}

// POST /api/orders - Create new order for authenticated user
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  try {
    const body = await request.json();

    const {
      items,
      subtotal,
      tax,
      shipping,
      total,
      discount = 0,
      couponCode,
      shippingAddress,
      notes,
    } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 },
      );
    }

    if (typeof subtotal !== 'number' || subtotal < 0 || typeof total !== 'number' || total < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid subtotal or total' },
        { status: 400 },
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 },
      );
    }

    const address = {
      fullName: shippingAddress.fullName,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
    };

    if (!address.fullName || !address.street || !address.city || !address.state || !address.country || !address.phone) {
      return NextResponse.json(
        { success: false, error: 'Incomplete shipping address' },
        { status: 400 },
      );
    }

    const orderItems = items.map((item: any) => {
      const product = item.product;
      const variant = item.variant;

      if (!product || !product.id || !item.quantity || !item.price) {
        throw new Error('Invalid order item payload');
      }

      return {
        productId: product.id,
        variantId: variant?.id ?? null,
        productName: product.name,
        productSku: undefined,
        quantity: item.quantity,
        unitPrice: item.price,
      };
    });

    let couponId: string | null = null;
    if (couponCode) {
      const coupon = await findCouponByCode(couponCode);
      if (!coupon || !coupon.is_active) {
        return NextResponse.json(
          { success: false, error: 'Coupon not found or inactive' },
          { status: 400 },
        );
      }
      couponId = coupon.id;
    }

    const created = await createOrder({
      userId: user.sub,
      subtotal,
      tax: typeof tax === 'number' ? tax : 0,
      shippingCost: typeof shipping === 'number' ? shipping : 0,
      discountAmount: typeof discount === 'number' ? discount : 0,
      total,
      couponId,
      notes: typeof notes === 'string' ? notes : undefined,
      address,
      items: orderItems,
    });

    // Best-effort: registrar uso del cupón vinculado a este pedido
    if (couponId) {
      try {
        await markCouponUsed(user.sub, couponId, created.id);
      } catch (err) {
        console.error('Failed to mark coupon as used for order', created.id, err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: created,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 },
    );
  }
}
