# authdog observability on vue

Smallest observability companion for a Vue 3 SPA: a standalone
signed-webhook receiver that runs **alongside** the app.

## What this sample shows

Observability: receiving the identity event stream. Observability is
**server-side** — the signing secret must never reach the Vue bundle,
so this sample is a small Node receiver, not Vue code. Your SPA stays
unaware of it; the receiver is where you react to events (audit,
alerting, sync).

This is not Lidar — Lidar runs detectors inside Authdog and surfaces
Signals in the console.

## What you need first

A **webhook signing secret** (`AUTHDOG_WEBHOOK_SECRET`) from the
notification channel you create in the console. Server-only secret.
Set it in your shell or a `.env` you load yourself.

## Run

```bash
npm install
npm run receive
```

The receiver listens on http://localhost:3001 (the SPA's dev server
stays on 5173).

## What to try

1. Create a webhook channel pointing at
   `https://<your-tunnel>/webhooks/authdog`, then send a test event.
   The receiver logs the verified event type and delivery ID.
2. Send a delivery with a bad signature → `401 Invalid signature`.

## Gotchas

- **Server-side only**: never put the signing secret in the Vue app or
  any `VITE_` variable. This receiver is a separate Node process.
- **Raw body first**: the receiver concatenates the request chunks so
  the HMAC is computed over the exact bytes. Parsing JSON first breaks
  verification.
- **Verification order is fixed**: raw body → parse `t`/`v1` → reject
  stale `t` (5-minute tolerance) → HMAC → constant-time compare → only
  then parse JSON.
- **Idempotency**: retries and redelivery can repeat a delivery. This
  sample dedupes on `X-Authdog-Delivery-Id` in memory — use a durable
  store in production.
- SIEM forwarding is not Lidar.

## Next concept

Lidar integration for this stack is Planned: `lidar/vue`.
