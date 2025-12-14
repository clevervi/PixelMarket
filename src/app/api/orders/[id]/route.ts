import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/guards';
import { pool } from '@/lib/db';

// GET /api/orders/[id] - Get a single order for its owner or admin
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const currentUser = auth.user;

  try {
    const orderRes = await pool.query<{
      id: string;
      order_number: string;
      usuario_id: string | null;
      status: string;
      subtotal: string;
      tax: string;
      shipping_cost: string;
      discount_amount: string;
      total: string;
      created_at: string;
      coupon_code: string | null;
      full_name: string | null;
      street: string | null;
      city: string | null;
      state: string | null;
      postal_code: string | null;
      country: string | null;
      phone: string | null;
    }>(
      `SELECT
         p.id,
         p.order_number,
         p.usuario_id,
         p.status::text as status,
         p.subtotal::text as subtotal,
         p.tax::text as tax,
         p.shipping_cost::text as shipping_cost,
         p.discount_amount::text as discount_amount,
         p.total::text as total,
         p.created_at::text as created_at,
         c.code as coupon_code,
         d.full_name,
         d.street,
         d.city,
         d.state,
         d.postal_code,
         d.country,
         d.phone
       FROM pedidos p
       LEFT JOIN cupones c ON c.id = p.cupon_id
       LEFT JOIN direcciones d ON d.id = p.direccion_id
       WHERE p.id = $1 OR p.order_number = $1
       LIMIT 1`,
      [id],
    );

    const order = orderRes.rows[0];

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let itemsRes;

    if (currentUser.role === 'vendor') {
      if (!currentUser.vendorId) {
        return NextResponse.json(
          { error: 'Vendor has no associated store' },
          { status: 400 },
        );
      }

      // Solo las líneas de este vendor
      itemsRes = await pool.query<{
        id: string;
        producto_id: string | null;
        variante_id: string | null;
        product_name: string;
        product_sku: string | null;
        quantity: number;
        unit_price: string;
        subtotal: string;
      }>(
        `SELECT
           d.id,
           d.producto_id,
           d.variante_id,
           d.product_name,
           d.product_sku,
           d.quantity,
           d.unit_price::text as unit_price,
           d.subtotal::text as subtotal
         FROM detalle_pedido d
         JOIN productos pr ON pr.id = d.producto_id
         WHERE d.pedido_id = $1 AND pr.vendor_id = $2
         ORDER BY d.created_at ASC`,
        [order.id, currentUser.vendorId],
      );

      if (itemsRes.rows.length === 0) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      // Admin o cliente: todas las líneas del pedido
      itemsRes = await pool.query<{
        id: string;
        producto_id: string | null;
        variante_id: string | null;
        product_name: string;
        product_sku: string | null;
        quantity: number;
        unit_price: string;
        subtotal: string;
      }>(
        `SELECT
           id,
           producto_id,
           variante_id,
           product_name,
           product_sku,
           quantity,
           unit_price::text as unit_price,
           subtotal::text as subtotal
         FROM detalle_pedido
         WHERE pedido_id = $1
         ORDER BY created_at ASC`,
        [order.id],
      );
    }

    // Autorización final: admin, dueño del pedido (cliente) o vendor con líneas propias
    const isAdmin = currentUser.role === 'admin';
    const isCustomerOwner =
      currentUser.role !== 'admin' && currentUser.role !== 'vendor' && order.usuario_id === currentUser.sub;
    const isVendorAllowed = currentUser.role === 'vendor' && itemsRes.rows.length > 0;

    if (!isAdmin && !isCustomerOwner && !isVendorAllowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      id: order.order_number || order.id,
      status: order.status,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping_cost),
      discount: Number(order.discount_amount),
      total: Number(order.total),
      couponCode: order.coupon_code,
      createdAt: order.created_at,
      shippingAddress: order.full_name
        ? {
            fullName: order.full_name,
            street: order.street,
            city: order.city,
            state: order.state,
            postalCode: order.postal_code,
            country: order.country,
            phone: order.phone,
          }
        : null,
      items: itemsRes.rows.map((item) => ({
        id: item.id,
        productId: item.producto_id,
        variantId: item.variante_id,
        name: item.product_name,
        sku: item.product_sku,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        subtotal: Number(item.subtotal),
      })),
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
