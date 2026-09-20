# Research: Wave 1 Authentication

## Decision 1: Follow official quickstarts, not Vue OIDC authorize

**Decision**: Next.js and Remix send users to the hosted Account portal
(`identityHost/signin/environmentId` as Remix already returns in
`signinUri`). Express does not host sign-in; it validates the session.

**Rationale**: Official Next.js quickstart: "Send users to hosted
sign-in from your Account portal, then back to `/dashboard`." The Vue
`/oidc/.../authorize` helper is a different SDK and must not be copied
into Next/Remix.

## Decision 2: Next.js identity via useUser, not useAuth

**Decision**: `/dashboard` uses `useUser`. Logout calls `logoutHandler`
then `clearAuthdogSession`.

**Rationale**: Docs: `useAuth` only reports browser token presence.
Middleware exchanges; it does not guard later requests.

## Decision 3: Remix root loader + separate profile enforcement

**Decision**: `identityLoader` on `root` (callback + cookie). Profile
route re-runs the loader, checks `isAuthenticated`, redirects to
`signinUri`. Do not `response.json()` on the root callback path.

**Rationale**: Official Remix guide. Preserves `Set-Cookie` on callback.

## Decision 4: Express /me is the only gate

**Decision**: `attachSession` app-wide. `requireAuth` only on `GET /me`.
A `/session` probe, if present, MUST be labeled informational.

**Rationale**: Official Express quickstart. `attachSession` never 401s.

## Decision 5: Next.js callback is a Node route, not `useAuthMiddleware`

**Decision**: Do not call `useAuthMiddleware` from `middleware.ts`. Forward
`?token=` to `/auth/callback`, which uses `getServerSidePayloadPublicKey`,
`fetchUserData`, and the same `user_session_*` cookie names as the official
helper.

**Rationale**: `@authdog/nextjs-app@2.1.1` server bundle `require()`s Next
internals and crashes in Next.js 15 Edge (`Native module not found:
next/dist/server/web/spec-extension/request`). The route handler is Node and
uses published APIs. Documented in the sample README.

## Decision 6: Sign-in URI from official parsers

**Decision**: Next.js `getServerSidePayloadPublicKey`; Remix
`signinUri`; Express `getPublicKeyPayload()`. Same
`${identityHost}/signin/${environmentId}` construction Remix documents.

**Alternatives rejected**: Asking the user to paste a portal URL
(extra config); inventing OIDC authorize query params on Next/Express.
