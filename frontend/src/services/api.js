import { createClient } from '@supabase/supabase-js';

// Asegúrate de colocar tus credenciales reales o usar variables de entorno (.env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cnupyyuydsiatthvgelb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_p8E9q7RA-bQkaBQx5X9Vpw_y0cMvV-K';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para obtener los productos desde Supabase
export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
  return data;
}