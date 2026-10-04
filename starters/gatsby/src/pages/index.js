import React from "react";
import { initAuthdog } from "@authdog/gatsby/client";

export default function Home() {
  async function loadMe() {
    const token = initAuthdog();
    const response = await fetch("/api/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const body = await response.text();
    document.getElementById("me").textContent = `${response.status} ${body}`;
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", margin: "2rem" }}>
      <h1>Resource library</h1>
      <p>
        The public page stays open. <code>src/api/me</code> uses{" "}
        <code>requireAuth</code>. Authentication is not authorization.
      </p>
      <button type="button" onClick={loadMe}>
        GET /api/me
      </button>
      <pre id="me" />
    </main>
  );
}
