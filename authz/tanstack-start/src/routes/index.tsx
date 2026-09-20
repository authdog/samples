import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <h1>authdog authorization (TanStack Start)</h1>
      <p>
        This starter proves a server-side allow/deny decision. Identity comes
        first; permission comes second.
      </p>
      <p>
        <code>/invoices</code> redirects without a session, is 403 without{" "}
        <code>invoices:read</code>, and 200 with it.
      </p>
      <p>
        <Link to="/invoices">Invoices</Link>
      </p>
    </main>
  );
}
