import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth';
import { createSupabaseServiceClient } from '@/lib/supabaseClient';
import { findUserByIdForAuth } from '@/lib/repositories/userRepository';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // Verificar credenciales contra Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const authUser = signInData.user;
    const userId = authUser.id as string;

    // Buscar el perfil en nuestra tabla usuarios usando el mismo UUID
    const user = await findUserByIdForAuth(userId);

    if (!user) {
      return NextResponse.json(
        { message: 'User profile not found' },
        { status: 404 },
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { message: 'Account inactive' },
        { status: 403 },
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      },
      message: 'Login successful',
    });

    // Seguimos emitiendo el auth_token propio para compatibilidad con guards actuales
    setAuthCookie(response, {
      sub: user.id,
      email: user.email,
      role: user.role,
      vendorId: user.vendor_id,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
