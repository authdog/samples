# Feature Specification: Wave 1 Authentication

**Feature Branch**: `002-wave-1-authn`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Start implementation of Wave 1 authentication samples for nextjs, remix, and express."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Next.js hosted sign-in shows identity (Priority: P1)

A developer copies `authn/nextjs`, sets the public key, runs the app, completes hosted Account portal sign-in, and sees their email on the dashboard. Signing out clears the browser token and server cookies. The sample does not decide what the user is allowed to do.

**Why this priority**: Next.js is the flagship Wave 1 stack.

**Independent Test**: Follow `authn/nextjs/README.md` only. After hosted sign-in, `/dashboard` shows the signed-in email. Without a session it says not signed in.

**Acceptance Scenarios**:

1. **Given** both public-key env vars are set, **When** the developer opens the app unsigned-in, **Then** they can start hosted sign-in and `/dashboard` says not signed in.
2. **Given** hosted sign-in returns with `?token=` to a matched URL, **When** they land on `/dashboard`, **Then** `useUser` shows an email from userinfo.
3. **Given** they sign out, **When** they return to `/dashboard`, **Then** the page says not signed in.

---

### User Story 2 - Remix loader resolves identity (Priority: P1)

A developer copies `authn/remix`, sets the public key, and uses the root `identityLoader` plus a profile route that redirects unsigned-in visitors to `signinUri`. The sample proves identity only.

**Why this priority**: Remix is the second Wave 1 session SDK.

**Independent Test**: Follow `authn/remix/README.md` only. Profile is reachable after callback; unsigned-in visitors are sent to hosted sign-in.

**Acceptance Scenarios**:

1. **Given** `PK_AUTHDOG` is set, **When** an unsigned-in visitor opens the profile route, **Then** they are redirected to the loader's `signinUri`.
2. **Given** hosted sign-in returns `?token=` to the root loader, **When** they open the profile route, **Then** they see the signed-in email.
3. **Given** they hit the logout route, **When** the session cookies are cleared, **Then** the profile route redirects to hosted sign-in again.

---

### User Story 3 - Express requireAuth is the gate (Priority: P1)

A developer copies `authn/express`, sets the public key, and confirms `GET /me` returns 401 without a session and the user JSON with a valid cookie or bearer token. `attachSession` is labeled informational.

**Why this priority**: Express is the Wave 1 server gate other stacks pair with.

**Independent Test**: Follow `authn/express/README.md` only. `GET /me` without a session is 401; with a valid session it returns the user.

**Acceptance Scenarios**:

1. **Given** the server is running, **When** `GET /me` has no cookie or bearer token, **Then** the response is `401 {"error":"Unauthorized"}`.
2. **Given** a valid session from hosted sign-in, **When** `GET /me` sends `authdog-session` or `Authorization: Bearer`, **Then** the body is the userinfo user.
3. **Given** `GET /logout`, **When** a cookie session exists, **Then** the cookie is expired and the client is redirected.

---

### Edge Cases

- Missing or malformed `pk_...` fails fast with a readable message; do not invent a host.
- `useAuth` / `attachSession` without a gate must not be presented as protection.
- Secret key is never requested or committed.
- Authorization, observability, and Lidar are out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authn/nextjs` MUST exist and use `@authdog/nextjs-app` only for Authdog APIs.
- **FR-002**: The Next.js sample MUST set `NEXT_PUBLIC_PK_AUTHDOG` and `PK_AUTHDOG` to the same public key, mount `AuthdogProvider`, exchange `?token=` with `useAuthMiddleware`, and show identity via `useUser` on `/dashboard`.
- **FR-003**: `authn/remix` MUST exist and use `@authdog/remix-node` only for Authdog APIs.
- **FR-004**: The Remix sample MUST run `identityLoader` on the callback route, wrap with `AuthdogProvider`, enforce `isAuthenticated` on a profile route, and sign out with `logoutLoader`.
- **FR-005**: `authn/express` MUST exist and use `@authdog/express` only for Authdog APIs.
- **FR-006**: The Express sample MUST call `createAuthdog`, mount `attachSession`, protect `GET /me` with `requireAuth`, and expose `logout`.
- **FR-007**: Each sample MUST include `README.md` with the constitution section order and `.env.example` with placeholders only.
- **FR-008**: Samples MUST NOT request, embed, or document the secret key as required for this concept.
- **FR-009**: Samples MUST NOT implement authorization checks, event streaming, or Lidar.
- **FR-010**: The root catalog MUST mark Wave 1 `authn` cells `Present` and leave other Wave 1 concept cells `Planned`.

### Key Entities

- **Wave 1 authn sample**: A copyable folder at `authn/nextjs`, `authn/remix`, or `authn/express`.
- **Public key**: `pk_...` from the environment; the only credential these samples collect.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from clone to a running Wave 1 authn sample in under ten minutes once they have a public key.
- **SC-002**: Each of the three READMEs is usable without opening any other repo file.
- **SC-003**: An unsigned-in visitor never sees a fabricated identity, and a protected Express route never returns 200 without a validated session.
- **SC-004**: The catalog shows Wave 1 authentication as Present and does not mark later waves Present.

## Assumptions

- Official quickstarts and framework guides are the API source of truth.
- Hosted Account portal is the sign-in UI; samples link to it rather than embedding credentials UI.
- Node 20+ is available.
- A real public key is required to complete hosted sign-in; CI can still install and type-check.
