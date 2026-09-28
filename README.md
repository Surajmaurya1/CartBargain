# CartBargain

> Compare a grocery basket across quick-commerce providers, then choose the cheapest way to buy it.

CartBargain is a grocery price intelligence and basket optimization platform for India. Users enter a grocery list and location, and CartBargain searches supported quick-commerce providers, normalizes the results, compares the complete basket, and recommends the best purchasing strategy.

Built for a hackathon, the project combines a polished React/Vite frontend with a TypeScript backend, live SerpApi integration, deterministic basket optimization, clearly labeled demo data, and defensive reliability behavior for real-world upstream failures.

## The problem

Grocery prices, availability, pack sizes, discounts, and delivery terms vary across providers. Comparing one item at a time does not reveal the cheapest way to complete the whole basket. A lower-cost result may require splitting items across providers, while pack sizes and delivery fees can change the final decision.

CartBargain turns that multi-app comparison into one basket-level recommendation.

## What CartBargain does

- Accepts natural grocery lists such as `2 kg rice, 1 packet atta, milk`.
- Searches by user location across Blinkit, Zepto, and Swiggy Instamart.
- Normalizes prices, pack sizes, units, discounts, ratings, delivery information, and availability.
- Handles partial results when an item or provider is unavailable.
- Finds the lowest-cost valid basket, including multi-provider baskets.
- Supports `LOWEST_TOTAL`, `BEST_VALUE`, and `BEST_DEALS` strategies.
- Shows a single-provider baseline and estimated savings from splitting the basket.
- Finds nearby grocery stores through local search.
- Runs without an API key using clearly labeled demo fixtures.

## Hackathon highlights

### User impact

CartBargain saves users time and money by optimizing the full basket instead of simply displaying isolated product prices.

### Engineering highlights

- React/Vite frontend with Tailwind CSS and Framer Motion.
- TypeScript backend using Node’s native HTTP server.
- Server-side SerpApi key handling; credentials never reach the browser.
- Strict input validation and structured error responses.
- Deterministic product matching, unit normalization, pack-size extraction, and basket generation.
- Controlled search concurrency and an upstream request budget.
- Bounded retries for timeouts, network failures, HTTP 429, and 5xx responses.
- Process-local circuit breaker, rate limiter, TTL cache, and in-flight request coalescing.
- Request IDs and safe structured logs for debugging.

## How it works

```text
User enters basket and location
              |
              v
React/Vite -> POST /api/compare
              |
              v
Validate -> parse list -> create search plan
              |
              v
SerpApi or demo fixtures -> parse untrusted response
              |
              v
Normalize offers -> match products -> attach discounts and delivery data
              |
              v
Display comparison results
              |
              v
POST /api/optimize -> generate valid baskets -> rank recommendation
              |
              v
Recommended basket, orders, savings, trade-offs, and warnings
```

The optimization stage is separate from live search. It receives normalized items and offers, performs deterministic calculations, and never calls SerpApi.

## Supported providers

| Provider ID | Display name |
| --- | --- |
| `blinkit` | Blinkit |
| `zepto` | Zepto |
| `instamart` | Swiggy Instamart |

## Repository structure

```text
frontend/       React/Vite user interface
backend/        TypeScript API and optimization services
README.md       Main project documentation
```

Backend services include search planning, SerpApi integration, offer normalization, basket generation, optimization, nearby-store search, caching, retries, circuit breaking, and rate limiting.

## Quick start

### 1. Start the backend

Requirements: Node.js 18+ and npm.

```bash
cd backend
npm install
npm run build
npm start
```

The API runs at `http://localhost:3000` by default.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend on port `3000`.

## Demo mode

The project can be demonstrated without external credentials. When `DEMO_MODE=true` and no `SERPAPI_API_KEY` is provided, the backend uses the fixtures in `backend/src/server/mock/serpapi`.

Demo results are labeled with `demoData: true`, so judges can distinguish fixture data from live provider data.

PowerShell:

```powershell
cd backend
$env:DEMO_MODE = "true"
npm run build
npm start
```

For live searches, create `backend/.env` from `backend/.env.example` and set:

```env
SERPAPI_API_KEY=your_key_here
DEMO_MODE=false
```

Never commit the real API key.

## API overview

Every response uses a consistent success/error shape, and every HTTP response includes an `X-Request-Id` header.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and SerpApi configuration status |
| `POST` | `/api/compare` | Search and normalize grocery offers |
| `POST` | `/api/optimize` | Calculate the recommended basket |
| `POST` | `/api/nearby` | Find nearby grocery stores |

Example compare request:

```json
{
  "location": { "text": "Bengaluru", "pinCode": "560001" },
  "items": [
    { "name": "rice", "quantity": 2, "unit": "kg" },
    { "name": "atta", "quantity": 5, "unit": "kg" }
  ],
  "providers": ["blinkit", "zepto", "instamart"]
}
```

The compare response contains normalized items, provider offers, item-level statuses, warnings, discount details, delivery information, and demo-data labels.

## Reliability and safety

- Upstream calls have timeout protection.
- Transient failures use bounded retries with backoff.
- A circuit breaker limits repeated upstream failures.
- Comparison and nearby requests are rate-limited by client IP.
- Search concurrency and total upstream requests are bounded.
- Partial results are returned with explicit warnings.
- External responses are treated as untrusted and parsed defensively.
- SerpApi credentials are kept server-side and excluded from logs.
- Unknown delivery or handling fees remain unknown instead of being guessed.

### Cache behavior

The backend uses a custom process-local in-memory TTL cache for SerpApi responses. The default TTL is 55 minutes and is configurable through `SERPAPI_CACHE_TTL_MS`. An in-flight registry coalesces identical concurrent requests. The cache is not persistent and is not shared between server instances.

## Testing

Run the backend tests:

```bash
cd backend
npm test
```

Tests cover parser tolerance, caching and request coalescing, rate limiting, deterministic optimization, pack-size and quantity handling, nearby distance calculations, and validation behavior.

## Future improvements

- Provider-specific adapters for richer catalog and delivery data.
- Persistent shared caching such as Redis for multi-instance deployment.
- Saved baskets, accounts, price history, and price-drop alerts.
- Checkout deep links where provider policies permit them.
- Metrics, distributed tracing, and managed deployment configuration.

## Documentation

- [Backend README](backend/README.md)
- [API contract](backend/docs/API_CONTRACT.md)
- [Architecture notes](backend/docs/ARCHITECTURE.md)
- [SerpApi integration](backend/docs/SERPAPI.md)
- [Frontend integration](backend/docs/FRONTEND_INTEGRATION.md)
- [Implementation state](backend/IMPLEMENTATION_STATE.md)
- [Project decisions](backend/DECISIONS.md)

## License

See [backend/LICENSE](backend/LICENSE).
