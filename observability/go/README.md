# authdog observability on go

Smallest Gin starter for Authdog observability: a signed-webhook
receiver and an Events API read path. There is no official Go
observability SDK — this sample uses the documented HMAC and REST
surface.

## What this sample shows

Observability: consuming the identity event stream. Webhooks push
signed events to you; the Events API pulls them with cursor
pagination. This is not Lidar — Lidar runs detectors inside Authdog
and surfaces Signals in the console.

## What you need first

- An **API token** (`AUTHDOG_API_TOKEN`) scoped to read events.
- A **webhook signing secret** (`AUTHDOG_WEBHOOK_SECRET`) from the
  notification channel you create in the console.
- Your **tenant** and **environment** IDs.

All four are server-only secrets. Copy `.env.example` to `.env`.
Export them before you run the server.

Go **1.25+** is required.

## Run

```bash
go mod download
export AUTHDOG_API_TOKEN=... AUTHDOG_WEBHOOK_SECRET=... \
  AUTHDOG_TENANT_ID=... AUTHDOG_ENVIRONMENT_ID=...
go run .
```

The server listens on http://localhost:3000

## What to try

1. Create a webhook channel pointing at
   `https://<your-tunnel>/webhooks/authdog` (use a tunnel for local
   delivery), then send a test event. The server logs the verified
   event type and delivery ID.
2. `curl http://localhost:3000/events` → the first page of events and
   the opaque `after` cursor.
3. Send a delivery with a bad signature → `401 Invalid signature`.

## Gotchas

- **Raw body first**: `GetRawData` keeps the exact bytes. Parsing
  JSON first breaks verification.
- **Verification order is fixed**: raw body → parse `t`/`v1` → reject
  stale `t` (5-minute tolerance) → HMAC → constant-time compare → only
  then parse JSON.
- **Idempotency**: this sample dedupes on `X-Authdog-Delivery-Id` in
  memory — use a durable store in production.
- **The signing secret is sensitive**: restrict the API token, never
  expose it to a browser, and don't log it.
- SIEM forwarding is not Lidar.

## Next concept

Lidar integration for this stack is Present: [`lidar/go`](../../lidar/go/).
