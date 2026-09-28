# SerpApi integration (Phase 2)

The client uses the documented `google_shopping` engine and sends `q`, `location`, `gl`, `hl`, `google_domain`, optional `device`, `no_cache=false`, and the server-side `api_key`. The key is never returned in API data or logs.

Responses are treated as untrusted. Only `search_metadata`, `search_parameters`, and array entries in `shopping_results` are retained. Optional shopping fields remain optional. A malformed top-level response becomes `SERPAPI_BAD_RESPONSE`.

The client has a process-local TTL cache and in-flight request coalescing keyed by serialized request parameters. It also has bounded retries for timeouts, network errors, 429, and 5xx responses, plus a process-local circuit breaker. These mechanisms are intentionally not shared across instances or serverless workers.

The `src/server/mock/serpapi` fixtures are demo data only and must be labeled as such by later API responses.
