# Feature Specification: Wave 2 Lidar

**Feature Branch**: `009-wave-2-lidar`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Wave 2 Lidar for sveltekit, vue, tanstack-start, angular, astro, fastify, and node."

## Context

Lidar is Authdog's identity SIEM. Monitors run inside Authdog and
surface Signals in the console. There is **no public Signals API**;
the documented app-side integration is to react to security-relevant
identity events with a step-up or challenge, rather than blocking
outright. These samples implement that documented pattern on the
Wave 2 stacks.

Observability is server-side (signing secret). Browser-only stacks
(Vue, Angular) get a companion Node receiver that also hosts the
sensitive and challenge routes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - SvelteKit step-up (Priority: P1)

A developer copies `lidar/sveltekit`, sets a signing secret, and
receives verified security events. A marked subject hitting
`GET /sensitive` gets HTTP 428.

**Independent Test**: Follow `lidar/sveltekit/README.md` only.

### User Story 2 - Astro step-up (Priority: P1)

Same for `lidar/astro` via API routes.

### User Story 3 - TanStack Start step-up (Priority: P1)

Same for `lidar/tanstack-start` via server routes.

### User Story 4 - Fastify step-up (Priority: P1)

Same for `lidar/fastify` with a raw-body webhook route.

### User Story 5 - Node step-up (Priority: P1)

`lidar/node` is a standalone `node:http` server: webhook, sensitive
route, and challenge clear.

### User Story 6 - Vue companion (Priority: P2)

`lidar/vue` ships a companion Node server. The README states Lidar
integration is server-side.

### User Story 7 - Angular companion (Priority: P2)

Same for `lidar/angular`.

---

### Edge Cases

- The webhook receiver MUST verify the signature before any state
  change (same rules as observability).
- The step-up store is in-memory and MUST be documented as
  non-durable.
- The sample MUST NOT block outright — it returns a challenge.
- The sample MUST NOT claim to read Lidar Signals.
- Browser-only samples MUST NOT put the signing secret in the SPA.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `lidar/{sveltekit,vue,tanstack-start,angular,astro,fastify,node}` MUST exist.
- **FR-002**: Each sample MUST verify `X-Authdog-Signature` exactly as
  the observability samples do (raw body, replay tolerance,
  constant-time compare, delivery-ID dedupe).
- **FR-003**: Each sample MUST mark the event's subject as requiring
  step-up on a verified security event, and MUST clear the mark after
  a successful challenge.
- **FR-004**: Each sample MUST expose a sensitive route that returns
  HTTP 428 with a challenge payload when the caller is marked.
- **FR-005**: Each README MUST state that Lidar Signals are
  console-only, that this sample reacts to the event stream, and that
  the response is a challenge, not a block.
- **FR-006**: Samples MUST NOT implement authentication, authorization,
  or a Lidar detector.
- **FR-007**: The root catalog MUST mark Wave 2 `lidar` cells
  `Present`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can see the step-up flow end to end in under
  ten minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample changes state before signature verification.
- **SC-004**: The catalog shows Wave 2 Lidar as Present.

## Assumptions

- The Events & webhooks doc and the impossible-travel recipe are the
  source of truth.
- Node 20+ is available.
- The signing secret is a server-only secret.
- Wave 2 observability is Present.
