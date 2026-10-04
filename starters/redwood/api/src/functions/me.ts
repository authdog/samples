import { createAuthdog } from "@authdog/redwood/api";
import type { LambdaEvent } from "@authdog/redwood/api";

const publicKey = process.env.PK_AUTHDOG;
if (!publicKey) {
  throw new Error("Set PK_AUTHDOG to your environment public key (pk_...)");
}

const authdog = createAuthdog({ publicKey });

export const handler = authdog.requireAuth(async (event: LambdaEvent) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user: event.authdog?.user ?? null }),
}));
