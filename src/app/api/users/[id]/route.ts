import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/guards';
import {
  findUserProfileById,
  listOrdersForUser,
  updateUserProfile,
} from '@/lib/repositories/userRepository';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const currentUser = auth.user;

    if (currentUser.role !== 'admin' && currentUser.sub !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await findUserProfileById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orders = await listOrdersForUser(id);

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at,
      orders: orders.map((o) => ({
        id: o.order_number || o.id,
        status: o.status,
        total: Number(o.total),
        createdAt: o.created_at,
      })),
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    const currentUser = auth.user;

    if (currentUser.role !== 'admin' && currentUser.sub !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updates = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
    };

    const updated = await updateUserProfile(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      firstName: updated.first_name,
      lastName: updated.last_name,
      phone: updated.phone,
      role: updated.role,
      createdAt: updated.created_at,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
