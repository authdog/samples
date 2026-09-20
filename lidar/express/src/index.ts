import "dotenv/config";
import express from "express";
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

const app = express();

// In-memory delivery-ID dedupe. NOT durable — use a datastore in production.
const seenDeliveries = new Set<string>();

// Demo only: a real app derives the subject from the authenticated session.
function callerSubject(req: express.Request): string | null {
  return req.header("X-Demo-User") ?? null;
}

app.get("/", (_req, res) => {
  res.json({
    sample: "authdog lidar on express",
    endpoints: [
      "POST /webhooks/authdog",
      "GET /sensitive (X-Demo-User)",
      "POST /step-up/complete (X-Demo-User)",
    ],
  });
});

// Webhook receiver: verify, then mark the event's subject for step-up.
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
    const subject = eventSubject(event);
    if (subject) {
      markForStepUp(subject);
      console.log(`[authdog] ${eventType}: marked ${subject} for step-up`);
    }
    res.status(200).json({ ok: true });
  },
);

// Sensitive route: challenge marked callers instead of blocking them.
app.get("/sensitive", (req, res) => {
  const subject = callerSubject(req);
  if (!subject) {
    res.status(401).json({ error: "Unauthenticated" });
    return;
  }
  if (requiresStepUp(subject)) {
    res.status(428).json({
      error: "Step-up required",
      challenge: "/step-up/complete",
      reason: "A security-relevant event was recorded for this subject.",
    });
    return;
  }
  res.json({ secret: "the sensitive resource" });
});

// Challenge completion. The sample stubs the challenge; wire a real one
// (WebAuthn, OTP, IdP step-up) in production.
app.post("/step-up/complete", (req, res) => {
  const subject = callerSubject(req);
  if (!subject) {
    res.status(401).json({ error: "Unauthenticated" });
    return;
  }
  clearStepUp(subject);
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`authdog lidar (express) on http://localhost:${port}`);
});
