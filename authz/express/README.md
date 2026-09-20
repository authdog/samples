# authdog authz on express

Smallest Express starter for Authdog authorization on top of the
Wave 1 authentication pattern. `requireAuth` validates the session,
then a local `requirePermission` gate allows only users with the
`invoices:read` permission.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision after
identity. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

In the console, create the `invoices:read` permission and grant it to
a role, then to a user.

## Run

```bash
npm install
npm run dev
```

The process reads `PK_AUTHDOG` from `.env`. You can also run
`PK_AUTHDOG=pk_... npm run dev`.

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
  `user.permissions`. Adjust the accessor in `src/index.ts` to match
  your token's shape.
- **Missing permissions deny**: an absent or non-array `permissions`
  claim is treated as no permissions (403), not allow.
- **`requireAuth` is identity; `requirePermission` is the decision**:
  keep 401 (no session) distinct from 403 (no permission).
- **Published SDK lists `workspace:*`**: `@authdog/express` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/express`.
