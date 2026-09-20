# Implementation Plan: Wave 1 Authorization

**Branch**: `003-wave-1-authz` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship three copyable RBAC authorization starters on the Wave 1 stacks.
Each validates the session first, then gates `invoices:read` from the
user claims, returning 401 / 403 / 200. No unpublished helpers.

## Technical Context

**Language/Version**: TypeScript, Node 20+, Next.js 15, Remix 2.16+,
Express 5

**Primary Dependencies**: `@authdog/nextjs-app`, `@authdog/remix-node`,
`@authdog/express`, `@authdog/node-commons`

**Storage**: N/A

**Testing**: Type-check/build each sample; confirm 401 without a
session

**Target Platform**: Localhost starters

**Project Type**: Three independent sample apps

**Constraints**: Real API surface; claims-based RBAC only; no
observability or Lidar

**Scale/Scope**: Three folders under `authz/`

## Constitution Check

- I. One sample per concept per stack — PASS (`authz/<stack>`)
- II. Real API surface — PASS (documented claims pattern; no stubs)
- III. Quickstart, not a product — PASS (one gated route each)
- IV. Authentication is not authorization — PASS (this feature is the
  server-side allow/deny)
- V. Security boundaries — PASS (pk only)
- VI. Wave-gated delivery — PASS (Wave 1 authz after authn)
- VII. Spec Kit — PASS

## Project Structure

```text
authz/nextjs/     # /api/invoices gated by user_session_* cookie
authz/remix/      # /invoices loader gated by identityLoader claims
authz/express/    # /invoices gated by requireAuth + permissions
README.md         # Wave 1 authz → Present
```
