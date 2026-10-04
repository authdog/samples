<script>
  export let data;
</script>

<main>
  <p>Signed in as {data.user?.emails?.[0]?.value}</p>
  <p>
    <a href="/">Home</a>
    {" · "}
    <a href="/logout">Sign out</a>
  </p>
</main>
