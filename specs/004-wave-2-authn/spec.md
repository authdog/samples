# Feature Specification: Wave 2 Authentication

**Feature Branch**: `004-wave-2-authn`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Move on to Wave 2 authentication for sveltekit, vue, tanstack-start, angular, astro, fastify, and node."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - SvelteKit identity (Priority: P1)

A developer copies `authn/sveltekit`, sets the public key, signs in through hosted auth, and sees identity on a profile page. The handle hook reads the cookie; `getUser` validates it.

**Independent Test**: Follow `authn/sveltekit/README.md` only. `/profile` shows the signed-in email or redirects.

### User Story 2 - Vue browser identity (Priority: P1)

A developer copies `authn/vue`, sets the public key, signs in through hosted auth, and sees identity from `useUser().fetchUser(publicKey)`. The sample does not claim server-side protection.

**Independent Test**: Follow `authn/vue/README.md` only. The app shows the signed-in email after hosted sign-in.

### User Story 3 - TanStack Start identity (Priority: P1)

A developer copies `authn/tanstack-start`, sets the public key, and uses the server `identityLoader` to exchange the callback and resolve identity.

**Independent Test**: Follow `authn/tanstack-start/README.md` only. The root loader reports `isAuthenticated` after callback.

### User Story 4 - Angular browser identity (Priority: P1)

A developer copies `authn/angular`, sets the public key, signs in, and sees identity from `AuthdogService.fetchUser()`. The sample labels the route guard as UX.

**Independent Test**: Follow `authn/angular/README.md` only. The profile page shows the signed-in email after hosted sign-in.

### User Story 5 - Astro identity (Priority: P1)

A developer copies `authn/astro`, sets the public key, and uses `createAuthdogServer().getUser()` to show identity on a server page.

**Independent Test**: Follow `authn/astro/README.md` only. The profile page shows the signed-in email or redirects.

### User Story 6 - Fastify identity gate (Priority: P1)

A developer copies `authn/fastify`, sets the public key, and confirms `GET /me` is 401 without a session and the user JSON with one.

**Independent Test**: Follow `authn/fastify/README.md` only. `GET /me` without a session is 401.

### User Story 7 - Node token validation (Priority: P1)

A developer copies `authn/node`, passes a bearer token, and gets the userinfo user or a 401-style error. The sample does not host sign-in.

**Independent Test**: Follow `authn/node/README.md` only. `node src/index.js <token>` prints the user or an authentication error.

---

### Edge Cases

- Missing or malformed `pk_...` fails fast with a readable message.
- Browser-only samples (Vue, Angular) MUST NOT claim server-side protection.
- SvelteKit/Astro `initAuthdog()` MUST NOT be presented as creating the server cookie.
- No unpublished helpers are used.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authn/sveltekit`, `authn/vue`, `authn/tanstack-start`, `authn/angular`, `authn/astro`, `authn/fastify`, and `authn/node` MUST exist.
- **FR-002**: Each sample MUST use only the official package for that stack (`@authdog/sveltekit`, `@authdog/vue`, `@authdog/tanstack-start`, `@authdog/angular`, `@authdog/astro`, `@authdog/fastify`, `@authdog/node-sdk`).
- **FR-003**: Server-capable samples MUST validate the session before showing identity (SvelteKit `getUser`, TanStack `identityLoader`, Astro `getUser`, Fastify `requireAuth`).
- **FR-004**: Browser-only samples MUST label the guard/provider as UX and MUST NOT claim server-side enforcement.
- **FR-005**: Each sample MUST include `README.md` with the constitution section order and `.env.example` with placeholders only.
- **FR-006**: Samples MUST NOT implement authorization, observability, or Lidar.
- **FR-007**: The root catalog MUST mark Wave 2 `authn` cells `Present`.

### Key Entities

- **Wave 2 authn sample**: A copyable folder at `authn/<stack>` for the seven Wave 2 ids.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from clone to a running Wave 2 authn sample in under ten minutes once they have a public key.
- **SC-002**: Each README is usable without opening any other repo file.
- **SC-003**: Server-capable samples never show identity without a validated session.
- **SC-004**: The catalog shows Wave 2 authentication as Present.

## Assumptions

- Official agent-skills and package READMEs are the API source of truth.
- Hosted Account portal is the sign-in UI for browser samples.
- Node 20+ is available.
- Wave 1 authn and authz are Present.
