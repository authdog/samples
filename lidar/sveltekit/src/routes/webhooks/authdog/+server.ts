import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { verifyAuthdogSignature } from "$lib/verify";
import { markForStepUp, eventSubject } from "$lib/stepup";
import { env } from "$env/dynamic/private";

// In-memory delivery-ID dedupe. NOT durable — use a datastore in production.
const seenDeliveries = new Set<string>();

export const POST: RequestHandler = async ({ request }) => {
  if (!env.AUTHDOG_WEBHOOK_SECRET) {
    return json({ error: "Set AUTHDOG_WEBHOOK_SECRET" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("X-Authdog-Signature");
  const deliveryId = request.headers.get("X-Authdog-Delivery-Id");
  const eventType = request.headers.get("X-Authdog-Event-Type");

  if (!verifyAuthdogSignature(rawBody, signature, env.AUTHDOG_WEBHOOK_SECRET)) {
    return json({ error: "Invalid signature" }, { status: 401 });
  }

  if (deliveryId) {
    if (seenDeliveries.has(deliveryId)) {
      return json({ ok: true, duplicate: true });
    }
    seenDeliveries.add(deliveryId);
  }

  const event = JSON.parse(rawBody);
  const subject = eventSubject(event);
  if (subject) {
    markForStepUp(subject);
    console.log(`[authdog] ${eventType}: marked ${subject} for step-up`);
  }
  return json({ ok: true });
};
