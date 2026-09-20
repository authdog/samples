# Implementation Plan: Wave 2 Lidar

**Branch**: `009-wave-2-lidar` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship seven copyable Lidar-integration starters on the Wave 2 stacks.
Each verifies signed security events, marks the subject for step-up,
and challenges the next sensitive request. Browser-only stacks get a
companion Node server. Lidar Signals stay in the console.

## Technical Context

**Language/Version**: TypeScript, Node 20+, SvelteKit 2, Vue 3,
TanStack Start 1, Angular 20, Astro 5, Fastify 5

**Primary Dependencies**: stack frameworks; Node `crypto` for HMAC

**Storage**: In-memory step-up marks (documented non-durable)

**Testing**: Install + type-check/build each sample

**Constraints**: Real API surface; no Signals API; challenge, not
block; secrets server-only

**Scale/Scope**: Seven folders under `lidar/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented webhook + recipe)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS
- V. Security boundaries — PASS (signing secret server-only)
- VI. Wave-gated delivery — PASS (Wave 2 after Wave 2 observability)
- VII. Spec Kit — PASS

## Project Structure

```text
lidar/sveltekit/
lidar/vue/              # companion Node server
lidar/tanstack-start/
lidar/angular/          # companion Node server
lidar/astro/
lidar/fastify/
lidar/node/
README.md               # Wave 2 lidar → Present
```
