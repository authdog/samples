import { NextResponse } from "next/server";
import { listEvents } from "@/lib/events";

export async function GET() {
  const apiToken = process.env.AUTHDOG_API_TOKEN;
  const tenantId = process.env.AUTHDOG_TENANT_ID;
  const environmentId = process.env.AUTHDOG_ENVIRONMENT_ID;
  if (!apiToken || !tenantId || !environmentId) {
    return NextResponse.json(
      {
        error:
          "Set AUTHDOG_API_TOKEN, AUTHDOG_TENANT_ID, and AUTHDOG_ENVIRONMENT_ID",
      },
      { status: 500 },
    );
  }

  try {
    const page = await listEvents({
      tenantId,
      environmentId,
      apiToken,
      limit: 20,
    });
    return NextResponse.json({
      count: page.events.length,
      after: page.after,
      events: page.events,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 502 },
    );
  }
}
