# Feature Specification: Wave 3 Observability

**Feature Branch**: `012-wave-3-observability`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Move on implementation — Wave 3 observability for go, java, csharp, and python."

## Context

Observability consumes the identity event stream: signed webhooks
(push) and the Events API (pull). Both need server-only secrets.
There is no official observability SDK; samples use the documented
REST and HMAC surface. This is not Lidar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Go receiver + events (Priority: P1)

A developer copies `observability/go`, sets the secrets, and
receives verified webhooks at `POST /webhooks/authdog` and lists
events at `GET /events`.

**Independent Test**: Follow `observability/go/README.md` only. Bad
signature → 401.

**Acceptance Scenarios**:

1. **Given** a valid signature, **When** `POST /webhooks/authdog` runs, **Then** the response is 200.
2. **Given** a bad signature, **When** the same route runs, **Then** the response is 401.
3. **Given** secrets are set, **When** `GET /events` runs, **Then** the body includes the first page and an `after` cursor.

---

### User Story 2 - Python receiver + events (Priority: P1)

Same for `observability/python` on FastAPI. No identity extra is
required — this concept is HMAC + REST.

**Independent Test**: Follow `observability/python/README.md` only.

---

### User Story 3 - Java standalone receiver (Priority: P1)

`observability/java` is a JDK HTTP server: `POST /webhooks/authdog`
and `GET /events`. No language SDK dependency.

**Independent Test**: Follow `observability/java/README.md` only.

---

### User Story 4 - C# standalone receiver (Priority: P1)

Same contract as Java on a .NET listener. No `Authdog.Sdk`
reference.

**Independent Test**: Follow `observability/csharp/README.md` only.

---

### Edge Cases

- Missing secrets fail fast.
- Raw body before JSON parsing; constant-time compare; 5-minute
  replay tolerance; idempotent delivery IDs (in-memory, non-durable).
- Do not invent an observability SDK helper.
- Lidar and authentication are out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `observability/{go,java,csharp,python}` MUST exist.
- **FR-002**: Each receiver MUST verify `X-Authdog-Signature` as
  HMAC-SHA256 over `t + "." + rawBody` with constant-time comparison,
  replay tolerance, and delivery-ID dedupe.
- **FR-003**: Each sample MUST expose an Events API read path with
  cursor pagination.
- **FR-004**: Java and C# MUST use the platform HTTP stack only.
  They MUST NOT depend on `authdog-java-sdk` or `Authdog.Sdk`.
- **FR-005**: Each sample MUST include `README.md` with the
  constitution section order and `.env.example` with placeholders
  only.
- **FR-006**: Samples MUST NOT implement authn, authz, or Lidar
  detectors.
- **FR-007**: The root catalog MUST mark Wave 3 `observability`
  cells Present and leave Lidar planned.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can receive a verified webhook in under ten
  minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample processes a payload before signature
  verification.
- **SC-004**: The listing shows Wave 3 observability as present and
  does not mark Lidar present.

## Assumptions

- The Events & webhooks doc is the API source of truth.
- Secrets are server-only.
- Wave 3 authorization is Present.
