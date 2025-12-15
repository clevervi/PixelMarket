import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, AuthRole } from '@/lib/auth';

export interface GuardContext {
  req: NextRequest;
}

// Server-side authentication based only on our own auth_token
export async function requireAuth(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { ok: true as const, user };
}

export async function requireRole(req: NextRequest, roles: AuthRole[]) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth;

  if (!roles.includes(auth.user.role)) {
    return {
      ok: false as const,
      response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  return auth;
}

export function requireAdmin(req: NextRequest) {
  return requireRole(req, ['admin']);
}

export function requireAdminOrVendor(req: NextRequest) {
  return requireRole(req, ['admin', 'vendor']);
}
