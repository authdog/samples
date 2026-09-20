# authdog authz on nextjs

Smallest App Router starter for Authdog authorization on top of the
Wave 1 authentication pattern. `GET /api/invoices` validates the
session, then allows only users with the `invoices:read` permission.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision after
identity. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env.local` and set both variables to that
same public key.

In the console, send the Account portal back to a URL this app
serves (for local use, `http://localhost:3000/dashboard`). Create the
`invoices:read` permission and grant it to a role, then to a user.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What to try

1. Sign in, then open `/api/invoices`. With `invoices:read` you get
   200 and sample data.
2. Without a session, `/api/invoices` is 401. With a session that
   lacks `invoices:read`, it is 403.

## Gotchas

- **Claim names vary by environment**: this sample reads
  `user.permissions`. Adjust the accessor in
  `app/api/invoices/route.ts` to match your token's shape.
- **Missing permissions deny**: an absent or non-array `permissions`
  claim is treated as no permissions (403), not allow.
- **Published SDK lists `workspace:*`**: `@authdog/nextjs-app` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- **No unpublished helpers**: `@authdog/nextjs-app` `userCan` is a
  stub and `hasRequiredPermissions` is not exported from the server
  entry, so this sample uses the documented claims pattern.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/nextjs`.
