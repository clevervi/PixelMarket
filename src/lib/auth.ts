import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'CHANGE_ME_IN_PRODUCTION';

export type AuthRole = 'admin' | 'vendor' | 'customer' | string;

export interface AuthTokenPayload {
  sub: string; // user id (UUID)
  email: string;
  role: AuthRole;
  vendorId?: string | null;
  iat: number;
}

// Password hashing helpers
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 10);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Minimal signed-token implementation (HMAC-based, JWT-like)
function signToken(payload: Omit<AuthTokenPayload, 'iat'>): string {
  const fullPayload: AuthTokenPayload = {
    ...payload,
    iat: Date.now(),
  };

  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

function verifyTokenString(token: string): AuthTokenPayload | null {
  const [data, signature] = token.split('.');
  if (!data || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(data)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const json = Buffer.from(data, 'base64url').toString('utf8');
    return JSON.parse(json) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(
  res: NextResponse,
  payload: Omit<AuthTokenPayload, 'iat'>,
): void {
  const token = signToken(payload);

  res.cookies.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function getAuthUser(req: NextRequest): AuthTokenPayload | null {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return verifyTokenString(token);
  } catch {
    return null;
  }
}
