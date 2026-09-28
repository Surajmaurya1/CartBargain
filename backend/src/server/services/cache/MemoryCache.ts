export class MemoryCache<T> {
  private readonly values = new Map<string, { value: T; expiresAt: number }>();

  constructor(private readonly ttlMs: number, private readonly now = () => Date.now()) {}

  get(key: string): T | undefined {
    const entry = this.values.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.values.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void { this.values.set(key, { value, expiresAt: this.now() + this.ttlMs }); }
  clear(): void { this.values.clear(); }
}
