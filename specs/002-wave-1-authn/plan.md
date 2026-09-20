# Implementation Plan: Wave 1 Authentication

**Branch**: `002-wave-1-authn` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship three copyable authentication starters that match the official
Authdog quickstarts: Next.js App Router (`@authdog/nextjs-app`), Remix
v2 (`@authdog/remix-node`), and Express (`@authdog/express`). Identity
only. Update the root catalog Wave 1 `authn` cells to Present.

## Technical Context

**Language/Version**: TypeScript, Node 20+, Next.js 15, Remix 2.16+,
Express 5

**Primary Dependencies**: `@authdog/nextjs-app`, `@authdog/remix-node`,
`@authdog/express` (published npm)

**Storage**: N/A (session cookies / bearer set by Authdog SDKs)

**Testing**: Install + type-check/build each sample; Express `GET /me`
without a session is 401 when a valid key is present

**Target Platform**: Localhost starters developers copy out

**Project Type**: Three independent sample apps

**Performance Goals**: Smallest runnable starter per constitution III

**Constraints**: Real API surface; public key only; no authz; no secrets

**Scale/Scope**: Three folders under `authn/`

## Constitution Check

- I. One sample per concept per stack — PASS (`authn/<stack>` only)
- II. Real API surface — PASS (official packages and documented helpers)
- III. Quickstart, not a product — PASS (one identity page each)
- IV. Authentication is not authorization — PASS (no permission checks)
- V. Security boundaries — PASS (pk only; requireAuth / loader check
  labeled as identity gates, not authz)
- VI. Wave-gated delivery — PASS (Wave 1 authn first)
- VII. Spec Kit — PASS (this feature)

## Project Structure

```text
authn/nextjs/     # App Router + middleware + /dashboard
authn/remix/      # Vite Remix + identityLoader + /profile
authn/express/    # createAuthdog + /me + /logout
README.md         # Wave 1 authn → Present
```

**Structure Decision**: Independent apps, no shared workspace.
