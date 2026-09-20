# Feature Specification: Wave 2 Authorization

**Feature Branch**: `007-wave-2-authz`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Wave 2 authorization for sveltekit, vue, tanstack-start, angular, astro, fastify, and node."

## Context

Authorization is the server-side allow/deny decision that follows
authentication. The decision reads the caller's permissions from the
validated userinfo claims (`user.permissions`). Browser-only stacks
cannot enforce server-side; their samples show a UI hint and state
that enforcement belongs on a backend.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - SvelteKit permission gate (Priority: P1)

A developer copies `authz/sveltekit`, signs in, and confirms
`/invoices` is 403 without `invoices:read` and 200 with it.

**Independent Test**: Follow `authz/sveltekit/README.md` only.

### User Story 2 - Astro permission gate (Priority: P1)

Same for `authz/astro` on a server page.

**Independent Test**: Follow `authz/astro/README.md` only.

### User Story 3 - TanStack Start permission gate (Priority: P1)

Same for `authz/tanstack-start` in a server loader.

**Independent Test**: Follow `authz/tanstack-start/README.md` only.

### User Story 4 - Fastify permission gate (Priority: P1)

Same for `authz/fastify` with a `requirePermission` preHandler after
`requireAuth`.

**Independent Test**: Follow `authz/fastify/README.md` only.

### User Story 5 - Node permission check (Priority: P1)

`authz/node` validates a token, reads `user.permissions`, and prints
allow/deny for `invoices:read`.

**Independent Test**: Follow `authz/node/README.md` only.

### User Story 6 - Vue permission UI hint (Priority: P2)

`authz/vue` shows/hides an invoices panel with
`useAuthz().hasPermission`, labeled as UI-only.

**Independent Test**: Follow `authz/vue/README.md` only.

### User Story 7 - Angular permission UI hint (Priority: P2)

`authz/angular` shows/hides an invoices panel from the user's
permissions, labeled as UI-only.

**Independent Test**: Follow `authz/angular/README.md` only.

---

### Edge Cases

- Missing permission claim → deny (fail-closed).
- Browser-only samples MUST NOT claim server-side enforcement.
- No unpublished helpers are used.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authz/{sveltekit,vue,tanstack-start,angular,astro,fastify,node}` MUST exist.
- **FR-002**: Server-capable samples MUST authenticate first, then
  check `user.permissions` for `invoices:read`, returning 403 without
  it.
- **FR-003**: Browser-only samples MUST label the check as a UI hint
  and state enforcement belongs on a backend.
- **FR-004**: Each sample MUST include `README.md` with the
  constitution section order and `.env.example` with placeholders
  only.
- **FR-005**: Samples MUST NOT implement authentication flows,
  observability, or Lidar.
- **FR-006**: The root catalog MUST mark Wave 2 `authz` cells
  `Present`.

### Key Entities

- **Wave 2 authz sample**: A copyable folder at `authz/<stack>`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can see the allow/deny decision in under ten
  minutes once they have a public key.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: Server-capable samples never return the resource without
  the permission.
- **SC-004**: The catalog shows Wave 2 authorization as Present.

## Assumptions

- Official agent-skills and the authorization concept doc are the API
  source of truth.
- Node 20+ is available.
- Wave 1 authz and Wave 2 authn are Present.
