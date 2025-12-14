import { createSupabaseServiceClient } from '../supabaseClient';

export interface WishlistRow {
  id: string;
  usuario_id: string;
  producto_id: string;
  added_at: string;
}

export async function listWishlistByUser(userId: string): Promise<WishlistRow[]> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, usuario_id, producto_id, added_at')
    .eq('usuario_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('listWishlistByUser error (supabase):', error);
    throw new Error('Failed to fetch wishlist');
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    usuario_id: row.usuario_id as string,
    producto_id: row.producto_id as string,
    added_at: String(row.added_at),
  }));
}

export async function addToWishlist(userId: string, productId: string): Promise<WishlistRow> {
  const supabase = createSupabaseServiceClient();

  // Comprobar si ya existe
  const { data: existing, error: existingError } = await supabase
    .from('wishlist')
    .select('id, usuario_id, producto_id, added_at')
    .eq('usuario_id', userId)
    .eq('producto_id', productId)
    .maybeSingle();

  if (existingError) {
    console.error('addToWishlist check existing error (supabase):', existingError);
    throw new Error('Failed to check wishlist');
  }

  if (existing) {
    return {
      id: existing.id as string,
      usuario_id: existing.usuario_id as string,
      producto_id: existing.producto_id as string,
      added_at: String(existing.added_at),
    };
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      usuario_id: userId,
      producto_id: productId,
    })
    .select('id, usuario_id, producto_id, added_at')
    .single();

  if (error || !data) {
    console.error('addToWishlist insert error (supabase):', error);
    throw new Error('Failed to add to wishlist');
  }

  return {
    id: data.id as string,
    usuario_id: data.usuario_id as string,
    producto_id: data.producto_id as string,
    added_at: String(data.added_at),
  };
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('usuario_id', userId)
    .eq('producto_id', productId);

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
    .eq('usuario_id', userId);

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
    .eq('usuario_id', userId)
    .eq('producto_id', productId);

  if (error) {
    console.error('isInWishlist error (supabase):', error);
    return false;
  }

  return (count || 0) > 0;
}
