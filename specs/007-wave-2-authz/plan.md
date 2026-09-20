# Implementation Plan: Wave 2 Authorization

**Branch**: `007-wave-2-authz` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship seven copyable authorization starters on the Wave 2 stacks.
Server-capable stacks authenticate, then check `user.permissions` for
`invoices:read`. Browser-only stacks show a UI hint and point to a
backend for enforcement.

## Technical Context

**Language/Version**: TypeScript, Node 20+, SvelteKit 2, Vue 3,
TanStack Start 1, Angular 20, Astro 5, Fastify 5

**Primary Dependencies**: `@authdog/sveltekit`, `@authdog/vue`,
`@authdog/tanstack-start`, `@authdog/angular`, `@authdog/astro`,
`@authdog/fastify`, `@authdog/node-commons`

**Storage**: N/A

**Testing**: Install + type-check/build each sample

**Target Platform**: Localhost starters

**Project Type**: Seven independent sample apps

**Constraints**: Real API surface; fail-closed; UI hints labeled; no
authn flows, observability, or Lidar

**Scale/Scope**: Seven folders under `authz/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented claims + `useAuthz`)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS (authn first, then
  the decision)
- V. Security boundaries — PASS (pk only; server-side decision)
- VI. Wave-gated delivery — PASS (Wave 2 after Wave 2 authn)
- VII. Spec Kit — PASS

## Project Structure

```text
authz/sveltekit/
authz/vue/
authz/tanstack-start/
authz/angular/
authz/astro/
authz/fastify/
authz/node/
README.md         # Wave 2 authz → Present
```
