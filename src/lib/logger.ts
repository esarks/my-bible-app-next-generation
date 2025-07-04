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
