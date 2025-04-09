export class MemoryStorage implements Storage {
  private storage = new Map<string, string>();

  getItem(key: string) {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string) {
    this.storage.set(key, value);
  }

  clear() {
    this.storage.clear();
  }

  removeItem(key: string) {
    this.storage.delete(key);
  }

  key(index: number) {
    return Array.from(this.storage.keys())[index] || null;
  }

  get length() {
    return this.storage.size;
  }
}
