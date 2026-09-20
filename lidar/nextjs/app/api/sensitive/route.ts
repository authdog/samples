import { NextResponse } from "next/server";
import { requiresStepUp } from "@/lib/stepup";

export async function GET(request: Request) {
  // Demo only: a real app derives the subject from the authenticated session.
  const subject = request.headers.get("X-Demo-User");
  if (!subject) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  if (requiresStepUp(subject)) {
    return NextResponse.json(
      {
        error: "Step-up required",
        challenge: "/api/step-up/complete",
        reason: "A security-relevant event was recorded for this subject.",
      },
      { status: 428 },
    );
  }
  return NextResponse.json({ secret: "the sensitive resource" });
}
