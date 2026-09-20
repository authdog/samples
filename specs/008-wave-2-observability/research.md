# Research: Wave 2 Observability

## Decision 1: Same documented surface as Wave 1

Events API (cursor-paginated pull) + signed webhooks (HMAC push).
Verification order: raw body → parse `t`/`v1` → reject stale `t` →
HMAC-SHA256 → constant-time compare → parse JSON. Delivery IDs
deduped in memory (documented non-durable).

## Decision 2: Browser-only stacks get a companion receiver

Vue and Angular are browser-only; the signing secret and API token
must never reach the SPA bundle. Their samples ship a minimal
`node:http` receiver under `server/` that runs alongside the SPA, and
the README states observability is server-side.

## Decision 3: Node sample is two commands

`npm run receive` starts a standalone `node:http` webhook receiver;
`npm run events -- <args>` polls the Events API once and prints the
first page plus cursor.

## Decision 4: Per-stack wiring

- **SvelteKit**: `+server.ts` POST with raw `request.text()`;
  `GET /events` endpoint.
- **Astro**: API routes (`src/pages/api/`).
- **TanStack Start**: server route handlers.
- **Fastify**: `POST /webhooks/authdog` with a raw-body content
  parser; `GET /events`.
