import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrVendor } from '@/lib/guards';
import { findVendorById, findVendorByOwnerId } from '@/lib/repositories/vendorRepository';
import { getAuthUser } from '@/lib/auth';

// GET /api/vendors/me - get vendor store for current admin/vendor
export async function GET(req: NextRequest) {
  const auth = await requireAdminOrVendor(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  try {
    // If token already carries vendorId, prefer that
    if (user.vendorId) {
      const vendor = await findVendorById(user.vendorId);
      if (!vendor) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: vendor });
    }

    // Otherwise, look up by owner_id
    const ownerId = user.sub;
    const vendor = await findVendorByOwnerId(ownerId);

    if (!vendor) {
      return NextResponse.json({ success: false, error: 'Vendor not found for this user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Error loading current vendor:', error);
    return NextResponse.json({ success: false, error: 'Failed to load vendor' }, { status: 500 });
  }
}
