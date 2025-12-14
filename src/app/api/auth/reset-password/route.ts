import { NextRequest, NextResponse } from 'next/server';

// Este endpoint era parte de un flujo legacy basado en tokens en memoria.
// El flujo actual usa Supabase Auth recovery:
// - POST /api/auth/forgot-password envía el email
// - /reset-password (página) intercambia `code` por sesión y actualiza la contraseña
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint is deprecated. Use Supabase recovery flow.',
    },
    { status: 410 },
  );
}
