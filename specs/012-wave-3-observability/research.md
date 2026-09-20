# Research: Wave 3 Observability

## Decision 1: Documented REST + HMAC, no SDK

There is no official observability package on any Wave 3 stack.
Samples verify `X-Authdog-Signature` and call
`GET /v1/tenants/{tenantId}/environments/{environmentId}/events`
exactly as Wave 1/2. Java and C# stay on the JDK / BCL so they do
not pull source-only identity SDKs.

## Decision 2: In-app vs standalone HTTP

- Go (Gin) and Python (FastAPI): one process, `POST /webhooks/authdog`
  and `GET /events`.
- Java and C#: standalone HTTP servers with the same two routes
  (not identity CLIs).

## Decision 3: Verification order is fixed

Raw body → parse `t`/`v1` → reject stale `t` (300s) → HMAC-SHA256
over `t + "." + rawBody` → constant-time compare → only then JSON.
Dedupe `X-Authdog-Delivery-Id` in memory.

## Decision 4: Python does not install the FastAPI extra

Observability does not use `authdog.fastapi`. Pin `fastapi` and
`uvicorn` only.
