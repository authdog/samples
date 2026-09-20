# Implementation Plan: Wave 3 Authentication

**Branch**: `010-wave-3-authn` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship four copyable authentication starters on the Wave 3 language
stacks. Go (Gin) and Python (FastAPI, source-only) validate a
session. Java and C# validate a bearer token they already have.
Update the root listing.

## Technical Context

**Language/Version**: Go 1.25, Java 11+, .NET 7+, Python 3.10+

**Primary Dependencies**: `github.com/authdog/web-sdk/packages/go`
(pin `52466b0888a2c369264c6af19ca1da3bd9804dda`),
`com.authdog:authdog-java-sdk` and `Authdog.Sdk` from a pinned
`authdog/sdk` checkout (not on Maven Central or NuGet),
`authdog-fastapi[fastapi]` from a pinned `web-sdk` checkout

**Storage**: N/A

**Testing**: Install + compile/type-check each sample

**Target Platform**: Localhost starters and CLIs

**Project Type**: Four independent sample apps

**Constraints**: Real API surface; no invented registry installs;
public key only where the SDK uses it; no authz; no observability
or Lidar

**Scale/Scope**: Four folders under `authn/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS (official modules; Python labeled source-only)
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS
- V. Security boundaries — PASS (pk only on Go/Python; token argv on Java/C#; no sk)
- VI. Wave-gated delivery — PASS (Wave 3 after Wave 1–2 authn)
- VII. Spec Kit — PASS

## Project Structure

```text
authn/go/
authn/java/
authn/csharp/
authn/python/
README.md         # Wave 3 authn rows added
```
