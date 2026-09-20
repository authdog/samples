import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { listEvents } from "$lib/events";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async () => {
  const apiToken = env.AUTHDOG_API_TOKEN;
  const tenantId = env.AUTHDOG_TENANT_ID;
  const environmentId = env.AUTHDOG_ENVIRONMENT_ID;
  if (!apiToken || !tenantId || !environmentId) {
    return json(
      {
        error:
          "Set AUTHDOG_API_TOKEN, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID",
      },
      { status: 500 },
    );
  }

  try {
    const page = await listEvents({
      tenantId,
      environmentId,
      apiToken,
      limit: 20,
    });
    return json({ count: page.events.length, after: page.after, events: page.events });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 502 });
  }
};
