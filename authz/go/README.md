# authdog authz on go

Smallest Gin starter for an Authdog server-side permission decision
using `github.com/authdog/web-sdk/packages/go`. The module has **no
tagged versions** — this sample pins a commit. `RequireAuth` proves
identity. A local helper then allows only users with `invoices:read`.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision after
identity. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`. Export it
(`export PK_AUTHDOG=pk_...`) before you run the server.

In the console, create the `invoices:read` permission and grant it to
a role, then to a user.

Go **1.25+** is required.

## Run

```bash
go mod download
export PK_AUTHDOG=pk_...
go run .
```

Open http://localhost:3000

## What to try

1. `curl -i http://localhost:3000/invoices` with no session. You
   should get `401 {"error":"Unauthorized"}`.
2. Complete hosted sign-in, then send the session:

```bash
curl -i http://localhost:3000/invoices \
  -H "Authorization: Bearer <token>"
```

With a session that lacks `invoices:read` you get 403. With the
permission you get 200 and sample data.

## Gotchas

- **Claim names vary by environment**: this sample reads
  `user.permissions` on the decoded userinfo object. Adjust the
  accessor in `main.go` to match your token's shape.
- **Missing permissions deny**: an absent or non-array `permissions`
  claim is treated as no permissions (403), not allow.
- **`RequireAuth` is identity; the local helper is the decision**:
  keep 401 (no session) distinct from 403 (no permission). The Go
  module does not export `RequirePermission`.
- **No tagged versions**: `go.mod` pins
  `v0.0.0-20260710181327-52466b0888a2`.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/go`.
