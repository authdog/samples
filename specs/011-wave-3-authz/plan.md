# Implementation Plan: Wave 3 Authorization

**Branch**: `011-wave-3-authz` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship four copyable authorization starters on the Wave 3 stacks.
Go and Python gate `GET /invoices` after identity. Java and C#
print allow/deny for `invoices:read` after userinfo. Update the
root listing.

## Technical Context

**Language/Version**: Go 1.25, Java 11+, .NET 8, Python 3.10+

**Primary Dependencies**: Same pins as Wave 3 authn

**Storage**: N/A

**Testing**: Install + compile/type-check each sample

**Target Platform**: Localhost starters and CLIs

**Project Type**: Four independent sample apps

**Constraints**: Real API surface; local permission helper; fail-closed;
no observability or Lidar

**Scale/Scope**: Four folders under `authz/`

## Constitution Check

- I. One sample per concept per stack — PASS
- II. Real API surface — PASS
- III. Quickstart, not a product — PASS
- IV. Authentication is not authorization — PASS
- V. Security boundaries — PASS
- VI. Wave-gated delivery — PASS (after Wave 3 authn)
- VII. Spec Kit — PASS

## Project Structure

```text
authz/go/
authz/java/
authz/csharp/
authz/python/
README.md
```
