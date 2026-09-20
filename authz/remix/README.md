# authdog authz on remix

Smallest Remix v2 starter for Authdog authorization on top of the
Wave 1 authentication pattern. `/invoices` validates identity with
`identityLoader`, then allows only users with the `invoices:read`
permission.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision after
identity. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:5173`). Create the `invoices:read` permission
and grant it to a role, then to a user.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What to try

1. Sign in through the hosted Account portal, then open `/invoices`.
   With `invoices:read` you see the sample list.
2. Open `/invoices` without a session. You are redirected to hosted
   sign-in. With a session that lacks `invoices:read`, you get 403.

## Gotchas

- **Claim names vary by environment**: this sample reads
  `user.permissions`. Adjust the accessor in
  `app/routes/invoices.tsx` to match your token's shape.
- **Missing permissions deny**: an absent or non-array `permissions`
  claim is treated as no permissions (403), not allow.
- **The loader does not deny access by itself**: `identityLoader`
  returns an unauthenticated result; `/invoices` checks
  `isAuthenticated` and the permission.
- **Published SDK lists `workspace:*`**: `@authdog/remix-node` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/remix`.
