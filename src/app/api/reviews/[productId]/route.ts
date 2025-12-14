import { NextRequest, NextResponse } from 'next/server';
import { getReviewsByProductId, createReview } from '../../../../../database/data';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const reviews = getReviewsByProductId(productId);

    return NextResponse.json({
      reviews,
      count: reviews.length,
      averageRating: reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const { userId, userName, rating, title, comment } = await request.json();

    if (!userId || !userName || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = createReview({
      productId,
      userId,
      userName,
      rating,
      title,
      comment,
      verifiedPurchase: false,
      helpful: 0
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
