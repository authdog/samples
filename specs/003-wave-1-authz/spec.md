# Feature Specification: Wave 1 Authorization

**Feature Branch**: `003-wave-1-authz`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Scaffold authz examples for the coming wave (Wave 1 stacks: nextjs, remix, express)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Next.js route allows or denies by permission (Priority: P1)

A developer copies `authz/nextjs`, sets the public key, signs in through hosted auth, and calls a protected route that returns 401 without a session, 403 without the required permission, and 200 with it. The sample uses the documented user claims (`roles` / `permissions`) from the validated session.

**Why this priority**: Next.js is the flagship Wave 1 stack.

**Independent Test**: Follow `authz/nextjs/README.md` only. `GET /api/invoices` without a session is 401; with a session lacking `invoices:read` it is 403; with the permission it is 200.

**Acceptance Scenarios**:

1. **Given** no session, **When** `GET /api/invoices` runs, **Then** the response is 401.
2. **Given** a valid session whose user lacks `invoices:read`, **When** the route runs, **Then** the response is 403.
3. **Given** a valid session whose user has `invoices:read`, **When** the route runs, **Then** the response is 200 with sample data.

---

### User Story 2 - Remix loader allows or denies by permission (Priority: P1)

A developer copies `authz/remix` and opens an invoices route. Unsigned-in visitors go to hosted sign-in; signed-in visitors without `invoices:read` see 403; with it they see the list.

**Why this priority**: Remix is the second Wave 1 session SDK.

**Independent Test**: Follow `authz/remix/README.md` only. `/invoices` redirects when unsigned-in, 403s without the permission, and renders with it.

**Acceptance Scenarios**:

1. **Given** no session, **When** `/invoices` loads, **Then** the user is redirected to hosted sign-in.
2. **Given** a valid session without `invoices:read`, **When** `/invoices` loads, **Then** the response is 403.
3. **Given** a valid session with `invoices:read`, **When** `/invoices` loads, **Then** the page renders the sample list.

---

### User Story 3 - Express requirePermission gate (Priority: P1)

A developer copies `authz/express` and confirms `GET /invoices` is 401 without a session, 403 without the permission, and 200 with it, after `requireAuth` has validated the session.

**Why this priority**: Express is the Wave 1 server gate other stacks pair with.

**Independent Test**: Follow `authz/express/README.md` only. The three status codes are observable with curl.

**Acceptance Scenarios**:

1. **Given** no session, **When** `GET /invoices` runs, **Then** the response is 401.
2. **Given** a valid session without `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 403.
3. **Given** a valid session with `invoices:read`, **When** `GET /invoices` runs, **Then** the response is 200 with sample data.

---

### Edge Cases

- Claim names vary by environment; READMEs MUST say to adjust the accessor to the token shape.
- A missing `roles` or `permissions` array means deny (403), not allow.
- No unpublished helpers (`userCan`, `requirePermission` from `@authdog/express`, etc.) are used.
- ABAC and FGA are out of scope; the sample names the environment model but uses RBAC claims.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authz/nextjs`, `authz/remix`, and `authz/express` MUST exist and reuse the Wave 1 authentication pattern.
- **FR-002**: Each sample MUST validate the session first (Next.js server session cookie, Remix `identityLoader`, Express `requireAuth`) before any permission check.
- **FR-003**: Each sample MUST gate one protected route on the permission `invoices:read` read from the validated user claims, returning 401 unauthenticated, 403 without the permission, 200 with it.
- **FR-004**: Samples MUST NOT use unpublished or stubbed helpers (for example `userCan` or an Express `requirePermission` export).
- **FR-005**: Each sample MUST include `README.md` with the constitution section order and `.env.example` with placeholders only.
- **FR-006**: Samples MUST NOT implement observability or Lidar.
- **FR-007**: The root catalog MUST mark Wave 1 `authz` cells `Present` and leave `observability` / `lidar` `Planned`.

### Key Entities

- **Wave 1 authz sample**: A copyable folder at `authz/<stack>` for `nextjs`, `remix`, or `express`.
- **Permission claim**: `permissions` (and `roles`) on the validated user object; names may vary per environment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from clone to observing 401 / 403 / 200 on each stack in under ten minutes once they have a public key and a user with and without `invoices:read`.
- **SC-002**: Each README is usable without opening any other repo file.
- **SC-003**: No sample allows a protected route without the required permission.
- **SC-004**: The catalog shows Wave 1 authorization as Present and does not mark observability or Lidar Present.

## Assumptions

- The environment uses RBAC for this sample; ABAC and FGA are later concepts.
- The user object exposes `permissions` and `roles` arrays, as in the official access-control guide.
- Wave 1 authn samples are Present.
- Node 20+ is available.
