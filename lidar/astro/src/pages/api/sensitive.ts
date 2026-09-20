import type { APIRoute } from "astro";
import { requiresStepUp } from "../../lib/stepup";

export const GET: APIRoute = ({ request }) => {
  // Demo only: a real app derives the subject from the authenticated session.
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }
  if (requiresStepUp(subject)) {
    return Response.json(
      {
        error: "Step-up required",
        challenge: "/api/step-up/complete",
        reason: "A security-relevant event was recorded for this subject.",
      },
      { status: 428 },
    );
  }
  return Response.json({ secret: "the sensitive resource" });
};
