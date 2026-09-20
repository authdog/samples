# authdog authn on express

Smallest Express starter for Authdog identity using `@authdog/express`.
`attachSession` records context. `requireAuth` on `GET /me` is the
identity gate.

## What this sample shows

Authentication (`authn`): who the caller is after a validated session.
This is a backend gate. Hosted sign-in still happens in a browser
(Account portal or a frontend SDK). Authentication is not
authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

## Run

```bash
npm install
npm run dev
```

The process reads `PK_AUTHDOG` from `.env`. You can also run
`PK_AUTHDOG=pk_... npm run dev`.

Open http://localhost:3000

## What to try

1. `curl -i http://localhost:3000/me` with no session. You should get
   `401 {"error":"Unauthorized"}`.
2. Complete hosted sign-in, then send the session:

```bash
curl -i http://localhost:3000/me \
  -H "Authorization: Bearer <token>"
```

A valid `authdog-session` cookie also works. `GET /logout` expires the
local cookie and redirects.

## Gotchas

- **Published SDK lists `workspace:*`**: `@authdog/express` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- **`attachSession` is informational; `requireAuth` is the boundary**:
  the middleware never fails a request on its own. Use `requireAuth`
  on protected routes. `GET /session` is a probe, not a gate.
- **`fetchUser: false` makes `requireAuth` reject everything**: this
  sample does not use that option.
- **Logout is local only**: it clears the cookie and redirects; it
  does not revoke a bearer token or end the upstream IdP session.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/express`. Apply
[authorization](https://www.authdog.com/docs/concepts/authorization)
after `requireAuth`. Do not treat `/me` as a permission check.
