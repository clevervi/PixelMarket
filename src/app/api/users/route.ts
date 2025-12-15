import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guards';
import { createSupabaseServiceClient } from '@/lib/supabaseClient';
import { hashPassword } from '@/lib/auth';

// GET /api/users - list users (admin-only)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, first_name, last_name, phone, role, is_active, vendor_id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET /api/users supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 },
      );
    }

    const users = (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      phone: u.phone ?? null,
      role: u.role,
      isActive: u.is_active,
      vendorId: u.vendor_id ?? null,
      createdAt: u.created_at,
    }));

    return NextResponse.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

// POST /api/users - create a user (admin-only)
// Creates a Supabase Auth user and a matching profile row in `public.usuarios` with the same UUID.
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'customer',
      vendorId = null,
    } = body || {};

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'email, password, firstName and lastName are required' },
        { status: 400 },
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // 1) Create in Supabase Auth
    const { data: createdAuth, error: createAuthError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createAuthError || !createdAuth.user) {
      console.error('POST /api/users createUser error:', createAuthError);
      return NextResponse.json(
        { success: false, error: 'Failed to create auth user' },
        { status: 500 },
      );
    }

    const userId = createdAuth.user.id;

    // 2) Insert into usuarios table
    const passwordHash = await hashPassword(password);

    const { data: inserted, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone: phone ?? null,
        role,
        is_active: true,
        status: 'active',
        email_verified: true,
        vendor_id: vendorId,
      })
      .select('id, email, first_name, last_name, phone, role, is_active, vendor_id, created_at')
      .single();

    if (insertError || !inserted) {
      console.error('POST /api/users insert profile error:', insertError);

      // Best-effort: revert the auth user if the profile insert failed
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (revertErr) {
        console.error('Failed to revert auth user after insert error:', revertErr);
      }

      return NextResponse.json(
        { success: false, error: 'Failed to create user profile' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: inserted.id,
          email: inserted.email,
          firstName: inserted.first_name,
          lastName: inserted.last_name,
          phone: inserted.phone ?? null,
          role: inserted.role,
          isActive: inserted.is_active,
          vendorId: inserted.vendor_id ?? null,
          createdAt: inserted.created_at,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
