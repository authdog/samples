import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { requiresStepUp } from "$lib/stepup";

export const GET: RequestHandler = ({ request }) => {
  // Demo only: a real app derives the subject from the authenticated session.
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return json({ error: "Unauthenticated" }, { status: 401 });
  }
  if (requiresStepUp(subject)) {
    return json(
      {
        error: "Step-up required",
        challenge: "/step-up/complete",
        reason: "A security-relevant event was recorded for this subject.",
      },
      { status: 428 },
    );
  }
  return json({ secret: "the sensitive resource" });
};
