import { createAuthdogHandle } from "@authdog/sveltekit/server";

export const handle = createAuthdogHandle({
  publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY,
});
