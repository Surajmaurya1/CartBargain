# BlinkBargain

BlinkBargain is a backend-first grocery basket comparison service. The repository is currently in Phase 2: validated SerpApi search foundation and reliability primitives.

## Local development

```text
npm install
npm run build
npm start
```

The initial endpoint is `GET /api/health`. SerpApi is optional during development; when no key is configured, the health response reports `serpApiConfigured: false`. Demo fixtures are available under `src/server/mock/serpapi` for later compare integration.
