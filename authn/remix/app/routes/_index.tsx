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
      <h1>authdog authentication (Remix)</h1>
      <p>
        This starter proves identity only. A signed-in session is not a
        permission grant.
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
        <Link to="/profile">Profile</Link>
        {" · "}
        <Link to="/logout">Sign out</Link>
      </p>
    </main>
  );
}
