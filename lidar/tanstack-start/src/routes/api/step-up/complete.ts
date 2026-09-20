import { createFileRoute } from "@tanstack/react-router";
import { clearStepUp } from "../../../lib/stepup";

export const Route = createFileRoute("/api/step-up/complete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const subject = request.headers.get("X-Demo-User");
        if (!subject) {
          return Response.json({ error: "Unauthenticated" }, { status: 401 });
        }
        clearStepUp(subject);
        return Response.json({ ok: true });
      },
    },
  },
});
