# Research: Wave 2 Authorization

## Decision 1: The decision reads userinfo claims

Same as Wave 1 authz: after validating the session, read
`user.permissions` (string array) and require `invoices:read`. Missing
claim → deny (fail-closed).

## Decision 2: Server-capable vs browser-only

- Server-capable: SvelteKit (`getUser` then check), TanStack Start
  (`identityLoader` then check), Astro (`getUser` then check), Fastify
  (`requireAuth` then a local `requirePermission` preHandler).
- Browser-only: Vue (`useAuthz().hasPermission` — documented UI hint),
  Angular (read `user.permissions` after `fetchUser` — UI hint). Both
  label the check as UI-only and point to a backend for enforcement.
- Node: validate the token with `fetchUserData`, read
  `user.permissions`, print allow/deny.

## Decision 3: `useAuthz` is UI-only

The Vue skill is explicit: `useAuthz` is for showing/hiding UI;
enforce access on the backend. The Angular SDK has no documented
server helper, so its sample reads claims client-side and says the
same.

## Decision 4: Reuse the authn scaffolding

Each sample mirrors its `authn/<stack>` counterpart and adds the
permission gate on one protected route/page.
