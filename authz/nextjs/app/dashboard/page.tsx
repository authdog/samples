"use client";

import { useUser } from "@authdog/nextjs-app";
import Link from "next/link";
import { SignOut } from "./sign-out";

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <p>Loading…</p>;
  if (!user) {
    return (
      <main>
        <p>Not signed in</p>
        <p>
          <Link href="/">Back</Link>
        </p>
      </main>
    );
  }

  return (
    <main>
      <p>Signed in as {user.emails?.[0]?.value}</p>
      <p>
        <a href="/api/invoices">GET /api/invoices</a>
        {" · "}
        <SignOut />
        {" · "}
        <Link href="/">Home</Link>
      </p>
    </main>
  );
}
