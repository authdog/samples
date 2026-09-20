import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: "2rem auto",
          maxWidth: "40rem",
          lineHeight: 1.5,
        }}
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
