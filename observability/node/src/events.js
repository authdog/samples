/**
 * Events API poller (documented REST surface).
 * https://www.authdog.com/docs/events-webhooks
 *
 * Usage:
 *   AUTHDOG_API_TOKEN=... AUTHDOG_TENANT_ID=... AUTHDOG_ENVIRONMENT_ID=... \
 *     node src/events.js [after-cursor]
 */

const apiToken = process.env.AUTHDOG_API_TOKEN;
const tenantId = process.env.AUTHDOG_TENANT_ID;
const environmentId = process.env.AUTHDOG_ENVIRONMENT_ID;
const after = process.argv[2];

if (!apiToken || !tenantId || !environmentId) {
  console.error(
    "Set AUTHDOG_API_TOKEN, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID.",
  );
  process.exit(1);
}

const url = new URL(
  `https://api.authdog.com/v1/tenants/${tenantId}/environments/${environmentId}/events`,
);
url.searchParams.set("limit", "20");
if (after) url.searchParams.set("after", after);

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${apiToken}` },
});
if (!res.ok) {
  console.error(`Events API ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const body = await res.json();
const events = body.data ?? body.events ?? [];
const cursor = body.list_metadata?.after ?? null;

console.log(`Fetched ${events.length} event(s).`);
for (const event of events) {
  console.log(`  ${event.created_at}  ${event.event}  (${event.id})`);
}
console.log(`Next cursor (list_metadata.after): ${cursor ?? "null — done"}`);
