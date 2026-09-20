import "dotenv/config";
import Fastify from "fastify";
import { verifyAuthdogSignature } from "./verify.js";
import {
  markForStepUp,
  requiresStepUp,
  clearStepUp,
  eventSubject,
} from "./stepup.js";

const webhookSecret = process.env.AUTHDOG_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error("Set AUTHDOG_WEBHOOK_SECRET in .env.");
  process.exit(1);
}

const app = Fastify({ logger: true });

app.addContentTypeParser(
  "application/json",
  { parseAs: "buffer" },
  (_req, body, done) => done(null, body),
);

const seenDeliveries = new Set<string>();

function callerSubject(req: { headers: Record<string, unknown> }): string | null {
  const value = req.headers["x-demo-user"];
  return typeof value === "string" ? value : null;
}

app.get("/", async () => ({
  sample: "authdog lidar on fastify",
  endpoints: [
    "POST /webhooks/authdog",
    "GET /sensitive (X-Demo-User)",
    "POST /step-up/complete (X-Demo-User)",
  ],
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

  const event = JSON.parse(rawBody.toString("utf8"));
  const subject = eventSubject(event);
  if (subject) {
    markForStepUp(subject);
    req.log.info(`[authdog] ${eventType}: marked ${subject} for step-up`);
  }
  return { ok: true };
});

app.get("/sensitive", async (req, reply) => {
  const subject = callerSubject(req);
  if (!subject) {
    return reply.status(401).send({ error: "Unauthenticated" });
  }
  if (requiresStepUp(subject)) {
    return reply.status(428).send({
      error: "Step-up required",
      challenge: "/step-up/complete",
      reason: "A security-relevant event was recorded for this subject.",
    });
  }
  return { secret: "the sensitive resource" };
});

app.post("/step-up/complete", async (req, reply) => {
  const subject = callerSubject(req);
  if (!subject) {
    return reply.status(401).send({ error: "Unauthenticated" });
  }
  clearStepUp(subject);
  return { ok: true };
});

const port = Number(process.env.PORT ?? 3000);
await app.listen({ port, host: "0.0.0.0" });
