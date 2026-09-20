import type { APIRoute } from "astro";
import { clearStepUp } from "../../../lib/stepup";

export const POST: APIRoute = ({ request }) => {
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }
  clearStepUp(subject);
  return Response.json({ ok: true });
};
