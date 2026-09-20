import type { LoaderFunctionArgs } from "@remix-run/node";
import { requiresStepUp } from "~/lib/stepup.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Demo only: a real app derives the subject from the authenticated session.
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }
  if (requiresStepUp(subject)) {
    return Response.json(
      {
        error: "Step-up required",
        challenge: "/step-up/complete",
        reason: "A security-relevant event was recorded for this subject.",
      },
      { status: 428 },
    );
  }
  return Response.json({ secret: "the sensitive resource" });
}
