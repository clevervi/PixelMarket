import { NextResponse } from 'next/server';
import { pool } from '../../../../../database/db';

export async function GET() {
  try {
    // Fetch statistics from the database
    const vendorsResult = await pool.query('SELECT COUNT(*) FROM vendors WHERE status = $1', ['active']);
    const productsResult = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = true');
    const ordersResult = await pool.query('SELECT COUNT(*) FROM orders');
    const usersResult = await pool.query('SELECT COUNT(*) FROM users WHERE is_active = true');

    return NextResponse.json({
      vendors: parseInt(vendorsResult.rows[0].count),
      products: parseInt(productsResult.rows[0].count),
      orders: parseInt(ordersResult.rows[0].count),
      users: parseInt(usersResult.rows[0].count),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
