import type { APIRoute } from "astro";
import { createAuthdogServer } from "@authdog/astro/server";

const authdog = createAuthdogServer({
  publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY ?? "",
});

export const GET: APIRoute = ({ request }) => authdog.logout(request);
