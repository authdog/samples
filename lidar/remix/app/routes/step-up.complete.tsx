import type { ActionFunctionArgs } from "@remix-run/node";
import { clearStepUp } from "~/lib/stepup.server";

// Challenge completion. The sample stubs the challenge; wire a real one
// (WebAuthn, OTP, IdP step-up) in production.
export async function action({ request }: ActionFunctionArgs) {
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return Response.json({ error: "Unauthenticated" }, { status: 401 });
  }
  clearStepUp(subject);
  return Response.json({ ok: true });
}
