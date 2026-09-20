import { defineMiddleware } from "astro:middleware";
import { authdogMiddleware } from "@authdog/astro/server";

export const onRequest = defineMiddleware(
  authdogMiddleware({
    publicKey: import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY ?? "",
  }),
);
