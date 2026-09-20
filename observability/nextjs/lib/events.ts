/**
 * Minimal Events API client (documented REST surface).
 * https://www.authdog.com/docs/events-webhooks
 */
export type AuthdogEvent = {
  id: string;
  event: string;
  category?: string;
  created_at: string;
  organization_id?: string;
  data?: Record<string, unknown>;
};

export type ListEventsOptions = {
  tenantId: string;
  environmentId: string;
  apiToken: string;
  rangeStart?: string;
  events?: string[];
  limit?: number;
  after?: string;
};

export async function listEvents(opts: ListEventsOptions): Promise<{
  events: AuthdogEvent[];
  after: string | null;
}> {
  const url = new URL(
    `https://api.authdog.com/v1/tenants/${opts.tenantId}/environments/${opts.environmentId}/events`,
  );
  if (opts.rangeStart) url.searchParams.set("rangeStart", opts.rangeStart);
  if (opts.events?.length) url.searchParams.set("events", opts.events.join(","));
  url.searchParams.set("limit", String(Math.min(opts.limit ?? 20, 100)));
  if (opts.after) url.searchParams.set("after", opts.after);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${opts.apiToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Events API ${res.status}: ${await res.text()}`);
  }
  const body = (await res.json()) as {
    data?: AuthdogEvent[];
    events?: AuthdogEvent[];
    list_metadata?: { after?: string | null };
  };
  return {
    events: body.data ?? body.events ?? [],
    after: body.list_metadata?.after ?? null,
  };
}
