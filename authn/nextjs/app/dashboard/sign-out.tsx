"use client";

import { clearAuthdogSession } from "@authdog/nextjs-app/client";

export function SignOut() {
  async function onClick() {
    await fetch("/logout");
    clearAuthdogSession();
    window.location.href = "/";
  }

  return (
    <button type="button" onClick={() => void onClick()}>
      Sign out
    </button>
  );
}
