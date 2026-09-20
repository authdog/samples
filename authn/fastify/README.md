# authdog authn on fastify

Smallest Fastify starter for Authdog identity using
`@authdog/fastify`. The plugin resolves the session;
`app.authdog.requireAuth` is the boundary.

## What this sample shows

Authentication (`authn`): who the caller is, proven by a validated
session. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

## Run

```bash
npm install
npm run dev
```

The server listens on http://localhost:3000

## What to try

1. `curl http://localhost:3000/me` → `401 {"error":"Unauthorized"}`.
2. `curl -H "Authorization: Bearer <token>" http://localhost:3000/me`
   with a real access token → the user JSON from userinfo.
3. `curl http://localhost:3000/logout` → clears the local cookie and
   redirects.

## Gotchas

- **The plugin is informational; `requireAuth` is the boundary**:
  anonymous context never fails the request. Use `requireAuth` as a
  `preHandler` on protected routes.
- **`fetchUserInfo: false` makes `requireAuth` reject everything**:
  only use it with your own validation replacing Authdog's gate.
- **Logout is local only**: it clears the cookie and redirects; it does
  not revoke the bearer or end the upstream IdP session.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/fastify`.
