# Research: Wave 1 Authorization

## Decision 1: Use documented user claims, not unpublished helpers

**Decision**: Read `roles` / `permissions` from the validated user
object and gate on `invoices:read`, following the official Python
access-control guide pattern.

**Rationale**: `@authdog/nextjs-app` `userCan` is an empty stub;
`hasRequiredPermissions` / `hasRequiredGroups` are not exported from
the server entry; `@authdog/express` has no `requirePermission`.
Constitution II forbids inventing surface.

## Decision 2: Next.js reads the server session cookie

**Decision**: A Route Handler reads `user_session_hash_<env>` and
revalidates with `fetchUserData`, then checks `permissions`.

**Rationale**: The authn sample stores the validated user and token in
HttpOnly cookies. The authz sample must not trust the client.

## Decision 3: Remix gates in the loader

**Decision**: `/invoices` loader runs `identityLoader`, redirects when
unauthenticated, throws 403 when `invoices:read` is missing.

**Rationale**: Official Remix pattern; identity first, then decision.

## Decision 4: Express adds a local requirePermission factory

**Decision**: After `requireAuth`, a local `requirePermission(...)`
middleware reads `req.authdog.user.permissions` and returns 403.

**Rationale**: Mirrors the official guide's `require_permission`
dependency without inventing an SDK export.

## Decision 5: Claim names are documented as environment-dependent

**Decision**: READMEs state that `permissions` / `roles` claim names
depend on the environment and must match the token shape.

**Rationale**: Official guide warning.
