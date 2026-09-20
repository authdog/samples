declare global {
  namespace App {
    interface Locals {
      authdog: import("@authdog/sveltekit/server").AuthdogLocals;
    }
  }
}

export {};
