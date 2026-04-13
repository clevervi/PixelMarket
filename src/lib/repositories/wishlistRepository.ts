import { createSupabaseServiceClient } from '../supabaseClient';

export interface WishlistRow {
  id: string;
  user_id: string;
  product_id: string;
  added_at: string;
}

export async function listWishlistByUser(userId: string): Promise<WishlistRow[]> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, user_id, product_id, added_at')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('listWishlistByUser error (supabase):', error);
    throw new Error('Failed to fetch wishlist');
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    product_id: row.product_id as string,
    added_at: String(row.added_at),
  }));
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistRow> {
  const supabase = createSupabaseServiceClient();

  // Comprobar si ya existe
  const { data: existing, error: existingError } = await supabase
    .from('wishlist')
    .select('id, user_id, product_id, added_at')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existingError) {
    console.error('addToWishlist check existing error (supabase):', existingError);
    throw new Error('Failed to check wishlist');
  }

  if (existing) {
    return {
      id: existing.id as string,
      user_id: existing.user_id as string,
      product_id: existing.product_id as string,
      added_at: String(existing.added_at),
    };
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      user_id: userId,
      product_id: productId,
    })
    .select('id, user_id, product_id, added_at')
    .single();

  if (error || !data) {
    console.error('addToWishlist insert error (supabase):', error);
    throw new Error('Failed to add to wishlist');
  }

  return {
    id: data.id as string,
    user_id: data.user_id as string,
    product_id: data.product_id as string,
    added_at: String(data.added_at),
  };
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('removeFromWishlist error (supabase):', error);
    throw new Error('Failed to remove from wishlist');
  }
}

export async function clearWishlist(userId: string): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('clearWishlist error (supabase):', error);
    throw new Error('Failed to clear wishlist');
  }
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const supabase = createSupabaseServiceClient();

  const { count, error } = await supabase
    .from('wishlist')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('isInWishlist error (supabase):', error);
    return false;
  }

  return (count || 0) > 0;
}
