<script>
  export let data;
</script>

<main>
  <h1>Invoices</h1>
  <ul>
    {#each data.invoices as invoice}
      <li>{invoice.id} — {invoice.amount} ({invoice.status})</li>
    {/each}
  </ul>
  <p>
    <a href="/">Home</a>
    {" · "}
    <a href="/logout">Sign out</a>
  </p>
</main>
