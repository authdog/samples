import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthdogProvider } from "@authdog/tanstack-start/client";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>authdog authz — TanStack Start</title>
        <style>{`body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 40rem; line-height: 1.5; } a, button { font: inherit; }`}</style>
      </head>
      <body>
        <AuthdogProvider>
          <Outlet />
        </AuthdogProvider>
        <Scripts />
      </body>
    </html>
  );
}
