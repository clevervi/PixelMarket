import { NextRequest, NextResponse } from 'next/server';
import { findProductById, softDeleteProduct } from '@/lib/repositories/productRepository';
import { requireAdmin } from '@/lib/guards';

// GET /api/products/[id] - Get single product by ID
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const product = await findProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - Soft delete product (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  try {
    await softDeleteProduct(id);
    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
