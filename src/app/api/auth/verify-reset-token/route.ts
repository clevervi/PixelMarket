import { NextResponse } from 'next/server';

// Legacy endpoint. See the comment in /api/auth/reset-password.
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint is deprecated. Use Supabase recovery flow.',
    },
    { status: 410 },
  );
}
