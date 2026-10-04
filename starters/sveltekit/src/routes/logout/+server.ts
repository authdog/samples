import { createAuthdogServer } from "@authdog/sveltekit/server";
import type { RequestHandler } from "./$types";

const authdog = createAuthdogServer({
  publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY,
});

export const GET: RequestHandler = ({ request }) => authdog.logout(request);
