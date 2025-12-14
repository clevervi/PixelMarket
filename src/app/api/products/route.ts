import { NextRequest, NextResponse } from 'next/server';
import { listActiveProducts, listProductsByVendor, createProduct } from '@/lib/repositories/productRepository';
import { requireAdminOrVendor } from '@/lib/guards';

// GET /api/products - List products (public). Optional vendorId filter.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get('vendorId');

    if (vendorId) {
      const products = await listProductsByVendor(vendorId);
      return NextResponse.json({ success: true, count: products.length, data: products });
    }

    const products = await listActiveProducts();
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

// POST /api/products - Create product (admin or vendor)
export async function POST(request: NextRequest) {
  const auth = await requireAdminOrVendor(request);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  try {
    const body = await request.json();
    const { name, slug, description, shortDescription, price, stock, featured, vendorId, categoryId } = body;

    if (!name || !slug || !description || typeof price !== 'number') {
      return NextResponse.json(
        { success: false, error: 'name, slug, description and numeric price are required' },
        { status: 400 },
      );
    }

    // Admin puede crear para cualquier vendor; vendor solo para el suyo
    let effectiveVendorId: string | null = null;
    if (user.role === 'vendor') {
      effectiveVendorId = user.vendorId ?? null;
    } else if (user.role === 'admin') {
      effectiveVendorId = vendorId ?? null;
    }

    const product = await createProduct({
      name,
      slug,
      description,
      shortDescription,
      price,
      stock,
      featured,
      vendorId: effectiveVendorId,
      categoryId,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
