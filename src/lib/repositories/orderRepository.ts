import { pool } from '../db';

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string | null;
  productName: string;
  productSku?: string | null;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderAddressInput {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CreateOrderInput {
  userId: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  couponId?: string | null;
  notes?: string;
  address: CreateOrderAddressInput;
  items: CreateOrderItemInput[];
}

export interface CreatedOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
}

export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: string;
  total: string;
  created_at: string;
  customer_name: string | null;
  email: string | null;
  items_count: number;
}

export type VendorOrderRow = AdminOrderRow;

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrderSummary> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const addressRes = await client.query<{ id: string }>(
      `INSERT INTO direcciones (
         usuario_id,
         full_name,
         street,
         city,
         state,
         postal_code,
         country,
         phone,
         is_default,
         tipo
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8,
         false,
         'envio'
       )
       RETURNING id`,
      [
        input.userId,
        input.address.fullName,
        input.address.street,
        input.address.city,
        input.address.state,
        input.address.postalCode,
        input.address.country,
        input.address.phone,
      ],
    );

    const direccionId = addressRes.rows[0].id;

    const orderRes = await client.query<{
      id: string;
      order_number: string;
      created_at: string;
    }>(
      `INSERT INTO pedidos (
         usuario_id,
         status,
         subtotal,
         tax,
         shipping_cost,
         discount_amount,
         total,
         cupon_id,
         direccion_id,
         notes
       ) VALUES (
         $1, 'pending', $2, $3, $4, $5, $6, $7, $8, $9
       )
       RETURNING id, order_number, created_at`,
      [
        input.userId,
        input.subtotal,
        input.tax,
        input.shippingCost,
        input.discountAmount,
        input.total,
        input.couponId ?? null,
        direccionId,
        input.notes ?? null,
      ],
    );

    const order = orderRes.rows[0];

    for (const item of input.items) {
      const lineSubtotal = item.unitPrice * item.quantity;

      await client.query(
        `INSERT INTO detalle_pedido (
           pedido_id,
           producto_id,
           variante_id,
           product_name,
           product_sku,
           quantity,
           unit_price,
           subtotal
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8
         )`,
        [
          order.id,
          item.productId,
          item.variantId ?? null,
          item.productName,
          item.productSku ?? null,
          item.quantity,
          item.unitPrice,
          lineSubtotal,
        ],
      );
    }

    await client.query('COMMIT');

    return {
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      total: input.total,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listOrdersForAdmin(status?: string | null): Promise<AdminOrderRow[]> {
  const params: any[] = [];
  let whereClause = '';

  if (status) {
    params.push(status);
    whereClause = 'WHERE p.status = $1';
  }

  const result = await pool.query<AdminOrderRow>(
    `SELECT
       p.id,
       p.order_number,
       p.status::text as status,
       p.total::text as total,
       p.created_at::text as created_at,
       (u.first_name || ' ' || u.last_name) as customer_name,
       u.email,
       COUNT(d.id)::int as items_count
     FROM pedidos p
     LEFT JOIN usuarios u ON u.id = p.usuario_id
     LEFT JOIN detalle_pedido d ON d.pedido_id = p.id
     ${whereClause}
     GROUP BY p.id, u.first_name, u.last_name, u.email
     ORDER BY p.created_at DESC
    `,
    params,
  );

  return result.rows;
}

export async function listOrdersForVendor(vendorId: string): Promise<VendorOrderRow[]> {
  const result = await pool.query<VendorOrderRow>(
    `SELECT
       p.id,
       p.order_number,
       p.status::text as status,
       p.total::text as total,
       p.created_at::text as created_at,
       (u.first_name || ' ' || u.last_name) as customer_name,
       u.email,
       COUNT(DISTINCT d.id)::int as items_count
     FROM pedidos p
     JOIN detalle_pedido d ON d.pedido_id = p.id
     JOIN productos pr ON pr.id = d.producto_id
     LEFT JOIN usuarios u ON u.id = p.usuario_id
     WHERE pr.vendor_id = $1
     GROUP BY p.id, u.first_name, u.last_name, u.email
     ORDER BY p.created_at DESC
    `,
    [vendorId],
  );

  return result.rows;
}
