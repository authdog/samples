import "dotenv/config";
import Fastify from "fastify";
import { verifyAuthdogSignature } from "./verify.js";
import { listEvents } from "./events.js";

const apiToken = process.env.AUTHDOG_API_TOKEN;
const webhookSecret = process.env.AUTHDOG_WEBHOOK_SECRET;
const tenantId = process.env.AUTHDOG_TENANT_ID;
const environmentId = process.env.AUTHDOG_ENVIRONMENT_ID;

if (!apiToken || !webhookSecret || !tenantId || !environmentId) {
  console.error(
    "Set AUTHDOG_API_TOKEN, AUTHDOG_WEBHOOK_SECRET, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID in .env.",
  );
  process.exit(1);
}

const app = Fastify({ logger: true });

// Raw body for the webhook route — the HMAC is over the exact bytes.
app.addContentTypeParser(
  "application/json",
  { parseAs: "buffer" },
  (_req, body, done) => done(null, body),
);

// In-memory delivery-ID dedupe. NOT durable — use a datastore in production.
const seenDeliveries = new Set<string>();

app.get("/", async () => ({
  sample: "authdog observability on fastify",
  endpoints: ["POST /webhooks/authdog", "GET /events"],
}));

app.post("/webhooks/authdog", async (req, reply) => {
  const rawBody = req.body as Buffer;
  const signature = req.headers["x-authdog-signature"] as string | undefined;
  const deliveryId = req.headers["x-authdog-delivery-id"] as string | undefined;
  const eventType = req.headers["x-authdog-event-type"] as string | undefined;

  if (!verifyAuthdogSignature(rawBody, signature, webhookSecret)) {
    return reply.status(401).send({ error: "Invalid signature" });
  }

  if (deliveryId) {
    if (seenDeliveries.has(deliveryId)) {
      return { ok: true, duplicate: true };
    }
    seenDeliveries.add(deliveryId);
  }

  // Only now is the payload trusted.
  const event = JSON.parse(rawBody.toString("utf8"));
  req.log.info(`[authdog] ${eventType} (${deliveryId}): ${event.id ?? ""}`);
  return { ok: true };
});

app.get("/events", async (_req, reply) => {
  try {
    const page = await listEvents({
      tenantId,
      environmentId,
      apiToken,
      limit: 20,
    });
    return { count: page.events.length, after: page.after, events: page.events };
  } catch (error) {
    return reply.status(502).send({ error: (error as Error).message });
  }
});

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
