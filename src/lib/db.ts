import { Pool } from 'pg';

// Prefer a full Supabase/PostgreSQL connection string if provided.
// You can copy this from Supabase → Settings → Database → Connection string.
const connectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  undefined;

const pool = connectionString
  ? new Pool({
      connectionString,
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      // Supabase requiere SSL; en local aceptamos el certificado sin verificar.
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'latido_ancestral',
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

export async function sql<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params as any[] | undefined);
  return result.rows as T[];
}

export async function sqlOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const rows = await sql<T>(text, params);
  return rows[0] ?? null;
}

export { pool };
export default pool;
