import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { findUserByIdForAuth, type AuthUserRow } from '@/lib/repositories/userRepository';

export interface SupabaseAuthContext {
  authUser: {
    id: string;
    email?: string;
  };
  dbUser: AuthUserRow;
}

/**
 * Obtiene el usuario autenticado a través de Supabase (JWT) y la fila
 * correspondiente en la tabla `usuarios`.
 */
export async function getSupabaseAuthContext(): Promise<SupabaseAuthContext | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const dbUser = await findUserByIdForAuth(data.user.id as string);

  if (!dbUser) {
    return null;
  }

  return {
    authUser: {
      id: dbUser.id,
      email: data.user.email ?? dbUser.email,
    },
    dbUser,
  };
}
