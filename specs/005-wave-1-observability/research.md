# Research: Wave 1 Observability

## Decision 1: Two surfaces, both documented

- **Events API** (pull):
  `GET /v1/tenants/{tenantId}/environments/{environmentId}/events`
  with `rangeStart`, `events`, `limit` (≤100), and opaque
  `list_metadata.after` cursor. Plus `.../events/types` for the
  catalog.
- **Webhooks** (push): generic notification channel delivers signed
  POSTs. Headers: `X-Authdog-Signature: t=..., v1=...`,
  `X-Authdog-Event-Type`, `X-Authdog-Delivery-Id`.

## Decision 2: Verification order is fixed

Raw body → parse `t`/`v1` → reject stale `t` → HMAC-SHA256 over
`t + "." + rawBody` → constant-time compare → only then parse JSON.
Delivery IDs deduped (in-memory set, documented as non-durable).

## Decision 3: No SDK for observability

There is no published JS observability SDK; the samples call the
documented REST endpoints with `fetch` and verify HMAC with Node
`crypto`. This satisfies "Real API Surface Only" — the doc is the
surface.

## Decision 4: Lidar is out of scope

Lidar Signals are console-only detectors; there is no public Signals
API. The READMEs state SIEM forwarding ≠ Lidar and link the concept.

## Decision 5: Per-stack wiring

- **Express**: `express.raw({ type: "application/json" })` on the
  webhook route to keep the raw body.
- **Next.js**: route handler reads `await request.text()` (raw) before
  `JSON.parse`.
- **Remix**: action reads `await request.text()` (raw) before
  `JSON.parse`.
