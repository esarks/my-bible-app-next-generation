// This is a shared in-memory map for development only.
// It resets on each server restart.
const codeStore = new Map<string, string>();
export default codeStore;
