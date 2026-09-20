# authdog authn on go

Smallest Gin starter for Authdog identity using
`github.com/authdog/web-sdk/packages/go`. The module has **no tagged
versions** — this sample pins a commit. `AttachSession` records
context. `RequireAuth` on `GET /me` is the identity gate.

## What this sample shows

Authentication (`authn`): who the caller is after a validated session.
This is a backend gate. Hosted sign-in still happens in a browser
(Account portal or a frontend SDK). Authentication is not
authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`. Export it in your
shell (`export PK_AUTHDOG=pk_...`) before you run the server.

Go **1.25+** is required (the module declares `go 1.25.0`).

## Run

```bash
go mod download
export PK_AUTHDOG=pk_...
go run .
```

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

- **No tagged versions**: `go.mod` pins
  `v0.0.0-20260710181327-52466b0888a2`. Do not use `@latest` for a
  reproducible build.
- **Gin is the only ready adapter**: `net/http`, chi, and Echo must
  compose the core functions themselves. This sample stays on Gin.
- **`AttachSession` is informational; `RequireAuth` is the boundary**:
  the middleware never fails a request on its own. Use `RequireAuth`
  on protected routes.
- **`FetchUser: false` makes `RequireAuth` reject everything**: this
  sample does not use that option.
- **Logout is local only**: it clears the cookie and redirects; it
  does not revoke a bearer token or end the upstream IdP session.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Present: [`authz/go`](../../authz/go/).
Apply
[authorization](https://www.authdog.com/docs/concepts/authorization)
after `RequireAuth`. Do not treat `/me` as a permission check.
