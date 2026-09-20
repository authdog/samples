import { useLoaderData, Link } from "@remix-run/react";
import { identityLoader } from "@authdog/remix-node";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

const REQUIRED_PERMISSION = "invoices:read";

type AuthdogUserClaims = {
  permissions?: string[];
  roles?: string[];
  emails?: { value: string }[];
};

const loadIdentity = identityLoader();

export const loader = async (args: LoaderFunctionArgs) => {
  const response = await loadIdentity(args);
  if (!(response instanceof Response)) {
    throw new Response("Identity loader failed", { status: 500 });
  }
  const identity = (await response.json()) as {
    user: AuthdogUserClaims | null;
    isAuthenticated: boolean;
    signinUri: string;
  };

  if (!identity.isAuthenticated) throw redirect(identity.signinUri);

  const permissions = Array.isArray(identity.user?.permissions)
    ? identity.user.permissions
    : [];
  if (!permissions.includes(REQUIRED_PERMISSION)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return {
    user: identity.user,
    invoices: [
      { id: "inv_001", amount: 1200, status: "paid" },
      { id: "inv_002", amount: 340, status: "open" },
    ],
  };
};

export default function Invoices() {
  const { user, invoices } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Invoices</h1>
      <p>Signed in as {user?.emails?.[0]?.value}</p>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            {invoice.id} — {invoice.amount} ({invoice.status})
          </li>
        ))}
      </ul>
      <p>
        <Link to="/">Home</Link>
        {" · "}
        <Link to="/logout">Sign out</Link>
      </p>
    </main>
  );
}
