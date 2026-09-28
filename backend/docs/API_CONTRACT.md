# API contract (Phase 1)

## `GET /api/health`

Returns:

```json
{
  "success": true,
  "status": "ok",
  "service": "blinkbargain-api",
  "serpApiConfigured": false
}
```

The response never includes the SerpApi key. `X-Request-Id` is returned on every request.

## `POST /api/compare`

Accepts `location`, `items`, and selected provider IDs. It returns normalized offers and item-level statuses. In development with `DEMO_MODE=true` and no API key, fixture-backed results are explicitly marked with `demoData: true`. Live mode uses only the server-side SerpApi client.

## `POST /api/optimize`

Accepts a strategy, constraints, normalized compare items, and normalized offers. It never calls SerpApi. It returns a deterministic recommended basket, provider orders, alternatives, savings baseline, structured reasoning, and warnings for unknown fees or unsatisfied constraints.
