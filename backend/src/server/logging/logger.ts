export function logEvent(event: string, fields: Record<string, unknown> = {}): void {
  // Structured fields only; callers must not pass API keys, raw request bodies, or grocery lists.
  console.log(JSON.stringify({ event, ...fields }));
}
