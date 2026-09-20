<script setup lang="ts">
import { AuthdogProvider } from "@authdog/vue/client";
import Home from "./Home.vue";
</script>

<template>
  <AuthdogProvider>
    <Home />
  </AuthdogProvider>
</template>
