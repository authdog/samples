# Implementation Plan: Wave 3 Observability

**Branch**: `012-wave-3-observability` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship four copyable observability starters: signed webhook receiver
plus Events API pull. Update the root listing.

## Technical Context

**Language/Version**: Go 1.25, Java 11+, .NET 8, Python 3.10+

**Primary Dependencies**: Gin (Go), FastAPI (Python), JDK HttpServer
(Java), HttpListener (C#). No Authdog identity SDK.

**Storage**: In-memory delivery-ID set (non-durable)

**Testing**: Compile/type-check; signed and unsigned webhook POST

**Target Platform**: Localhost HTTP starters

**Project Type**: Four independent sample apps

**Constraints**: Real HMAC/REST surface; server-only secrets; no Lidar

**Scale/Scope**: Four folders under `observability/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (documented Events & webhooks)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS (this is events)
- V. Security boundaries — PASS (no sk in client; secrets server-only)
- VI. Wave-gated delivery — PASS (after Wave 3 authn/authz)
- VII. Spec Kit — PASS

## Project Structure

```text
observability/go/
observability/java/
observability/csharp/
observability/python/
README.md
```
