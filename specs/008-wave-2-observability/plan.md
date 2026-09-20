# Implementation Plan: Wave 2 Observability

**Branch**: `008-wave-2-observability` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship seven copyable observability starters on the Wave 2 stacks.
Server-capable stacks get an in-app verified webhook receiver plus an
Events API read path. Browser-only stacks get a minimal companion Node
receiver, clearly labeled server-side.

## Technical Context

**Language/Version**: TypeScript, Node 20+, SvelteKit 2, Vue 3,
TanStack Start 1, Angular 20, Astro 5, Fastify 5

**Primary Dependencies**: stack frameworks; Node `crypto` for HMAC

**Storage**: In-memory delivery-ID dedupe (documented non-durable)

**Testing**: Install + type-check/build each sample

**Constraints**: Real API surface; secrets server-only; no authn,
authz, or Lidar detectors

**Scale/Scope**: Seven folders under `observability/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented Events API + webhook spec)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS
- V. Security boundaries — PASS (secrets server-only)
- VI. Wave-gated delivery — PASS (Wave 2 after Wave 2 authz)
- VII. Spec Kit — PASS

## Project Structure

```text
observability/sveltekit/
observability/vue/          # companion Node receiver
observability/tanstack-start/
observability/angular/      # companion Node receiver
observability/astro/
observability/fastify/
observability/node/
README.md                   # Wave 2 observability → Present
```
