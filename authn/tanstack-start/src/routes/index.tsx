import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { identity } = Route.useRouteContext();
  return (
    <main>
      <h1>authdog authentication (TanStack Start)</h1>
      <p>
        This starter proves identity only. A signed-in session is not a
        permission grant.
      </p>
      {identity?.isAuthenticated ? (
        <p>
          Signed in as {identity.user?.emails?.[0]?.value}{" "}
          <a href="/api/logout">Sign out</a>
        </p>
      ) : (
        <p>
          Not signed in.{" "}
          {identity?.signinUri ? (
            <a href={identity.signinUri}>Sign in with the hosted Account portal</a>
          ) : (
            <span>
              Set <code>PK_AUTHDOG</code> in <code>.env</code>.
            </span>
          )}
        </p>
      )}
    </main>
  );
}
