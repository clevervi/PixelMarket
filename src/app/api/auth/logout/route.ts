import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    // Limpiar el auth_token propio (la sesión de Supabase se cierra en el cliente)
    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
