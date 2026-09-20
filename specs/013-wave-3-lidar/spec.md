# Feature Specification: Wave 3 Lidar

**Feature Branch**: `013-wave-3-lidar`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Go — Wave 3 lidar for go, java, csharp, and python."

## Context

Lidar is Authdog's identity SIEM. Monitors run inside Authdog and
surface Signals in the console. There is **no public Signals API**.
The documented app-side pattern is to react to security-relevant
identity events with a step-up challenge, not a block.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Go step-up (Priority: P1)

A developer copies `lidar/go`, sets a signing secret, and receives
verified security events. A marked subject hitting `GET /sensitive`
gets HTTP 428.

**Independent Test**: Follow `lidar/go/README.md` only.

### User Story 2 - Python step-up (Priority: P1)

Same for `lidar/python` on FastAPI. No identity extra.

**Independent Test**: Follow `lidar/python/README.md` only.

### User Story 3 - Java standalone step-up (Priority: P1)

`lidar/java` is a JDK HTTP server with the same three routes. No
language SDK.

**Independent Test**: Follow `lidar/java/README.md` only.

### User Story 4 - C# standalone step-up (Priority: P1)

Same contract as Java on a .NET listener. No `Authdog.Sdk`.

**Independent Test**: Follow `lidar/csharp/README.md` only.

---

### Edge Cases

- Verify the signature before any state change.
- In-memory marks are non-durable.
- Challenge (428), not a block (403).
- Do not claim to read Lidar Signals.
- Subject from `X-Demo-User` in this sample; a real app uses the session.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `lidar/{go,java,csharp,python}` MUST exist.
- **FR-002**: Each sample MUST verify `X-Authdog-Signature` exactly as
  the observability samples do.
- **FR-003**: Each sample MUST mark the event's subject on a verified
  security event and clear the mark after `POST /step-up/complete`.
- **FR-004**: `GET /sensitive` MUST return 428 with a challenge when
  the caller is marked, and the resource otherwise.
- **FR-005**: Each README MUST state that Signals are console-only,
  that this sample reacts to the event stream, and that the response
  is a challenge, not a block.
- **FR-006**: Samples MUST NOT implement authn, authz, or a detector.
- **FR-007**: The root catalog MUST mark Wave 3 `lidar` cells Present.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can see the step-up flow in under ten
  minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample changes state before signature verification.
- **SC-004**: The listing shows Wave 3 Lidar as present.

## Assumptions

- Wave 3 observability is Present.
- The Events & webhooks doc and the impossible-travel recipe are the
  source of truth.
