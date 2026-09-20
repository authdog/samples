import { createFileRoute } from "@tanstack/react-router";
import { verifyAuthdogSignature } from "../../../lib/verify";
import { markForStepUp, eventSubject } from "../../../lib/stepup";

const seenDeliveries = new Set<string>();

export const Route = createFileRoute("/api/webhooks/authdog")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.AUTHDOG_WEBHOOK_SECRET;
        if (!secret) {
          return Response.json(
            { error: "Set AUTHDOG_WEBHOOK_SECRET" },
            { status: 500 },
          );
        }

        const rawBody = await request.text();
        const signature = request.headers.get("X-Authdog-Signature");
        const deliveryId = request.headers.get("X-Authdog-Delivery-Id");
        const eventType = request.headers.get("X-Authdog-Event-Type");

        if (!verifyAuthdogSignature(rawBody, signature, secret)) {
          return Response.json({ error: "Invalid signature" }, { status: 401 });
        }

        if (deliveryId) {
          if (seenDeliveries.has(deliveryId)) {
            return Response.json({ ok: true, duplicate: true });
          }
          seenDeliveries.add(deliveryId);
        }

        const event = JSON.parse(rawBody);
        const subject = eventSubject(event);
        if (subject) {
          markForStepUp(subject);
          console.log(`[authdog] ${eventType}: marked ${subject} for step-up`);
        }
        return Response.json({ ok: true });
      },
    },
  },
});
