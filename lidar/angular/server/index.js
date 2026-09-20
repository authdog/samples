import http from "node:http";
import { verifyAuthdogSignature } from "./verify.js";
import {
  markForStepUp,
  requiresStepUp,
  clearStepUp,
  eventSubject,
} from "./stepup.js";

const webhookSecret = process.env.AUTHDOG_WEBHOOK_SECRET;
if (!webhookSecret) {
  console.error("Set AUTHDOG_WEBHOOK_SECRET.");
  process.exit(1);
}

const seenDeliveries = new Set();

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url ?? "/";
  const method = req.method ?? "GET";

  if (method === "GET" && url === "/") {
    json(res, 200, {
      sample: "authdog lidar companion on angular",
      endpoints: [
        "POST /webhooks/authdog",
        "GET /sensitive (X-Demo-User)",
        "POST /step-up/complete (X-Demo-User)",
      ],
    });
    return;
  }

  if (method === "POST" && url === "/webhooks/authdog") {
    const rawBody = await readBody(req);
    const signature = req.headers["x-authdog-signature"];
    const deliveryId = req.headers["x-authdog-delivery-id"];
    const eventType = req.headers["x-authdog-event-type"];

    if (!verifyAuthdogSignature(rawBody, signature, webhookSecret)) {
      json(res, 401, { error: "Invalid signature" });
      return;
    }

    if (deliveryId) {
      if (seenDeliveries.has(deliveryId)) {
        json(res, 200, { ok: true, duplicate: true });
        return;
      }
      seenDeliveries.add(deliveryId);
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const subject = eventSubject(event);
    if (subject) {
      markForStepUp(subject);
      console.log(`[authdog] ${eventType}: marked ${subject} for step-up`);
    }
    json(res, 200, { ok: true });
    return;
  }

  if (method === "GET" && url === "/sensitive") {
    const subject = req.headers["x-demo-user"];
    if (!subject) {
      json(res, 401, { error: "Unauthenticated" });
      return;
    }
    if (requiresStepUp(subject)) {
      json(res, 428, {
        error: "Step-up required",
        challenge: "/step-up/complete",
        reason: "A security-relevant event was recorded for this subject.",
      });
      return;
    }
    json(res, 200, { secret: "the sensitive resource" });
    return;
  }

  if (method === "POST" && url === "/step-up/complete") {
    const subject = req.headers["x-demo-user"];
    if (!subject) {
      json(res, 401, { error: "Unauthenticated" });
      return;
    }
    clearStepUp(subject);
    json(res, 200, { ok: true });
    return;
  }

  json(res, 404, { error: "Not found" });
});

const port = Number(process.env.PORT ?? 3001);
server.listen(port, () => {
  console.log(`authdog lidar companion (angular) on http://localhost:${port}`);
});
