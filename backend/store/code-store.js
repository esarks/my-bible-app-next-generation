// backend/store/code-store.js

const store = new Map();

module.exports = {
  set: (phone, code) => {
    store.set(phone, code);
    // Optional: add expiration logic here if needed
  },
  get: (phone) => store.get(phone),
  delete: (phone) => store.delete(phone),
};
