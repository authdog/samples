import http from "node:http";
import { verifyAuthdogSignature } from "./verify.js";

const webhookSecret = process.env.AUTHDOG_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error("Set AUTHDOG_WEBHOOK_SECRET.");
  process.exit(1);
}

// In-memory delivery-ID dedupe. NOT durable — use a datastore in production.
const seenDeliveries = new Set();

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhooks/authdog") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end('{"error":"Not found"}');
    return;
  }

  // Collect the raw body first — the HMAC is over the exact bytes.
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const rawBody = Buffer.concat(chunks);
    const signature = req.headers["x-authdog-signature"];
    const deliveryId = req.headers["x-authdog-delivery-id"];
    const eventType = req.headers["x-authdog-event-type"];

    if (!verifyAuthdogSignature(rawBody, signature, webhookSecret)) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end('{"error":"Invalid signature"}');
      return;
    }

    if (deliveryId) {
      if (seenDeliveries.has(deliveryId)) {
        res.writeHead(200, { "content-type": "application/json" });
        res.end('{"ok":true,"duplicate":true}');
        return;
      }
      seenDeliveries.add(deliveryId);
    }

    // Only now is the payload trusted.
    const event = JSON.parse(rawBody.toString("utf8"));
    console.log(`[authdog] ${eventType} (${deliveryId}):`, event.id ?? "");
    res.writeHead(200, { "content-type": "application/json" });
    res.end('{"ok":true}');
  });
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => {
  console.log(`authdog webhook receiver on http://localhost:${port}/webhooks/authdog`);
});
