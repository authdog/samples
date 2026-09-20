# Implementation Plan: Wave 3 Lidar

**Branch**: `013-wave-3-lidar` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

## Summary

Ship four copyable Lidar starters: signed webhook, in-memory step-up
mark, 428 challenge. Update the root listing. This completes Wave 3.

## Technical Context

**Language/Version**: Go 1.25, Java 11+, .NET 8, Python 3.10+

**Primary Dependencies**: Gin, FastAPI, JDK HttpServer, HttpListener

**Storage**: In-memory delivery IDs and step-up marks

**Testing**: Compile; webhook 401/200; 428 then clear then 200

**Target Platform**: Localhost HTTP starters

**Constraints**: Challenge not block; no Signals API; no authn/authz

**Scale/Scope**: Four folders under `lidar/`

## Constitution Check

- I–VII PASS (one concept per stack; documented HMAC; after Wave 3
  observability)

## Project Structure

```text
lidar/go/
lidar/java/
lidar/csharp/
lidar/python/
README.md
```
