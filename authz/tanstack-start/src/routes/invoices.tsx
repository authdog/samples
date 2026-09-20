import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { identityLoader } from "@authdog/tanstack-start";
import { hasPermission, REQUIRED_PERMISSION } from "../lib/authz";

const loadIdentity = identityLoader();

const getInvoices = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  const response = await loadIdentity({ request: getRequest() });
  const identity = await response.json();

  if (!identity?.isAuthenticated) {
    throw redirect({ to: "/" });
  }
  if (!hasPermission(identity.user, REQUIRED_PERMISSION)) {
    return { forbidden: true as const, missing: [REQUIRED_PERMISSION] };
  }
  return {
    forbidden: false as const,
    invoices: [
      { id: "inv_001", amount: 1200, status: "paid" },
      { id: "inv_002", amount: 340, status: "open" },
    ],
  };
});

export const Route = createFileRoute("/invoices")({
  loader: () => getInvoices(),
  component: Invoices,
});

function Invoices() {
  const data = Route.useLoaderData();
  return (
    <main>
      <h1>Invoices</h1>
      {data.forbidden ? (
        <p>403 Forbidden — missing {data.missing.join(", ")}.</p>
      ) : (
        <ul>
          {data.invoices.map((invoice) => (
            <li key={invoice.id}>
              {invoice.id} — {invoice.amount} ({invoice.status})
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link to="/">Home</Link>
      </p>
    </main>
  );
}
