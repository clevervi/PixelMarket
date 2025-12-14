import { sql, sqlOne } from '../db';
import type { AuthRole } from '../auth';
import { createSupabaseServiceClient } from '../supabaseClient';

export interface AuthUserRow {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: AuthRole;
  is_active: boolean;
  vendor_id: string | null;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserProfileRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: AuthRole;
  created_at: string;
}

export interface UserOrderSummaryRow {
  id: string;
  order_number: string;
  status: string;
  total: string;
  created_at: string;
}

// === Nuevos helpers pensados para Supabase Auth ===
// En lugar de usar conexión directa a PostgreSQL, estas funciones utilizan
// el cliente de Supabase (HTTP), lo que funciona incluso en el plan gratuito.

// findUserByIdForAuth: obtiene el usuario por su UUID (igual a auth.users.id)
export async function findUserByIdForAuth(id: string): Promise<AuthUserRow | null> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('usuarios')
    .select(
      'id, email, password_hash, first_name, last_name, role, is_active, vendor_id',
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('findUserByIdForAuth error (supabase):', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    password_hash: data.password_hash,
    first_name: data.first_name,
    last_name: data.last_name,
    role: (data.role as AuthRole) || 'customer',
    is_active: data.is_active,
    vendor_id: data.vendor_id ?? null,
  };
}

// findUserByEmailForAuth: busca primero por email usando Supabase HTTP
export async function findUserByEmailForAuth(email: string): Promise<AuthUserRow | null> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('usuarios')
    .select(
      'id, email, password_hash, first_name, last_name, role, is_active, vendor_id',
    )
    .ilike('email', email.trim())
    .maybeSingle();

  if (error) {
    console.error('findUserByEmailForAuth error (supabase):', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    password_hash: data.password_hash,
    first_name: data.first_name,
    last_name: data.last_name,
    role: (data.role as AuthRole) || 'customer',
    is_active: data.is_active,
    vendor_id: data.vendor_id ?? null,
  };
}

export async function createUserForAuth(input: CreateUserInput): Promise<AuthUserRow> {
  const row = await sqlOne<AuthUserRow>(
    `INSERT INTO usuarios (
       email,
       password_hash,
       first_name,
       last_name,
       phone,
       role,
       is_active,
       status,
       email_verified
     ) VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       'customer',
       true,
       'active',
       false
     )
     RETURNING 
       id,
       email,
       password_hash,
       first_name,
       last_name,
       role::text as role,
       is_active,
       vendor_id
    `,
    [
      input.email,
      input.passwordHash,
      input.firstName,
      input.lastName,
      input.phone || null,
    ],
  );

  if (!row) {
    throw new Error('Failed to create user');
  }

  return row;
}

export async function findUserProfileById(id: string): Promise<UserProfileRow | null> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, first_name, last_name, phone, role, created_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('findUserProfileById error (supabase):', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id as string,
    email: data.email as string,
    first_name: data.first_name as string,
    last_name: data.last_name as string,
    phone: (data.phone as string | null) ?? null,
    role: (data.role as AuthRole) || 'customer',
    created_at: String(data.created_at),
  };
}

export async function listOrdersForUser(userId: string): Promise<UserOrderSummaryRow[]> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('pedidos')
    .select('id, order_number, status, total, created_at')
    .eq('usuario_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('listOrdersForUser error (supabase):', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    order_number: (row.order_number as string) ?? '',
    status: String(row.status),
    total: String(row.total),
    created_at: String(row.created_at),
  }));
}

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export async function updateUserProfile(
  id: string,
  updates: UpdateUserProfileInput,
): Promise<UserProfileRow | null> {
  const fields: string[] = [];
  const values: any[] = [];

  if (typeof updates.firstName === 'string') {
    fields.push('first_name = $' + (fields.length + 1));
    values.push(updates.firstName);
  }
  if (typeof updates.lastName === 'string') {
    fields.push('last_name = $' + (fields.length + 1));
    values.push(updates.lastName);
  }
  if (typeof updates.phone === 'string') {
    fields.push('phone = $' + (fields.length + 1));
    values.push(updates.phone);
  }

  if (fields.length === 0) {
    return findUserProfileById(id);
  }

  const supabase = createSupabaseServiceClient();

  const updatePayload: Record<string, any> = {};
  if (typeof updates.firstName === 'string') updatePayload.first_name = updates.firstName;
  if (typeof updates.lastName === 'string') updatePayload.last_name = updates.lastName;
  if (typeof updates.phone === 'string') updatePayload.phone = updates.phone;

  const { data, error } = await supabase
    .from('usuarios')
    .update(updatePayload)
    .eq('id', id)
    .select('id, email, first_name, last_name, phone, role, created_at')
    .maybeSingle();

  if (error) {
    console.error('updateUserProfile error (supabase):', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id as string,
    email: data.email as string,
    first_name: data.first_name as string,
    last_name: data.last_name as string,
    phone: (data.phone as string | null) ?? null,
    role: (data.role as AuthRole) || 'customer',
    created_at: String(data.created_at),
  };
}
