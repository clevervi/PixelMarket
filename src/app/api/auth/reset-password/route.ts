import { NextResponse } from 'next/server';

// This endpoint was part of a legacy in-memory token flow.
// The current flow uses Supabase Auth recovery:
// - POST /api/auth/forgot-password sends the email
// - /reset-password (page) exchanges `code` for a session and updates the password
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'This endpoint is deprecated. Use Supabase recovery flow.',
    },
    { status: 410 },
  );
}
