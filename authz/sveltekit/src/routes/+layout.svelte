<script>
  import { onMount } from "svelte";
  import { initAuthdog } from "@authdog/sveltekit/client";

  onMount(() => initAuthdog());
</script>

<slot />
