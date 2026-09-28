declare const process: any;

export type AppConfig = {
  nodeEnv: "development" | "test" | "production";
  port: number;
  serpApiKey: string | null;
  serpApiTimeoutMs: number;
  serpApiMaxAttempts: number;
  maxGroceryItems: number;
  maxProviders: number;
  maxSerpApiRequests: number;
  serpApiCacheTtlMs: number;
  googleDomain: string;
  maxCompareRequestsPerIp: number;
  compareRateWindowMs: number;
  circuitFailureThreshold: number;
  circuitCooldownMs: number;
  retryBaseDelayMs: number;
  demoMode: boolean;
  searchConcurrency: number;
  minNearbySaving: number;
};

function positiveInt(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export function loadConfig(): AppConfig {
  const rawEnv = process.env.NODE_ENV ?? "development";
  const nodeEnv = rawEnv === "production" || rawEnv === "test" ? rawEnv : "development";

  return {
    nodeEnv,
    port: positiveInt("PORT", 3000),
    serpApiKey: typeof process.env.SERPAPI_API_KEY === "string" && process.env.SERPAPI_API_KEY.length > 0
      ? process.env.SERPAPI_API_KEY
      : null,
    serpApiTimeoutMs: positiveInt("SERPAPI_TIMEOUT_MS", 10_000),
    serpApiMaxAttempts: positiveInt("SERPAPI_MAX_ATTEMPTS", 3),
    maxGroceryItems: positiveInt("MAX_GROCERY_ITEMS", 8),
    maxProviders: positiveInt("MAX_PROVIDERS", 3),
    maxSerpApiRequests: positiveInt("MAX_SERPAPI_REQUESTS", 11),
    serpApiCacheTtlMs: positiveInt("SERPAPI_CACHE_TTL_MS", 3_300_000),
    googleDomain: process.env.GOOGLE_DOMAIN || "google.co.in",
    maxCompareRequestsPerIp: positiveInt("MAX_COMPARE_REQUESTS_PER_IP", 20),
    compareRateWindowMs: positiveInt("COMPARE_RATE_WINDOW_MS", 60_000),
    circuitFailureThreshold: positiveInt("SERPAPI_CIRCUIT_FAILURE_THRESHOLD", 3),
    circuitCooldownMs: positiveInt("SERPAPI_CIRCUIT_COOLDOWN_MS", 30_000),
    retryBaseDelayMs: positiveInt("SERPAPI_RETRY_BASE_DELAY_MS", 250)
    ,demoMode: process.env.DEMO_MODE === "true" || (process.env.DEMO_MODE === undefined && nodeEnv !== "production")
    ,searchConcurrency: positiveInt("SEARCH_CONCURRENCY", 3)
    ,minNearbySaving: positiveInt("MIN_NEARBY_SAVING", 20)
  };
}
