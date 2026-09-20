import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { clearStepUp } from "$lib/stepup";

export const POST: RequestHandler = ({ request }) => {
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return json({ error: "Unauthenticated" }, { status: 401 });
  }
  clearStepUp(subject);
  return json({ ok: true });
};
