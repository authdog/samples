# Feature Specification: Wave 3 Authorization

**Feature Branch**: `011-wave-3-authz`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Move with next wave implementation — Wave 3 authorization for go, java, csharp, and python."

## Context

Authorization is the allow/deny decision that follows authentication.
The decision reads `invoices:read` from the validated userinfo
`permissions` claim. Missing or non-array claims deny (fail-closed).
Authentication is not authorization.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Go permission gate (Priority: P1)

A developer copies `authz/go`, sets the public key, and confirms
`GET /invoices` is 401 without a session, 403 without `invoices:read`,
and 200 with it. `RequireAuth` runs first. The permission helper is
local — the Go module has no `RequirePermission` export.

**Independent Test**: Follow `authz/go/README.md` only. The three
status codes are observable with curl.

**Acceptance Scenarios**:

1. **Given** no session, **When** `GET /invoices` runs, **Then** the response is 401.
2. **Given** a valid session without `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 403.
3. **Given** a valid session with `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 200 with sample invoices.

---

### User Story 2 - Java permission CLI (Priority: P1)

A developer copies `authz/java`, passes a bearer token, and sees
allow/deny for `invoices:read`. Identity comes from the official
userinfo call. The published `User` type does not model
`permissions`; the sample reads that claim from the same userinfo
envelope via the official `request` helper. Source-only install.

**Independent Test**: Follow `authz/java/README.md` only.

**Acceptance Scenarios**:

1. **Given** a bad token, **When** they run the command, **Then** it reports 401 and exits non-zero.
2. **Given** a valid token without `invoices:read`, **When** they run the command, **Then** it reports 403 Forbidden.
3. **Given** a valid token with `invoices:read`, **When** they run the command, **Then** it reports allow.

---

### User Story 3 - C# permission CLI (Priority: P1)

Same contract as Java, using `GetUserInfoAsync` for identity and
`RequestAsync` for the userinfo envelope so `user.permissions` can
be read. Source-only install.

**Independent Test**: Follow `authz/csharp/README.md` only.

**Acceptance Scenarios**:

1. **Given** a bad token, **When** they run the command, **Then** it reports 401 and exits non-zero.
2. **Given** a valid token without `invoices:read`, **When** they run the command, **Then** it reports 403 Forbidden.
3. **Given** a valid token with `invoices:read`, **When** they run the command, **Then** it reports allow.

---

### User Story 4 - Python permission gate (Priority: P1)

A developer copies `authz/python`, installs the pinned FastAPI extra,
sets the public key, and confirms `GET /invoices` is 401 / 403 / 200.
`require_auth` runs first. The permission dependency is local.

**Independent Test**: Follow `authz/python/README.md` only.

**Acceptance Scenarios**:

1. **Given** no session, **When** `GET /invoices` runs, **Then** the response is 401.
2. **Given** a valid session without `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 403.
3. **Given** a valid session with `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 200 with sample invoices.

---

### Edge Cases

- Missing or non-array `permissions` → deny.
- Claim names vary by environment; READMEs say to adjust the accessor.
- No unpublished helpers (`RequirePermission`, `userCan`).
- Java and C# MUST NOT invent a permissions field on the typed `User`.
- Source-only labels stay for Java, C#, and Python.
- Observability and Lidar are out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authz/go`, `authz/java`, `authz/csharp`, and `authz/python` MUST exist.
- **FR-002**: Go and Python MUST authenticate first (`RequireAuth` / `require_auth`), then check `invoices:read` on `user.permissions`, returning 401 / 403 / 200.
- **FR-003**: Java and C# MUST prove identity via userinfo, then allow or deny `invoices:read` from the userinfo `permissions` claim (fail-closed).
- **FR-004**: Permission checks MUST be local sample code. Samples MUST NOT invent SDK helpers.
- **FR-005**: Each sample MUST include `README.md` with the constitution section order. `.env.example` when env vars are needed.
- **FR-006**: Samples MUST NOT implement observability or Lidar.
- **FR-007**: The root listing MUST add the four Wave 3 authorization samples and leave Wave 3 observability and Lidar planned.

### Key Entities

- **Wave 3 authz sample**: A copyable folder at `authz/<stack>` for `go`, `java`, `csharp`, or `python`.
- **Permission claim**: `permissions` on the validated userinfo user; names may vary per environment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can observe allow/deny in under ten minutes once they have the credential that sample documents and a user with and without `invoices:read`.
- **SC-002**: Each README is usable without opening any other repo file.
- **SC-003**: No sample allows the protected action without the required permission.
- **SC-004**: The listing shows Wave 3 authorization as present and does not mark observability or Lidar present.

## Assumptions

- Wave 3 authentication is Present.
- The environment uses RBAC claims for this sample.
- Go User is the decoded userinfo object (`map`); Python user is a dict.
- The published Java/C# `User` type does not model `permissions`; the envelope still carries the claim.
- Source-only pins stay the same as Wave 3 authn.
