import { sql, sqlOne } from '../db';

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: string; // numeric -> string
  stock: number;
  featured: boolean;
  is_active: boolean;
  vendor_id: string | null;
  category_id: string | null;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  stock?: number;
  featured?: boolean;
  vendorId: string | null;
  categoryId?: string | null;
}

export async function listActiveProducts(): Promise<ProductRow[]> {
  return sql<ProductRow>(
    `SELECT 
       id,
       name,
       slug,
       description,
       short_description,
       price::text as price,
       stock,
       featured,
       is_active,
       vendor_id,
       category_id
     FROM productos
     WHERE is_active = true
     ORDER BY created_at DESC
    `,
  );
}

export async function listProductsByVendor(vendorId: string): Promise<ProductRow[]> {
  return sql<ProductRow>(
    `SELECT 
       id,
       name,
       slug,
       description,
       short_description,
       price::text as price,
       stock,
       featured,
       is_active,
       vendor_id,
       category_id
     FROM productos
     WHERE vendor_id = $1
     ORDER BY created_at DESC
    `,
    [vendorId],
  );
}

export async function findProductById(id: string): Promise<ProductRow | null> {
  return sqlOne<ProductRow>(
    `SELECT 
       id,
       name,
       slug,
       description,
       short_description,
       price::text as price,
       stock,
       featured,
       is_active,
       vendor_id,
       category_id
     FROM productos
     WHERE id = $1
    `,
    [id],
  );
}

export async function createProduct(input: CreateProductInput): Promise<ProductRow> {
  const row = await sqlOne<ProductRow>(
    `INSERT INTO productos (
       name,
       slug,
       description,
       short_description,
       price,
       stock,
       featured,
       is_active,
       vendor_id,
       category_id
     ) VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       COALESCE($6, 0),
       COALESCE($7, false),
       true,
       $8,
       $9
     )
     RETURNING 
       id,
       name,
       slug,
       description,
       short_description,
       price::text as price,
       stock,
       featured,
       is_active,
       vendor_id,
       category_id
    `,
    [
      input.name,
      input.slug,
      input.description,
      input.shortDescription || null,
      input.price,
      input.stock ?? null,
      input.featured ?? null,
      input.vendorId,
      input.categoryId ?? null,
    ],
  );

  if (!row) throw new Error('Failed to create product');
  return row;
}

export async function softDeleteProduct(id: string): Promise<void> {
  await sql(
    `UPDATE productos
     SET is_active = false
     WHERE id = $1
    `,
    [id],
  );
}
