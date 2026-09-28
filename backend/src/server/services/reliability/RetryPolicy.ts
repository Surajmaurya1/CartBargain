export function isTransientStatus(status: number): boolean {
  return status === 429 || [500, 502, 503, 504].includes(status);
}

export function retryDelay(attempt: number, baseDelayMs: number, random = Math.random): number {
  const exponential = baseDelayMs * (attempt === 1 ? 0 : attempt === 2 ? 1 : 3);
  return Math.round(exponential + random() * Math.max(1, baseDelayMs / 2));
}
