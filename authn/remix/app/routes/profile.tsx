import { useLoaderData } from "@remix-run/react";
import { identityLoader } from "@authdog/remix-node";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";

const loadIdentity = identityLoader();

export const loader = async (args: LoaderFunctionArgs) => {
  const response = await loadIdentity(args);
  if (!(response instanceof Response)) {
    throw new Response("Identity loader failed", { status: 500 });
  }
  const identity = (await response.json()) as {
    user: { emails?: { value: string }[] } | null;
    isAuthenticated: boolean;
    signinUri: string;
  };
  if (!identity.isAuthenticated) throw redirect(identity.signinUri);
  return identity;
};

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <main>
      <p>Signed in as {user?.emails?.[0]?.value}</p>
      <p>
        <Link to="/">Home</Link>
        {" · "}
        <Link to="/logout">Sign out</Link>
      </p>
    </main>
  );
}
