import { Pool, QueryResult } from 'pg';

interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'vendor' | 'customer' | 'store_manager';
  is_active: boolean;
}

interface UpdateUser {
  email: string;
  password: string;
  role: 'admin' | 'vendor' | 'customer' | 'store_manager';
}

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tienda_virtual',
  user: 'postgres',
  password: 'Qwe.123*',
});

async function checkAndFix(): Promise<void> {
  try {
    // Check all users
    console.log('Checking all users in database...\n');
    const all: QueryResult<User> = await pool.query(
      "SELECT id, email, password_hash, role, is_active FROM usuarios ORDER BY email"
    );
    
    console.log(`Found ${all.rows.length} total users:`);
    all.rows.forEach((user: User) => {
      console.log(`- ${user.id.substring(0, 8)}...: ${user.email} (${user.role}) - ${user.is_active ? 'active' : 'inactive'}`);
    });
    
    // Update existing users with correct bcrypt hashes
    console.log('\n\nUpdating passwords for @latido.com users...');
    
    const updates: UpdateUser[] = [
      { email: 'admin@latido.com', password: '$2b$10$zCRJ9U7Mq8CcALIKzhq4Pehjp6nMwLqvuAaBueiTgoCQm/TXo07vS', role: 'admin' },
      { email: 'manager@latido.com', password: '$2b$10$icQIFNIljSQvrk4sduwOe.mVYRK1oVR34AIfd8TD9/IK8RrYlEpW2', role: 'store_manager' },
      { email: 'user@latido.com', password: '$2b$10$XCB4TuHeH5N7hGQMqWIV1ORvbGrO3uLqUVmbn5KhQ6vBxDZYhQQIq', role: 'customer' }
    ];
    
    for (const u of updates) {
      const result: QueryResult<{ id: string; email: string }> = await pool.query(
        'UPDATE usuarios SET password_hash = $1, is_active = true WHERE email = $2 RETURNING id, email',
        [u.password, u.email]
      );
      if (result.rows.length > 0) {
        console.log(`✓ Updated ${u.email} with bcrypt hash`);
      } else {
        console.log(`✗ ${u.email} not found, inserting...`);
        // Insert with new UUID
        await pool.query(
          `INSERT INTO usuarios (email, password_hash, first_name, last_name, role, is_active, email_verified)
           VALUES ($1, $2, $3, $4, $5, true, true)`,
          [u.email, u.password, u.email.split('@')[0], 'User', u.role]
        );
        console.log(`✓ Inserted ${u.email}`);
      }
    }
    
    // Verify final state
    console.log('\n\nFinal user state:');
    const final: QueryResult<User> = await pool.query(
      "SELECT id, email, role, is_active FROM usuarios WHERE email LIKE '%@latido.com' ORDER BY email"
    );
    
    final.rows.forEach((user: User) => {
      console.log(`- ${user.email} (${user.role}) - ${user.is_active ? 'active' : 'inactive'}`);
    });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  } finally {
    await pool.end();
  }
}

checkAndFix();
