import { AppError } from "../../errors/AppError";

export class CircuitBreaker {
  private failures = 0;
  private openedAt: number | null = null;

  constructor(private readonly threshold: number, private readonly cooldownMs: number, private readonly now = () => Date.now()) {}

  canRequest(): boolean {
    if (this.openedAt === null) return true;
    if (this.now() - this.openedAt >= this.cooldownMs) {
      this.openedAt = null;
      this.failures = 0;
      return true;
    }
    return false;
  }

  assertCanRequest(): void {
    if (!this.canRequest()) throw new AppError("SERPAPI_TEMPORARILY_UNAVAILABLE", "Price search is temporarily unavailable. Please try again.", 503, true);
  }

  recordSuccess(): void { this.failures = 0; this.openedAt = null; }
  recordFailure(): void {
    this.failures += 1;
    if (this.failures >= this.threshold) this.openedAt = this.now();
  }
}
