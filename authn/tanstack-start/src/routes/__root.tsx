import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { identityLoader } from "@authdog/tanstack-start";
import { AuthdogProvider } from "@authdog/tanstack-start/client";
import type { ReactNode } from "react";

const loadIdentity = identityLoader();

const getIdentity = createServerFn({ method: "GET" }).handler(async () => {
  const request = (await import("@tanstack/react-start/server")).getRequest();
  const response = await loadIdentity({ request });
  return response.json();
});

export const Route = createRootRoute({
  loader: () => getIdentity(),
  component: RootComponent,
});

function RootComponent() {
  const identity = Route.useLoaderData();
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>authdog authn — TanStack Start</title>
        <style>{`body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 40rem; line-height: 1.5; } a, button { font: inherit; }`}</style>
      </head>
      <body>
        <AuthdogProvider>
          <Outlet context={{ identity }} />
        </AuthdogProvider>
        <Scripts />
      </body>
    </html>
  );
}
