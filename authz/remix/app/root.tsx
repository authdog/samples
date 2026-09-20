import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import { AuthdogProvider, ReloadPage } from "@authdog/remix-node/client";
import { identityLoader } from "@authdog/remix-node";

export const loader = identityLoader();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          body { font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 40rem; line-height: 1.5; }
          a, button { font: inherit; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

export default function App() {
  return (
    <AuthdogProvider>
      <Outlet />
      <Scripts />
      <ReloadPage />
    </AuthdogProvider>
  );
}
