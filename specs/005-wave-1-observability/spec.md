# Feature Specification: Wave 1 Observability

**Feature Branch**: `005-wave-1-observability`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Wave 1 observability samples for nextjs, remix, and express."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Express webhook receiver (Priority: P1)

A developer copies `observability/express`, sets an API token and
signing secret, and receives verified webhook deliveries. The raw body
is read before JSON parsing; the HMAC is compared in constant time.

**Independent Test**: Follow `observability/express/README.md` only.
`POST /webhooks/authdog` with a valid signature returns 2xx; an
invalid signature returns 401.

### User Story 2 - Express events poller (Priority: P1)

The same sample lists events through the Events API with a cursor.

**Independent Test**: `GET /events` prints the first page of events
and the `list_metadata.after` cursor.

### User Story 3 - Next.js webhook receiver (Priority: P1)

A developer copies `observability/nextjs`, sets the signing secret,
and receives verified webhook deliveries in a route handler.

**Independent Test**: Follow `observability/nextjs/README.md` only.
`POST /api/webhooks/authdog` with a valid signature returns 2xx.

### User Story 4 - Remix webhook receiver (Priority: P1)

A developer copies `observability/remix`, sets the signing secret,
and receives verified webhook deliveries in an action.

**Independent Test**: Follow `observability/remix/README.md` only.
`POST /webhooks/authdog` with a valid signature returns 2xx.

---

### Edge Cases

- Missing `AUTHDOG_API_TOKEN` or `AUTHDOG_WEBHOOK_SECRET` fails fast.
- The raw body MUST be read before JSON parsing.
- Timestamps outside the replay tolerance MUST be rejected.
- Digest comparison MUST be constant-time.
- Handlers MUST be idempotent on `X-Authdog-Delivery-Id`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `observability/nextjs`, `observability/remix`, and
  `observability/express` MUST exist.
- **FR-002**: Each sample MUST verify `X-Authdog-Signature` as
  HMAC-SHA256 over `t + "." + rawBody` with constant-time comparison.
- **FR-003**: Each sample MUST reject stale timestamps and duplicate
  delivery IDs.
- **FR-004**: Each sample MUST expose a read path that lists events
  from the Events API with cursor pagination.
- **FR-005**: Each sample MUST include `README.md` with the
  constitution section order and `.env.example` with placeholders
  only.
- **FR-006**: Samples MUST NOT implement authentication,
  authorization, or Lidar detectors.
- **FR-007**: The root catalog MUST mark Wave 1 `observability` cells
  `Present`.

### Key Entities

- **Wave 1 observability sample**: A copyable folder at
  `observability/<stack>` for the three Wave 1 ids.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can receive a verified webhook in under ten
  minutes once they have a signing secret.
- **SC-002**: Each README is usable without opening any other repo
  file.
- **SC-003**: No sample processes a payload before signature
  verification.
- **SC-004**: The catalog shows Wave 1 observability as Present.

## Assumptions

- The Events & webhooks doc is the API source of truth.
- Node 20+ is available.
- The API token and signing secret are server-only secrets.
