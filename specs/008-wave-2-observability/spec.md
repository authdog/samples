# Feature Specification: Wave 2 Observability

**Feature Branch**: `008-wave-2-observability`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Wave 2 observability for sveltekit, vue, tanstack-start, angular, astro, fastify, and node."

## Context

Observability consumes the identity event stream: signed webhooks
(push) and the Events API (pull). Both need server-only secrets
(`AUTHDOG_WEBHOOK_SECRET`, `AUTHDOG_API_TOKEN`), so the concept is
inherently server-side. Server-capable stacks get in-app receivers;
browser-only stacks (Vue, Angular) get a minimal companion Node
receiver that runs alongside the SPA, with a README that states
observability is server-side.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - SvelteKit receiver + events (Priority: P1)

A developer copies `observability/sveltekit`, sets the secrets, and
receives verified webhooks at `POST /webhooks/authdog` and lists
events at `GET /events`.

**Independent Test**: Follow the README only. Bad signature → 401.

### User Story 2 - Astro receiver + events (Priority: P1)

Same for `observability/astro` via API routes.

### User Story 3 - TanStack Start receiver + events (Priority: P1)

Same for `observability/tanstack-start` via server routes.

### User Story 4 - Fastify receiver + events (Priority: P1)

Same for `observability/fastify` with a raw-body route.

### User Story 5 - Node receiver + poller (Priority: P1)

`observability/node` runs a standalone `node:http` webhook receiver
and an events-poller command.

### User Story 6 - Vue companion receiver (Priority: P2)

`observability/vue` ships a minimal Node receiver to run alongside the
SPA; the README states observability is server-side.

### User Story 7 - Angular companion receiver (Priority: P2)

Same for `observability/angular`.

---

### Edge Cases

- Missing secrets fail fast.
- Raw body before JSON parsing; constant-time compare; replay
  tolerance; idempotent delivery IDs.
- Browser-only samples MUST NOT put secrets in the SPA bundle.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `observability/{sveltekit,vue,tanstack-start,angular,astro,fastify,node}` MUST exist.
- **FR-002**: Each receiver MUST verify `X-Authdog-Signature` as
  HMAC-SHA256 over `t + "." + rawBody` with constant-time comparison,
  replay tolerance, and delivery-ID dedupe.
- **FR-003**: Server-capable samples MUST expose an Events API read
  path with cursor pagination.
- **FR-004**: Browser-only samples MUST keep secrets out of the SPA
  and label the receiver as a server-side companion.
- **FR-005**: Each sample MUST include `README.md` with the
  constitution section order and `.env.example` with placeholders
  only.
- **FR-006**: Samples MUST NOT implement authn, authz, or Lidar
  detectors.
- **FR-007**: The root catalog MUST mark Wave 2 `observability` cells
  `Present`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can receive a verified webhook in under ten
  minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample processes a payload before signature
  verification.
- **SC-004**: The catalog shows Wave 2 observability as Present.

## Assumptions

- The Events & webhooks doc is the API source of truth.
- Node 20+ is available.
- Secrets are server-only.
