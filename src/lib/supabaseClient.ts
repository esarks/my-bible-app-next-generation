import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  logger.info('Initializing Supabase client');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  logger.error(
    'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}
