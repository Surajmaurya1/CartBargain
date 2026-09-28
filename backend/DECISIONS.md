# Decisions

## 2026-09-26 — Start with a foundation phase

The repository is empty apart from project metadata, so there is no existing React architecture to connect yet. The first implementation phase is limited to a runnable backend shell, configuration, provider definitions, and the health contract. This keeps later SerpApi and optimization work independently verifiable.

## 2026-09-26 — Native Node HTTP server

No web framework or HTTP client was present. The first phase uses Node's built-in HTTP module and adds no runtime dependency. A framework can be evaluated once compare/optimize routing and request validation are implemented.
