import { getServerSidePayloadPublicKey } from "@authdog/nextjs-app/server";
import Link from "next/link";

function hostedSignInUri(publicKey: string): string | null {
  try {
    const { identityHost, environmentId } =
      getServerSidePayloadPublicKey(publicKey);
    return `${identityHost}/signin/${environmentId}`;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const publicKey = process.env.PK_AUTHDOG;
  const signinUri = publicKey ? hostedSignInUri(publicKey) : null;

  return (
    <main>
      <h1>authdog authentication (Next.js)</h1>
      <p>
        This starter proves identity only. A signed-in session is not a
        permission grant.
      </p>
      {signinUri ? (
        <p>
          <a href={signinUri}>Sign in with the hosted Account portal</a>
          {" · "}
          <Link href="/dashboard">Dashboard</Link>
        </p>
      ) : (
        <p>
          Set <code>PK_AUTHDOG</code> and <code>NEXT_PUBLIC_PK_AUTHDOG</code> in
          <code> .env.local</code> to the same <code>pk_...</code> public key.
        </p>
      )}
    </main>
  );
}
