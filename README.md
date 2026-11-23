# Observability Lab

Observability guild's playground to mess around with tools, configs and app instrumentation.

The goal is a small, controlled app to practice with monitoring tools and compare their developer
experience and configuration tweaks. It is built in increments, starting from a **completely
uninstrumented baseline**.

## Architecture

```
browser ──► frontend-react (nginx :8080) ──/api/*──► backend-express (Node :3000)
              static Vite build                       GET /api/books (in-memory)
                                                      GET /health
```

| App                    | Stack                                                              | Notes                                                                                                 |
| ---------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `apps/frontend-react`  | React 19, TypeScript, Vite (`react-ts` template)                   | Production build served by nginx, which proxies `/api/` to the backend (same origin, no CORS)         |
| `apps/backend-express` | Node 24, Express 5, TypeScript (ESM)                               | Single endpoint returning books from memory, graceful shutdown on `SIGTERM`                           |
| `apps/frontend-expo`   | Expo SDK 58, React Native, Expo Router, TanStack Query, axios, zod | Mobile app, runs in Expo Go (no native build). Calls the backend directly, not through docker compose |

Apps are named `(frontend|backend)-<stack>` so that equivalent apps in other stacks can be added
side by side to compare instrumentation across languages.

[Bun](https://bun.sh) is used as the **package manager** only; the backend runs on Node.

## Run with Docker

```sh
docker compose up --build
```

- App: http://localhost:8080
- Backend directly: http://localhost:3000/api/books

## Develop on the host

Requires Bun and Node 24 (see `.nvmrc`).

```sh
cd apps/backend-express && bun install && bun run dev   # http://localhost:3000
cd apps/frontend-react  && bun install && bun run dev   # http://localhost:5173, proxies /api to :3000
cd apps/frontend-expo   && bun install && bun run start # scan the QR code with Expo Go, or press i / a for a simulator
```

## Logging

All apps log with [pino](https://getpino.io) using the same schema. Field names follow OpenTelemetry
resource conventions so the logs can be mapped directly when they are shipped to a telemetry backend later.

```json
{
  "level": "info",
  "time": "2026-01-01T12:00:00.000Z",
  "service.name": "backend-express",
  "deployment.environment": "production",
  "msg": "..."
}
```

| App               | Output                                                                                                                                                             | Level                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `backend-express` | One JSON object per line on stdout. Every request (except `/health`) logs a `request completed` line with `req.id`, method, url, `res.status_code`, `responseTime` | `LOG_LEVEL` env (default `info`)                                                   |
| `frontend-react`  | Structured objects in the browser devtools console (app start, books fetch)                                                                                        | `VITE_LOG_LEVEL` at build time (default `debug` in dev, `info` in builds)          |
| `frontend-expo`   | Structured objects in the JS console: Metro terminal and React Native DevTools (app start, books fetch)                                                            | `EXPO_PUBLIC_LOG_LEVEL` at bundle time (default `debug` in dev, `info` in release) |

The backend reuses an incoming `X-Request-Id` header as `req.id` (or generates a UUID) and echoes it in the
response.

`bun run dev` pretty-prints backend logs. To read container logs:

```sh
docker compose logs -f backend-express | bunx pino-pretty
```
