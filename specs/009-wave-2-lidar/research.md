# Research: Wave 2 Lidar

## Decision 1: Same recipe as Wave 1

No Signals API. React to verified security events with a step-up
challenge (HTTP 428), not a block. Reuse the observability verifier
(trimmed `t=, v1=` parser, 5-minute replay tolerance, constant-time
compare).

## Decision 2: Browser-only stacks get a companion server

Vue and Angular cannot host a signing secret. Their samples ship a
`server/` Node process with the webhook, sensitive, and challenge
routes. The README states Lidar integration is server-side.

## Decision 3: Subject from a header in the sample

Same as Wave 1: the caller's subject is `X-Demo-User`. A real app
derives it from the authenticated session.

## Decision 4: Per-stack wiring

- **SvelteKit**: `+server.ts` endpoints; `$env/dynamic/private`.
- **Astro**: API routes.
- **TanStack Start**: server route handlers.
- **Fastify**: raw-body content parser + routes.
- **Node**: one `node:http` server.
