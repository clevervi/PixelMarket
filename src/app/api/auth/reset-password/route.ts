import { NextRequest, NextResponse } from 'next/server';
import { getResetTokenData, deleteResetToken, updateUserPassword } from '@/lib/auth-storage';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Buscar token
    const tokenData = getResetTokenData(token);

    if (!tokenData) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Actualizar contraseña
    const success = updateUserPassword(tokenData.email, password);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Eliminar token usado
    deleteResetToken(token);

    console.log(`✓ Password reset successful for: ${tokenData.email}`);

    return NextResponse.json(
      { success: true, message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
