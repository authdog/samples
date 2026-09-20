import { NextResponse } from "next/server";
import { clearStepUp } from "@/lib/stepup";

// Challenge completion. The sample stubs the challenge; wire a real one
// (WebAuthn, OTP, IdP step-up) in production.
export async function POST(request: Request) {
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  clearStepUp(subject);
  return NextResponse.json({ ok: true });
}
