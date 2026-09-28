export class InFlightRegistry<T> {
  private readonly entries = new Map<string, Promise<T>>();

  getOrCreate(key: string, factory: () => Promise<T>): Promise<T> {
    const existing = this.entries.get(key);
    if (existing) return existing;
    const promise = factory().finally(() => this.entries.delete(key));
    this.entries.set(key, promise);
    return promise;
  }
}
