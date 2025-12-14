import { sql, sqlOne } from '../db';

export interface VendorRow {
  id: string;
  business_name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  owner_id: string | null;
  status: string;
  commission_rate: string; // numeric comes as string
  contact_email: string;
  contact_phone: string | null;
}

export interface CreateVendorInput {
  businessName: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  ownerId?: string;
  contactEmail: string;
  contactPhone?: string;
  commissionRate?: number;
}

export async function listVendors(): Promise<VendorRow[]> {
  return sql<VendorRow>(
    `SELECT 
       id,
       business_name,
       slug,
       description,
       logo,
       banner,
       owner_id,
       status,
       commission_rate::text as commission_rate,
       contact_email,
       contact_phone
     FROM vendors
     ORDER BY created_at DESC
    `,
  );
}

export async function findVendorById(id: string): Promise<VendorRow | null> {
  return sqlOne<VendorRow>(
    `SELECT 
       id,
       business_name,
       slug,
       description,
       logo,
       banner,
       owner_id,
       status,
       commission_rate::text as commission_rate,
       contact_email,
       contact_phone
     FROM vendors
     WHERE id = $1
    `,
    [id],
  );
}

export async function findVendorByOwnerId(ownerId: string): Promise<VendorRow | null> {
  return sqlOne<VendorRow>(
    `SELECT 
       id,
       business_name,
       slug,
       description,
       logo,
       banner,
       owner_id,
       status,
       commission_rate::text as commission_rate,
       contact_email,
       contact_phone
     FROM vendors
     WHERE owner_id = $1
       AND status IN ('active', 'pending')
     ORDER BY created_at DESC
     LIMIT 1
    `,
    [ownerId],
  );
}

export async function createVendor(input: CreateVendorInput): Promise<VendorRow> {
  const row = await sqlOne<VendorRow>(
    `INSERT INTO vendors (
       business_name,
       slug,
       description,
       logo,
       banner,
       owner_id,
       status,
       commission_rate,
       contact_email,
       contact_phone
     ) VALUES (
       $1,
       $2,
       $3,
       $4,
       $5,
       $6,
       'pending',
       COALESCE($7, 10.00),
       $8,
       $9
     )
     RETURNING 
       id,
       business_name,
       slug,
       description,
       logo,
       banner,
       owner_id,
       status,
       commission_rate::text as commission_rate,
       contact_email,
       contact_phone
    `,
    [
      input.businessName,
      input.slug,
      input.description || null,
      input.logo || null,
      input.banner || null,
      input.ownerId || null,
      input.commissionRate ?? null,
      input.contactEmail,
      input.contactPhone || null,
    ],
  );

  if (!row) throw new Error('Failed to create vendor');
  return row;
}
