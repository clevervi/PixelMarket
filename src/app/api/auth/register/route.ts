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

    // Comprobar si ya existe en nuestra tabla de usuarios (por compatibilidad)
    const existing = await findUserByEmailForAuth(email);
    if (existing) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 },
      );
    }

    const supabase = createSupabaseServiceClient();

    // Creamos también un hash local de la contraseña para cumplir con el NOT NULL
    // de la columna password_hash en la tabla usuarios. La verificación real la hace
    // Supabase Auth, pero mantenemos este campo por compatibilidad.
    const passwordHash = await hashPassword(password);

    // Crear el usuario en Supabase Auth (email/password)
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError || !signUpData.user) {
      // Si el proveedor indica que el email ya existe, devolvemos 409 de forma clara.
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

    // Insertar fila correspondiente en nuestra tabla usuarios usando el mismo UUID
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

    // Leer el usuario recién creado con el helper para mantener el mismo shape/tipos
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

    // Seguimos emitiendo el auth_token propio para compatibilidad con guards actuales
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
