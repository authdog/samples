# Research: Wave 2 Authentication

## Decision 1: Use official packages only

Each stack uses its published package and documented helpers. No
unpublished methods.

## Decision 2: Server-capable vs browser-only

- Server-capable: SvelteKit (`getUser`), TanStack Start
  (`identityLoader`), Astro (`getUser`), Fastify (`requireAuth`).
- Browser-only: Vue (`useUser().fetchUser`), Angular
  (`AuthdogService.fetchUser`). These label the guard/provider as UX.
- Node: token validation only (`getUserInfo`); no sign-in flow.

## Decision 3: SvelteKit/Astro bootstrap is not the server cookie

`initAuthdog()` stores the token in `localStorage` only. The README
states the server callback must set the HttpOnly `authdog-session`
cookie after validation.

## Decision 4: Fastify mirrors Express

`authdogPlugin` + `app.authdog.requireAuth` on `GET /me`, same 401
contract as Wave 1 Express.

## Decision 5: Node is a CLI validator

`node src/index.js <token>` prints the userinfo user or an
authentication error. No server, no sign-in.
