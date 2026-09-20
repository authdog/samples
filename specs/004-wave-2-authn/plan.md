# Implementation Plan: Wave 2 Authentication

**Branch**: `004-wave-2-authn` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship seven copyable authentication starters on the Wave 2 stacks using
their official packages. Server-capable stacks validate the session;
browser-only stacks label the guard as UX. Update the root catalog.

## Technical Context

**Language/Version**: TypeScript, Node 20+, SvelteKit 2, Vue 3,
TanStack Start 1, Angular 20, Astro 5, Fastify 5

**Primary Dependencies**: `@authdog/sveltekit`, `@authdog/vue`,
`@authdog/tanstack-start`, `@authdog/angular`, `@authdog/astro`,
`@authdog/fastify`, `@authdog/node-sdk`

**Storage**: N/A

**Testing**: Install + type-check/build each sample

**Target Platform**: Localhost starters

**Project Type**: Seven independent sample apps

**Constraints**: Real API surface; public key only; no authz; no
observability or Lidar

**Scale/Scope**: Seven folders under `authn/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (official packages only)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS
- V. Security boundaries — PASS (pk only)
- VI. Wave-gated delivery — PASS (Wave 2 after Wave 1 authn)
- VII. Spec Kit — PASS

## Project Structure

```text
authn/sveltekit/
authn/vue/
authn/tanstack-start/
authn/angular/
authn/astro/
authn/fastify/
authn/node/
README.md         # Wave 2 authn → Present
```
