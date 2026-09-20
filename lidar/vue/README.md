# authdog lidar on vue

Smallest Lidar companion for a Vue 3 SPA: a standalone Node server
that verifies signed events, marks the subject, and challenges the
next sensitive request.

## What this sample shows

Lidar integration is **server-side**. Lidar monitors run inside
Authdog and surface Signals **in the console** — there is no public
Signals API. The signing secret must never reach the Vue bundle, so
this sample is a small Node server, not Vue code. It implements the
documented recipe: react with a challenge, not a block.

## What you need first

A **webhook signing secret** (`AUTHDOG_WEBHOOK_SECRET`) from the
notification channel you create in the console. Server-only secret.
Set it in your shell or a `.env` you load yourself.

To see real detections, request Lidar on the environment and enable a
monitor (e.g. `impossible_travel`) under Lidar → Monitors.

## Run

```bash
npm install
npm start
```

The companion listens on http://localhost:3001 (the SPA's dev server
stays on 5173).

## What to try

1. Create a webhook channel pointing at
   `https://<your-tunnel>/webhooks/authdog` and subscribe to sign-in
   events. Send a test event whose `data.user.id` is `u123`.
2. `curl -H "X-Demo-User: u123" http://localhost:3001/sensitive` →
   `428 Step-up required` with a challenge payload.
3. `curl -X POST -H "X-Demo-User: u123" http://localhost:3001/step-up/complete`
   → clears the mark.
4. Repeat step 2 → the sensitive resource.

## Gotchas

- **Server-side only**: never put the signing secret in the Vue app or
  any `VITE_` variable. This receiver is a separate Node process.
- **No Signals API**: Lidar Signals are console-only. This sample
  reacts to the event stream; triage the Signal itself in Lidar →
  Signals.
- **Challenge, not block**: a real user on a VPN can look like
  impossible travel. Return a step-up challenge; don't block outright.
- **Raw body first**: the receiver concatenates the request chunks so
  the HMAC is computed over the exact bytes.
- **In-memory marks are not durable**: use a datastore in production.
  A real app also derives the subject from the authenticated session,
  not the `X-Demo-User` header.
- **The challenge is stubbed**: wire a real one (WebAuthn, OTP, IdP
  step-up) in production.

## Next concept

This completes Wave 2 for `vue`. See the catalog for other stacks.
