import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { findUserByIdForAuth } from '@/lib/repositories/userRepository';

export async function GET(request: NextRequest) {
  try {
    const tokenUser = getAuthUser(request);

    if (!tokenUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await findUserByIdForAuth(tokenUser.sub);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        isActive: user.is_active,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
