import { AppError } from "../../errors/AppError";
import { MemoryCache } from "../cache/MemoryCache";
import { InFlightRegistry } from "../cache/InFlightRegistry";
import { CircuitBreaker } from "../reliability/CircuitBreaker";
import { isTransientStatus, retryDelay } from "../reliability/RetryPolicy";
import { parseSerpApiResponse } from "./serpApiParser";
import type { ParsedSerpApiResponse } from "./serpApiTypes";

export type SerpApiSearchRequest = {
  query: string;
  location: string;
  gl?: string;
  hl?: string;
  googleDomain?: string;
  device?: "desktop" | "mobile" | "tablet";
};

export type SerpApiLocalSearchRequest = Omit<SerpApiSearchRequest, "query"> & { query?: string };

export type SerpApiClientOptions = {
  apiKey: string | null;
  timeoutMs: number;
  maxAttempts: number;
  cacheTtlMs: number;
  circuitFailureThreshold: number;
  circuitCooldownMs: number;
  retryBaseDelayMs: number;
  endpoint?: string;
  fetchImpl?: typeof fetch;
};

export class SerpApiClient {
  private readonly cache: MemoryCache<ParsedSerpApiResponse>;
  private readonly inFlight = new InFlightRegistry<ParsedSerpApiResponse>();
  private readonly breaker: CircuitBreaker;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: SerpApiClientOptions) {
    this.cache = new MemoryCache(options.cacheTtlMs);
    this.breaker = new CircuitBreaker(options.circuitFailureThreshold, options.circuitCooldownMs);
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  search(request: SerpApiSearchRequest): Promise<ParsedSerpApiResponse> {
    return this.searchWithEngine("google_shopping", request);
  }

  searchLocal(request: SerpApiLocalSearchRequest): Promise<ParsedSerpApiResponse> {
    return this.searchWithEngine("google_local", { ...request, query: request.query ?? "grocery stores" });
  }

  private searchWithEngine(engine: "google_shopping" | "google_local", request: SerpApiSearchRequest): Promise<ParsedSerpApiResponse> {
    if (!this.options.apiKey) return Promise.reject(new AppError("SERPAPI_CONFIGURATION_ERROR", "Live price search is not configured.", 503));
    const params = new URLSearchParams({ engine, q: request.query, location: request.location, gl: request.gl ?? "in", hl: request.hl ?? "en", google_domain: request.googleDomain ?? "google.co.in", no_cache: "false" });
    if (request.device) params.set("device", request.device);
    const key = params.toString();
    const cached = this.cache.get(key);
    if (cached) return Promise.resolve(cached);
    return this.inFlight.getOrCreate(key, async () => {
      this.breaker.assertCanRequest();
      const result = await this.requestWithRetry(params);
      this.cache.set(key, result);
      return result;
    });
  }

  private async requestWithRetry(params: URLSearchParams): Promise<ParsedSerpApiResponse> {
    let lastError: AppError | undefined;
    for (let attempt = 1; attempt <= this.options.maxAttempts; attempt += 1) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);
        let response: Response;
        try {
          response = await this.fetchImpl(`${this.options.endpoint ?? "https://serpapi.com/search.json"}?${params.toString()}&api_key=${encodeURIComponent(this.options.apiKey!)}`, { signal: controller.signal });
        } finally { clearTimeout(timeout); }
        if (!response.ok) {
          const transient = isTransientStatus(response.status);
          throw new AppError(response.status === 401 || response.status === 403 ? "SERPAPI_AUTH_ERROR" : transient ? "SERPAPI_UPSTREAM_ERROR" : "SERPAPI_UPSTREAM_ERROR", "The price search provider could not be reached.", transient ? 502 : response.status, transient);
        }
        const parsed = parseSerpApiResponse(await response.json());
        this.breaker.recordSuccess();
        return parsed;
      } catch (error) {
        lastError = error instanceof AppError ? error : new AppError(error instanceof DOMException && error.name === "AbortError" ? "SERPAPI_TIMEOUT" : "SERPAPI_UPSTREAM_ERROR", "The price search provider could not be reached.", error instanceof DOMException && error.name === "AbortError" ? 504 : 502, true);
        if (lastError.code === "SERPAPI_TIMEOUT") lastError = new AppError("SERPAPI_TIMEOUT", "The price search provider timed out.", 504, true);
        if (!lastError.retryable || attempt >= this.options.maxAttempts) break;
        await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt, this.options.retryBaseDelayMs)));
      }
    }
    this.breaker.recordFailure();
    throw lastError ?? new AppError("SERPAPI_UPSTREAM_ERROR", "The price search provider could not be reached.", 502);
  }
}
