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
 * Get the authenticated user via Supabase (JWT) and the corresponding row
 * in the `users` table.
 */
export async function getSupabaseAuthContext(): Promise<SupabaseAuthContext | null> {
  const supabase = await createSupabaseServerClient();

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
