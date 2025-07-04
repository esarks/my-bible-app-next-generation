const { parsePhoneNumber } = require('libphonenumber-js');

function normalizePhone(phone) {
  const parsed = parsePhoneNumber(phone, 'US');
  if (!parsed || !parsed.isValid()) {
    throw new Error('Invalid phone number');
  }
  return parsed.number; // returns E.164 format
}

module.exports = { normalizePhone };
