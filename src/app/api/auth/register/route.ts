import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie, hashPassword } from '@/lib/auth';
import { createSupabaseServiceClient } from '@/lib/supabaseClient';
import { findUserByEmailForAuth, findUserByIdForAuth } from '@/lib/repositories/userRepository';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Email, password, first name and last name are required' },
        { status: 400 },
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    // Check if it already exists in our users table (for compatibility)
    const existing = await findUserByEmailForAuth(email);
    if (existing) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // We also create a local password hash to satisfy the NOT NULL constraint
    // of the password_hash column in the usuarios table. Real verification is done by
    // Supabase Auth, but we keep this field for compatibility.
    const passwordHash = await hashPassword(password);

    // Create the user in Supabase Auth (email/password)
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError || !signUpData.user) {
      // If the provider indicates the email already exists, return a clear 409.
      const code = (signUpError as any)?.code;
      const status = (signUpError as any)?.status;

      if (code === 'email_exists' || status === 422) {
        return NextResponse.json(
          { message: 'This email is already registered. Please sign in instead.' },
          { status: 409 },
        );
      }

      console.error('Supabase signUp error:', signUpError);
      return NextResponse.json(
        { message: 'Failed to create account in auth provider' },
        { status: 500 },
      );
    }

    const authUser = signUpData.user;
    const userId = authUser.id as string;

    // Insert the corresponding row in our usuarios table using the same UUID
    const insertResult = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone: phone ?? null,
        role: 'customer',
        is_active: true,
        status: 'active',
        email_verified: true,
      })
      .select('*')
      .single();

    if (insertResult.error) {
      console.error('Error inserting user row:', insertResult.error);
      return NextResponse.json(
        { message: 'Failed to create user profile' },
        { status: 500 },
      );
    }

    // Read the newly created user with the helper to keep the same shape/types
    const user = await findUserByIdForAuth(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User profile not found after creation' },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      message: 'Account created successfully',
    }, { status: 201 });

    // We still issue our own auth_token for compatibility with existing guards
    setAuthCookie(response, {
      sub: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendor_id,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
