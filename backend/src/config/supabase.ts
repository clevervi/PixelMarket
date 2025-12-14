import { createClient } from '@supabase/supabase-js';
import config from './config';

// Crear cliente de Supabase
const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // En backend no necesitamos persistir sesiones
    },
  }
);

export default supabase;
