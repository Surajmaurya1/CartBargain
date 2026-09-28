export class RateLimiter {
  private readonly buckets = new Map<string, number[]>();
  constructor(private readonly maxRequests: number, private readonly windowMs: number, private readonly now = () => Date.now()) {}

  allow(key: string): boolean {
    const cutoff = this.now() - this.windowMs;
    const recent = (this.buckets.get(key) ?? []).filter((timestamp) => timestamp > cutoff);
    if (recent.length >= this.maxRequests) { this.buckets.set(key, recent); return false; }
    recent.push(this.now()); this.buckets.set(key, recent); return true;
  }
}
