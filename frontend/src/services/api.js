import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cnupyyuydsiatthvgelb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_p8E9q7RA-bQkaBQx5X9Vpw_y0cMvV-K';

// Única instancia de Supabase para todo el proyecto
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error al obtener productos de Supabase:', error);
    return [];
  }
  
  return data;
}