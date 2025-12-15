import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabaseClient';

// Sends the recovery email using Supabase Auth.
// The UX must not reveal whether the email exists or not.
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

    // Supabase redirect: use the current origin (local or Vercel) so the link works.
    const redirectTo = `${request.nextUrl.origin}/reset-password`;

    // NOTE: this may respond with success even if the email does not exist.
    const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo,
    });

    if (error) {
      // Do not reveal details to the end user
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
