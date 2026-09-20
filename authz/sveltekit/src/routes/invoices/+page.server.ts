import { createAuthdogServer } from "@authdog/sveltekit/server";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { hasPermission, REQUIRED_PERMISSION } from "$lib/authz";

const authdog = createAuthdogServer({
  publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY,
});

export const load: PageServerLoad = async ({ request }) => {
  const identity = await authdog.getUser(request).catch(() => null);
  if (!identity) {
    throw redirect(302, "/");
  }
  if (!hasPermission(identity.user, REQUIRED_PERMISSION)) {
    throw error(403, { message: "Forbidden", missing: [REQUIRED_PERMISSION] });
  }
  return {
    invoices: [
      { id: "inv_001", amount: 1200, status: "paid" },
      { id: "inv_002", amount: 340, status: "open" },
    ],
  };
};
