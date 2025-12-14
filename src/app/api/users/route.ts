import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_API_URL ?? 'http://localhost:4000/api';

async function proxyToBackend(req: NextRequest, path: string, init?: RequestInit) {
  const url = new URL(req.url);
  const search = url.search || '';
  const targetUrl = `${BACKEND_BASE_URL}${path}${search}`;

  const response = await fetch(targetUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return NextResponse.json(data, { status: response.status });
}

// GET /api/users - listado de usuarios desde backend Express
export async function GET(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/users');
  } catch (error) {
    console.error('Error proxying GET /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}

// POST /api/users - crear usuario (usado por admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await proxyToBackend(req, '/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Error proxying POST /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
