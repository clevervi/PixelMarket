import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabaseClient';

// Envía el email de recuperación usando Supabase Auth.
// La UX no debe revelar si el email existe o no.
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // Supabase redirect: usamos el origin actual (local o Vercel) para que el link funcione.
    const redirectTo = `${request.nextUrl.origin}/reset-password`;

    // NOTA: esto puede responder success incluso si el email no existe.
    const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo,
    });

    if (error) {
      // No revelamos detalles al usuario final
      console.error('Supabase resetPasswordForEmail error:', error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with that email, you will receive a reset link',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
