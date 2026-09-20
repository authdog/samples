# authdog lidar on python

Smallest FastAPI starter for reacting to Lidar-relevant identity
events with a step-up challenge. There is no official Python Lidar
SDK — this sample uses the documented HMAC surface. It does **not**
install the source-only identity extra.

## What this sample shows

Lidar integration: responding to the identity event stream when a
security-relevant event fires. Lidar monitors run inside Authdog and
surface Signals **in the console** — there is no public Signals API.
This sample implements the documented recipe: react with a challenge,
not a block.

## What you need first

A **webhook signing secret** (`AUTHDOG_WEBHOOK_SECRET`) from the
notification channel you create in the console. Server-only secret.
Copy `.env.example` to `.env` and export it before you run.

To see real detections, request Lidar on the environment and enable a
monitor (e.g. `impossible_travel`) under Lidar → Monitors.

Python **3.10+** is required.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export AUTHDOG_WEBHOOK_SECRET=...
uvicorn main:app --reload --port 3000
```

Open http://localhost:3000

## What to try

1. Create a webhook channel pointing at
   `https://<your-tunnel>/webhooks/authdog` and subscribe to sign-in
   events. Send a test event whose `data.user.id` is `u123`.
2. `curl -H "X-Demo-User: u123" http://localhost:3000/sensitive` →
   `428 Step-up required` with a challenge payload.
3. `curl -X POST -H "X-Demo-User: u123" http://localhost:3000/step-up/complete`
   → clears the mark.
4. Repeat step 2 → the sensitive resource.

## Gotchas

- **No Signals API**: Lidar Signals are console-only. This sample
  reacts to the event stream; triage the Signal itself in Lidar →
  Signals.
- **Challenge, not block**: a real user on a VPN can look like
  impossible travel. Return a step-up challenge; don't block outright.
- **Raw body first**: `await request.body()` keeps the exact bytes.
- **In-memory marks are not durable**: use a datastore in production.
  A real app also derives the subject from the authenticated session,
  not the `X-Demo-User` header.
- **The challenge is stubbed**: wire a real one (WebAuthn, OTP, IdP
  step-up) in production.

## Next concept

This completes Wave 3 for `python`. See the catalog for other stacks.
