import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrVendor } from '@/lib/guards';
import { listOrdersForVendor } from '@/lib/repositories/orderRepository';

// GET /api/vendor/orders
// Admin: must provide ?vendorId=...
// Vendor: vendorId is derived from auth token
export async function GET(req: NextRequest) {
  const auth = await requireAdminOrVendor(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;
  const searchParams = req.nextUrl.searchParams;

  let vendorId: string | null = null;
  if (user.role === 'admin') {
    vendorId = searchParams.get('vendorId');
    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: 'vendorId is required for admin' },
        { status: 400 },
      );
    }
  } else {
    // vendor role
    if (!user.vendorId) {
      return NextResponse.json(
        { success: false, error: 'Vendor has no associated store' },
        { status: 400 },
      );
    }
    vendorId = user.vendorId;
  }

  try {
    const rows = await listOrdersForVendor(vendorId!);

    const data = rows.map((row) => ({
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
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Failed to fetch vendor orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendor orders' },
      { status: 500 },
    );
  }
}
