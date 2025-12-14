import { NextRequest, NextResponse } from 'next/server';
import { createResetToken, getUserByEmail } from '@/lib/auth-storage';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe (en almacenamiento simulado)
    const userExists = !!getUserByEmail(email);

    if (!userExists) {
      // Responder igual para no revelar si el email existe
      return NextResponse.json(
        { success: true, message: 'If an account exists with that email, you will receive a reset link' },
        { status: 200 }
      );
    }

    // Generar token único
    const resetToken = createResetToken(email);

    console.log(`✓ Password reset requested for: ${email}`);
    console.log(`✓ Reset token: ${resetToken}`);
    console.log(`✓ Reset link: http://localhost:3000/reset-password/${resetToken}`);

    // En producción: enviar email con el reset link
    // const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;
    // await sendResetEmail(email, resetLink);

    return NextResponse.json(
      { success: true, message: 'If an account exists with that email, you will receive a reset link' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
