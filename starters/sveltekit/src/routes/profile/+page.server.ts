import { createAuthdogServer } from "@authdog/sveltekit/server";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const authdog = createAuthdogServer({
  publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY,
});

export const load: PageServerLoad = async ({ request }) => {
  const identity = await authdog.getUser(request).catch(() => null);
  if (!identity) {
    throw redirect(302, "/");
  }
  return { user: identity.user };
};
