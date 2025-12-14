import { sqlOne, sql } from '../db';

export interface CouponRow {
  id: string;
  code: string;
  is_active: boolean;
  type: 'percentage' | 'fixed_amount' | string;
  discount_value: string; // numeric
  min_purchase_amount: string | null;
  max_discount_amount: string | null;
  usage_limit: number | null;
  usage_count: number | null;
  usage_limit_per_user: number | null;
  starts_at: string;
  expires_at: string;
}

export async function findCouponByCode(code: string): Promise<CouponRow | null> {
  return sqlOne<CouponRow>(
    `SELECT 
       id,
       code,
       is_active,
       type::text as type,
       discount_value::text as discount_value,
       min_purchase_amount::text as min_purchase_amount,
       max_discount_amount::text as max_discount_amount,
       usage_limit,
       usage_count,
       usage_limit_per_user,
       starts_at::text as starts_at,
       expires_at::text as expires_at
     FROM cupones
     WHERE UPPER(code) = UPPER($1)
    `,
    [code],
  );
}

export async function hasUserUsedCoupon(userId: string, couponId: string): Promise<boolean> {
  const row = await sqlOne<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM cupones_usuarios
       WHERE usuario_id = $1 AND cupon_id = $2
     ) as exists`,
    [userId, couponId],
  );
  return !!row?.exists;
}

export async function markCouponUsed(userId: string, couponId: string, orderId?: string | null): Promise<void> {
  await sql(
    `INSERT INTO cupones_usuarios (cupon_id, usuario_id, pedido_id)
     VALUES ($1, $2, $3)`,
    [couponId, userId, orderId ?? null],
  );

  // Incrementar contador global de uso del cupón
  await sql(
    `UPDATE cupones
     SET usage_count = COALESCE(usage_count, 0) + 1
     WHERE id = $1`,
    [couponId],
  );
}
