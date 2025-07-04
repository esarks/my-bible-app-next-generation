function format(level, args) {
  const time = new Date().toISOString();
  const msg = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  return `[${time}] [${level.toUpperCase()}] ${msg}`;
}

module.exports = {
  debug: (...args) => console.debug(format('debug', args)),
  info: (...args) => console.info(format('info', args)),
  warn: (...args) => console.warn(format('warn', args)),
  error: (...args) => console.error(format('error', args)),
};
