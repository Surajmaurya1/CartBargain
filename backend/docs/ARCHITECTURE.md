# Architecture

## Phase 1 boundary

Phase 1 established the TypeScript service boundary, centralized configuration, provider registry, error-envelope types, and health endpoint. Phase 2 added the validated SerpApi boundary and reliability primitives. Phase 3 adds deterministic parsing, planning, provider filtering, normalized offers, demo execution, and `POST /api/compare`. Basket generation, optimization, and React integration remain deferred.

The service will use a native Node HTTP server unless an existing frontend framework is introduced. This avoids adding an HTTP dependency before the repository has an application shell.

## Planned request flow

`React -> API validation -> search planner -> SerpApi client -> normalization -> basket/optimizer -> React`

All external calls will be isolated behind services and will use timeouts, bounded retries, and structured errors. The process-local cache and circuit breaker will be added with the SerpApi client phase.
