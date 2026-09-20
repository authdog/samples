<script>
  const publicKey = import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY;
  let signinUri = null;
  if (publicKey) {
    try {
      const payload = JSON.parse(atob(publicKey.replace("pk_", "")));
      signinUri = `${payload.identityHost}/signin/${payload.environmentId}`;
    } catch {
      signinUri = null;
    }
  }
</script>

<main>
  <h1>authdog authorization (SvelteKit)</h1>
  <p>
    This starter proves a server-side allow/deny decision. Identity comes
    first; permission comes second.
  </p>
  <p>
    <code>/invoices</code> redirects without a session, is 403 without
    <code>invoices:read</code>, and 200 with it.
  </p>
  {#if signinUri}
    <p>
      <a href={signinUri}>Sign in with the hosted Account portal</a>
      {" · "}
      <a href="/invoices">Invoices</a>
    </p>
  {:else}
    <p>
      Set <code>PUBLIC_AUTHDOG_PUBLIC_KEY</code> in <code>.env</code> to a
      <code>pk_...</code> public key.
    </p>
  {/if}
</main>
