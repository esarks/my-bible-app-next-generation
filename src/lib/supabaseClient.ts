import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function normalizeSupabaseUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }
  if (/^https?:\/\//.test(url)) {
    return url;
  }
  try {
    const parsed = new URL(url);
    const projectMatch = parsed.username.split('.')[1];
    if (projectMatch) {
      return `https://${projectMatch}.supabase.co`;
    }
  } catch (err) {
    logger.warn('Failed to parse Supabase URL', err);
  }
  return url;
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  logger.info('Initializing Supabase client');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  logger.error(
    'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}
