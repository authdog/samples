# authdog observability on java

Smallest JDK HTTP starter for Authdog observability: a signed-webhook
receiver and an Events API read path. There is no official Java
observability SDK — this sample uses the documented HMAC and REST
surface. It does **not** depend on `authdog-java-sdk`.

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

All four are server-only secrets. Copy `.env.example` to `.env` and
export them before you run the server.

Java **11+** and Maven are required.

## Run

```bash
export AUTHDOG_API_TOKEN=... AUTHDOG_WEBHOOK_SECRET=... \
  AUTHDOG_TENANT_ID=... AUTHDOG_ENVIRONMENT_ID=...
mvn -q package
java -jar target/authdog-observability-java-0.1.0.jar
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

- **Raw body first**: the handler reads the request bytes before JSON.
  Parsing JSON first breaks verification.
- **Verification order is fixed**: raw body → parse `t`/`v1` → reject
  stale `t` (5-minute tolerance) → HMAC → constant-time compare → only
  then parse JSON.
- **Idempotency**: this sample dedupes on `X-Authdog-Delivery-Id` in
  memory — use a durable store in production.
- **Maven needs a JDK**: if `mvn package` reports `release version 11
  not supported`, point `JAVA_HOME` at a JDK (not a JRE-only install).
- **The signing secret is sensitive**: restrict the API token, never
  expose it to a browser, and don't log it.
- SIEM forwarding is not Lidar.

## Next concept

Lidar integration for this stack is Present: [`lidar/java`](../../lidar/java/).
