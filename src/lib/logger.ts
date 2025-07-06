import type { PostgrestError } from '@supabase/supabase-js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function format(level: LogLevel, args: any[]): string {
  const time = new Date().toISOString();
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  return `[${time}] [${level.toUpperCase()}] ${msg}`;
}

export const logger = {
  debug: (...args: any[]) => console.debug(format('debug', args)),
  info: (...args: any[]) => console.info(format('info', args)),
  warn: (...args: any[]) => console.warn(format('warn', args)),
  error: (...args: any[]) => console.error(format('error', args)),
};

export function logSupabaseError(context: string, error: PostgrestError | null) {
  if (!error) {
    return;
  }
  const { message, details, hint, code } = error;
  logger.error(
    `[Supabase] ${context}: ${message}`,
    {
      details,
      hint,
      code,
    }
  );
}
