# Implementation Plan: Wave 1 Lidar

**Branch**: `006-wave-1-lidar` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship three copyable Lidar-integration starters on the Wave 1 stacks.
Each verifies signed security events, marks the subject for step-up,
and challenges the next sensitive request. Lidar Signals stay in the
console; these samples react to the event stream, per the documented
recipe.

## Technical Context

**Language/Version**: TypeScript, Node 20+, Next.js 15, Remix 2,
Express 5

**Primary Dependencies**: `express`, `next`, `@remix-run/node`; Node
`crypto` for HMAC

**Storage**: In-memory step-up marks (documented as non-durable)

**Testing**: Install + type-check/build each sample

**Target Platform**: Localhost starters

**Project Type**: Three independent sample apps

**Constraints**: Real API surface; no Signals API; challenge, not
block; secrets server-only

**Scale/Scope**: Three folders under `lidar/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented webhook + recipe; no
  invented Signals API)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS (no authz)
- V. Security boundaries — PASS (signing secret server-only)
- VI. Wave-gated delivery — PASS (Wave 1 stacks)
- VII. Spec Kit — PASS

## Project Structure

```text
lidar/nextjs/
lidar/remix/
lidar/express/
README.md         # Wave 1 lidar → Present
```
