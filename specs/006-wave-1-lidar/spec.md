# Feature Specification: Wave 1 Lidar

**Feature Branch**: `006-wave-1-lidar`

**Created**: 2026-09-20

**Status**: Draft

**Input**: User description: "Wave 1 Lidar samples for nextjs, remix, and express."

## Context

Lidar is Authdog's identity SIEM. Monitors run inside Authdog and
surface Signals in the console. There is **no public Signals API**;
the documented app-side integration is to react to security-relevant
identity events with a step-up or challenge, rather than blocking
outright. These samples implement that documented pattern.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Express step-up on security events (Priority: P1)

A developer copies `lidar/express`, sets a signing secret, and
receives verified security events. When a sign-in event arrives for a
user, the sample marks that user as requiring step-up; the next
request to a sensitive route for that user returns a challenge
response instead of the resource.

**Independent Test**: Follow `lidar/express/README.md` only. A
verified `SIGNIN_SUCCESS` delivery marks the user; `GET /sensitive`
for that user then returns `428` with a step-up challenge.

### User Story 2 - Next.js step-up on security events (Priority: P1)

Same pattern in a Next.js route handler.

**Independent Test**: Follow `lidar/nextjs/README.md` only.

### User Story 3 - Remix step-up on security events (Priority: P1)

Same pattern in a Remix action + loader.

**Independent Test**: Follow `lidar/remix/README.md` only.

---

### Edge Cases

- The webhook receiver MUST verify the signature before any state
  change (same rules as observability).
- The step-up store is in-memory and MUST be documented as
  non-durable.
- The sample MUST NOT block outright — it returns a challenge, per
  the recipe guidance (a real user on a VPN can look like impossible
  travel).
- The sample MUST NOT claim to read Lidar Signals — there is no
  public Signals API.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `lidar/nextjs`, `lidar/remix`, and `lidar/express` MUST
  exist.
- **FR-002**: Each sample MUST verify `X-Authdog-Signature` exactly as
  the observability samples do.
- **FR-003**: Each sample MUST mark the event's subject as requiring
  step-up on a verified security event, and MUST clear the mark after
  a successful challenge.
- **FR-004**: Each sample MUST expose a sensitive route that returns a
  step-up challenge (HTTP 428 or a challenge payload) when the caller
  is marked, and the resource otherwise.
- **FR-005**: Each README MUST state that Lidar Signals are
  console-only, that this sample reacts to the event stream, and that
  the response is a challenge, not a block.
- **FR-006**: Samples MUST NOT implement authentication, authorization,
  or a Lidar detector.
- **FR-007**: The root catalog MUST mark Wave 1 `lidar` cells
  `Present`.

### Key Entities

- **Step-up mark**: subject identifier → required challenge, held in
  memory.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can see the step-up flow end to end in under
  ten minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample changes state before signature verification.
- **SC-004**: The catalog shows Wave 1 Lidar as Present.

## Assumptions

- The Events & webhooks doc and the impossible-travel recipe are the
  source of truth.
- Node 20+ is available.
- The signing secret is a server-only secret.
