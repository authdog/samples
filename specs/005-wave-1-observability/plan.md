# Implementation Plan: Wave 1 Observability

**Branch**: `005-wave-1-observability` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship three copyable observability starters on the Wave 1 stacks. Each
verifies signed webhooks (HMAC over raw body, constant-time compare,
replay tolerance, idempotent delivery IDs) and lists events through
the Events API with cursor pagination.

## Technical Context

**Language/Version**: TypeScript, Node 20+, Next.js 15, Remix 2,
Express 5

**Primary Dependencies**: `express`, `next`, `@remix-run/node`; Node
`crypto` for HMAC

**Storage**: In-memory delivery-ID dedupe (documented as
non-durable)

**Testing**: Install + type-check/build each sample

**Target Platform**: Localhost starters

**Project Type**: Three independent sample apps

**Constraints**: Real API surface; secrets server-only; no authn,
authz, or Lidar detectors

**Scale/Scope**: Three folders under `observability/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented Events API + webhook spec)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS (no authz)
- V. Security boundaries — PASS (API token + signing secret
  server-only)
- VI. Wave-gated delivery — PASS (Wave 1 stacks)
- VII. Spec Kit — PASS

## Project Structure

```text
observability/nextjs/
observability/remix/
observability/express/
README.md         # Wave 1 observability → Present
```
