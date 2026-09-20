<script setup lang="ts">
import { onMounted } from "vue";
import { useUser, useSignIn, useSignOut } from "@authdog/vue";

const publicKey = import.meta.env.VITE_AUTHDOG_PUBLIC_KEY as string;
const { user, isLoading, fetchUser } = useUser();
const { signIn } = useSignIn();
const { signOut } = useSignOut();

onMounted(() => {
  if (publicKey) fetchUser(publicKey);
});
</script>

<template>
  <main>
    <h1>authdog authentication (Vue)</h1>
    <p>
      Browser-only identity. This proves who the caller is; it is not a
      permission grant and does not protect a server route.
    </p>
    <p v-if="!publicKey">
      Set <code>VITE_AUTHDOG_PUBLIC_KEY</code> in <code>.env</code> to a
      <code>pk_...</code> public key.
    </p>
    <template v-else>
      <p v-if="isLoading">Loading…</p>
      <p v-else-if="user">Signed in as {{ user?.emails?.[0]?.value }}</p>
      <p v-else>Not signed in.</p>
      <p>
        <button v-if="!user" @click="signIn(publicKey)">Sign in</button>
        <button v-else @click="signOut()">Sign out</button>
      </p>
    </template>
  </main>
</template>
