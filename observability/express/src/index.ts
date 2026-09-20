import "dotenv/config";
import express from "express";
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

const app = express();

// In-memory delivery-ID dedupe. NOT durable — use a datastore in production.
const seenDeliveries = new Set<string>();

app.get("/", (_req, res) => {
  res.json({
    sample: "authdog observability on express",
    endpoints: ["POST /webhooks/authdog", "GET /events"],
  });
});

// Webhook receiver. Raw body is required for signature verification.
app.post(
  "/webhooks/authdog",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const rawBody = req.body as Buffer;
    const signature = req.header("X-Authdog-Signature");
    const deliveryId = req.header("X-Authdog-Delivery-Id");
    const eventType = req.header("X-Authdog-Event-Type");

    if (!verifyAuthdogSignature(rawBody, signature, webhookSecret)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    if (deliveryId) {
      if (seenDeliveries.has(deliveryId)) {
        res.status(200).json({ ok: true, duplicate: true });
        return;
      }
      seenDeliveries.add(deliveryId);
    }

    // Only now is the payload trusted.
    const event = JSON.parse(rawBody.toString("utf8"));
    console.log(`[authdog] ${eventType} (${deliveryId}):`, event.id ?? "");
    res.status(200).json({ ok: true });
  },
);

// Events API read path: first page plus the opaque cursor.
app.get("/events", async (_req, res) => {
  try {
    const page = await listEvents({
      tenantId,
      environmentId,
      apiToken,
      limit: 20,
    });
    res.json({ count: page.events.length, after: page.after, events: page.events });
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`authdog observability (express) on http://localhost:${port}`);
});
