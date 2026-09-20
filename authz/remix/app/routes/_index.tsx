import { Link, useRouteLoaderData } from "@remix-run/react";

type Identity = {
  user: { emails?: { value: string }[] } | null;
  isAuthenticated: boolean;
  signinUri: string;
};

export default function Index() {
  const identity = useRouteLoaderData<Identity>("root");

  return (
    <main>
      <h1>authdog authorization (Remix)</h1>
      <p>
        This starter proves a server-side allow/deny decision. Identity
        comes first; permission comes second.
      </p>
      {identity?.isAuthenticated ? (
        <p>Signed in as {identity.user?.emails?.[0]?.value}</p>
      ) : (
        <p>Not signed in</p>
      )}
      <p>
        {identity?.signinUri ? (
          <a href={identity.signinUri}>Sign in with the hosted Account portal</a>
        ) : (
          <span>Set PK_AUTHDOG in .env to a pk_... public key.</span>
        )}
        {" · "}
        <Link to="/invoices">Invoices</Link>
        {" · "}
        <Link to="/logout">Sign out</Link>
      </p>
      <p>
        <code>/invoices</code> redirects when unsigned-in, is 403 without
        the <code>invoices:read</code> permission, and renders with it.
      </p>
    </main>
  );
}
