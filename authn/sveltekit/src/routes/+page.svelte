<script>
  import { page } from "$app/stores";

  const publicKey = import.meta.env.PUBLIC_AUTHDOG_PUBLIC_KEY;
  let signinUri = null;
  if (publicKey) {
    try {
      const payload = JSON.parse(
        atob(publicKey.replace("pk_", "")),
      );
      signinUri = `${payload.identityHost}/signin/${payload.environmentId}`;
    } catch {
      signinUri = null;
    }
  }
</script>

<main>
  <h1>authdog authentication (SvelteKit)</h1>
  <p>
    This starter proves identity only. A signed-in session is not a
    permission grant.
  </p>
  {#if signinUri}
    <p>
      <a href={signinUri}>Sign in with the hosted Account portal</a>
      {" · "}
      <a href="/profile">Profile</a>
    </p>
  {:else}
    <p>
      Set <code>PUBLIC_AUTHDOG_PUBLIC_KEY</code> in <code>.env</code> to a
      <code>pk_...</code> public key.
    </p>
  {/if}
</main>
