import { createFileRoute } from "@tanstack/react-router";
import { listEvents } from "../../lib/events";

export const Route = createFileRoute("/api/events")({
  server: {
    handlers: {
      GET: async () => {
        const apiToken = process.env.AUTHDOG_API_TOKEN;
        const tenantId = process.env.AUTHDOG_TENANT_ID;
        const environmentId = process.env.AUTHDOG_ENVIRONMENT_ID;
        if (!apiToken || !tenantId || !environmentId) {
          return Response.json(
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
          return Response.json({
            count: page.events.length,
            after: page.after,
            events: page.events,
          });
        } catch (error) {
          return Response.json(
            { error: (error as Error).message },
            { status: 502 },
          );
        }
      },
    },
  },
});
