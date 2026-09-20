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
      <h1>authdog authorization (Next.js)</h1>
      <p>
        This starter proves a server-side allow/deny decision. Identity
        comes first; permission comes second.
      </p>
      {signinUri ? (
        <p>
          <a href={signinUri}>Sign in with the hosted Account portal</a>
          {" · "}
          <Link href="/dashboard">Dashboard</Link>
          {" · "}
          <a href="/api/invoices">GET /api/invoices</a>
        </p>
      ) : (
        <p>
          Set <code>PK_AUTHDOG</code> and <code>NEXT_PUBLIC_PK_AUTHDOG</code> in
          <code> .env.local</code> to the same <code>pk_...</code> public key.
        </p>
      )}
      <p>
        <code>GET /api/invoices</code> is 401 without a session, 403 without
        the <code>invoices:read</code> permission, and 200 with it.
      </p>
    </main>
  );
}
