import { Pool, QueryResult } from 'pg';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'vendor' | 'customer';
  is_active: boolean;
  first_name?: string;
  last_name?: string;
}

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'tienda_virtual',
  user: 'postgres',
  password: 'Qwe.123*',
});

async function fixUsers(): Promise<void> {
  try {
    // Check for existing users with these emails
    console.log('Checking existing users...\n');
    const existing: QueryResult<User> = await pool.query(
      "SELECT id, email, role, is_active FROM usuarios WHERE email IN ('admin@latido.com', 'manager@latido.com', 'user@latido.com')"
    );
    
    console.log(`Found ${existing.rows.length} existing users:`);
    existing.rows.forEach((user: User) => {
      console.log(`- ${user.id}: ${user.email} (${user.role}) - ${user.is_active ? 'active' : 'inactive'}`);
    });
    
    // Delete existing users
    console.log('\nDeleting existing users...');
    await pool.query(
      "DELETE FROM usuarios WHERE email IN ('admin@latido.com', 'manager@latido.com', 'user@latido.com')"
    );
    console.log('✓ Deleted existing users');
    
    // Insert fresh users
    console.log('\nInserting test users...');
    
    // Admin user
    await pool.query(
      `INSERT INTO usuarios (id, email, password_hash, first_name, last_name, role, is_active, email_verified, created_at)
       VALUES (
         '11111111-1111-1111-1111-111111111111',
         'admin@latido.com',
         '$2b$10$zCRJ9U7Mq8CcALIKzhq4Pehjp6nMwLqvuAaBueiTgoCQm/TXo07vS',
         'Admin',
         'User',
         'admin',
         true,
         true,
         NOW()
       )`
    );
    console.log('✓ Inserted admin@latido.com (password: admin123)');
    
    // Store Manager user (changed from vendor)
    await pool.query(
      `INSERT INTO usuarios (id, email, password_hash, first_name, last_name, role, is_active, email_verified, created_at)
       VALUES (
         '22222222-2222-2222-2222-222222222222',
         'manager@latido.com',
         '$2b$10$icQIFNIljSQvrk4sduwOe.mVYRK1oVR34AIfd8TD9/IK8RrYlEpW2',
         'Store',
         'Manager',
         'store_manager',
         true,
         true,
         NOW()
       )`
    );
    console.log('✓ Inserted manager@latido.com (password: manager123)');
    
    // Regular user
    await pool.query(
      `INSERT INTO usuarios (id, email, password_hash, first_name, last_name, role, is_active, email_verified, created_at)
       VALUES (
         '33333333-3333-3333-3333-333333333333',
         'user@latido.com',
         '$2b$10$XCB4TuHeH5N7hGQMqWIV1ORvbGrO3uLqUVmbn5KhQ6vBxDZYhQQIq',
         'Regular',
         'User',
         'customer',
         true,
         true,
         NOW()
       )`
    );
    console.log('✓ Inserted user@latido.com (password: user123)');
    
    // Verify insertion
    const result: QueryResult<User> = await pool.query(
      "SELECT id, email, first_name, last_name, role, is_active FROM usuarios WHERE email LIKE '%@latido.com' ORDER BY email"
    );
    
    console.log(`\nVerification - Found ${result.rows.length} users:`);
    result.rows.forEach((user: User) => {
      console.log(`- ${user.email} (${user.role}) - ${user.is_active ? 'active' : 'inactive'}`);
    });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      console.error(error);
    } else {
      console.error('Unknown error:', error);
    }
  } finally {
    await pool.end();
  }
}

fixUsers();
