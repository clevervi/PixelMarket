import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guards';
import { listVendors, createVendor } from '@/lib/repositories/vendorRepository';

// GET /api/vendors - list all vendors (admin only)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const vendors = await listVendors();
    return NextResponse.json({ success: true, data: vendors });
  } catch (error) {
    console.error('Error listing vendors:', error);
    return NextResponse.json({ success: false, error: 'Failed to load vendors' }, { status: 500 });
  }
}

// POST /api/vendors - create vendor (admin only)
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { businessName, slug, description, logo, banner, ownerId, contactEmail, contactPhone, commissionRate } = body;

    if (!businessName || !slug || !contactEmail) {
      return NextResponse.json(
        { success: false, error: 'businessName, slug and contactEmail are required' },
        { status: 400 },
      );
    }

    const vendor = await createVendor({
      businessName,
      slug,
      description,
      logo,
      banner,
      ownerId,
      contactEmail,
      contactPhone,
      commissionRate,
    });

    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ success: false, error: 'Failed to create vendor' }, { status: 500 });
  }
}
