import { supabaseAdmin } from '@/lib/supabase';
import { Peserta } from '@/types/peserta';

/**
 * Get a peserta by their NIM.
 * Returns null if not found.
 */
export async function getPesertaByNim(nim: string): Promise<Peserta | null> {
  const { data, error } = await supabaseAdmin
    .from('peserta')
    .select('*')
    .eq('nim', nim)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw new Error(`Failed to get peserta by NIM: ${error.message}`);
  }

  return data as Peserta;
}

/**
 * Get all peserta from the database.
 */
export async function getAllPeserta(): Promise<Peserta[]> {
  const { data, error } = await supabaseAdmin
    .from('peserta')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get all peserta: ${error.message}`);
  }

  return (data as Peserta[]) ?? [];
}

/**
 * Create a new peserta record.
 */
export async function createPeserta(
  data: Omit<Peserta, 'id' | 'created_at' | 'updated_at'>
): Promise<Peserta> {
  const { data: created, error } = await supabaseAdmin
    .from('peserta')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create peserta: ${error.message}`);
  }

  return created as Peserta;
}

/**
 * Update an existing peserta by ID.
 */
export async function updatePeserta(
  id: string,
  data: Partial<Peserta>
): Promise<Peserta> {
  const { data: updated, error } = await supabaseAdmin
    .from('peserta')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update peserta: ${error.message}`);
  }

  return updated as Peserta;
}

/**
 * Delete a peserta by ID.
 */
export async function deletePeserta(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('peserta')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete peserta: ${error.message}`);
  }
}
