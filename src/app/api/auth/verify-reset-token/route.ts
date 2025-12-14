import { NextRequest, NextResponse } from 'next/server';
import { getResetTokenData } from '@/lib/auth-storage';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    // Buscar token
    const tokenData = getResetTokenData(token);

    if (!tokenData) {
      return NextResponse.json(
        { success: false, message: 'Token is invalid or has expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, email: tokenData.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
