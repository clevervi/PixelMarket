import { NextRequest, NextResponse } from 'next/server';

// Endpoint legacy. Ver comentario en /api/auth/reset-password.
export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint is deprecated. Use Supabase recovery flow.',
    },
    { status: 410 },
  );
}
