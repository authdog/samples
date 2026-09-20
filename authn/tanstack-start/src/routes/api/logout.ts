import { createFileRoute } from "@tanstack/react-router";
import { logoutLoader } from "@authdog/tanstack-start";

export const Route = createFileRoute("/api/logout")({
  server: {
    handlers: {
      GET: async ({ request }) => logoutLoader({ request }),
    },
  },
});
