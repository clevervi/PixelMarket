import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/guards';
import {
  listWishlistByUser,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '@/lib/repositories/wishlistRepository';

// GET /api/wishlist - list current user's wishlist
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const items = await listWishlistByUser(auth.user.sub);

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 },
    );
  }
}

// POST /api/wishlist - add a product to wishlist
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { productId } = await req.json();
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 },
      );
    }

    const item = await addToWishlist(auth.user.sub, productId);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 },
    );
  }
}

// DELETE /api/wishlist - remove a product from wishlist
export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 },
      );
    }

    await removeFromWishlist(auth.user.sub, productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 },
    );
  }
}

// PUT /api/wishlist - clear all wishlist items for current user
export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  try {
    await clearWishlist(auth.user.sub);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear wishlist' },
      { status: 500 },
    );
  }
}
