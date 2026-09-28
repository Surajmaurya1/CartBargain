# Frontend integration

The React/Vite frontend lives in `C:\Users\DeLL\Desktop\New folder (5)`.

Phase 5 connects its search flow to `POST /api/compare` and its optimization flow to `POST /api/optimize`. The UI maps normalized backend offers into the existing comparison table and maps backend orders/reasoning into the existing optimization modal. Browser code never receives the SerpApi key.

During local development, Vite runs on port 5173 and proxies `/api` to the backend on port 3000. This avoids a browser-side cross-origin dependency and keeps the API base relative by default.

The original mock catalog remains only as a pre-search visual fallback. After a real search, all displayed prices, availability, discounts, and fees come from the backend response. Partial responses are shown with an explicit warning.
