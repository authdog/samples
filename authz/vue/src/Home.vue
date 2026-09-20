<script setup lang="ts">
import { onMounted } from "vue";
import { useUser, useSignIn, useSignOut, useAuthz } from "@authdog/vue";

const publicKey = import.meta.env.VITE_AUTHDOG_PUBLIC_KEY as string;
const { user, isLoading, fetchUser } = useUser();
const { signIn } = useSignIn();
const { signOut } = useSignOut();
// UI hint only — enforcement belongs on a backend.
const { hasPermission } = useAuthz();

onMounted(() => {
  if (publicKey) fetchUser(publicKey);
});
</script>

<template>
  <main>
    <h1>authdog authorization (Vue)</h1>
    <p>
      Browser-only permission <em>hint</em>. Showing or hiding UI is not a
      security boundary — enforce access on a backend.
    </p>
    <p v-if="!publicKey">
      Set <code>VITE_AUTHDOG_PUBLIC_KEY</code> in <code>.env</code> to a
      <code>pk_...</code> public key.
    </p>
    <template v-else>
      <p v-if="isLoading">Loading…</p>
      <template v-else-if="user">
        <p>Signed in as {{ user?.emails?.[0]?.value }}</p>
        <section v-if="hasPermission('invoices:read')">
          <h2>Invoices</h2>
          <ul>
            <li>inv_001 — 1200 (paid)</li>
            <li>inv_002 — 340 (open)</li>
          </ul>
        </section>
        <p v-else>You don't have <code>invoices:read</code>. Panel hidden.</p>
        <p><button @click="signOut()">Sign out</button></p>
      </template>
      <p v-else>
        <button @click="signIn(publicKey)">Sign in</button>
      </p>
    </template>
  </main>
</template>
