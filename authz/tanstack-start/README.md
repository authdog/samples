# authdog authz on tanstack-start

Smallest TanStack Start starter for an Authdog server-side permission
decision using `@authdog/tanstack-start`.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision. The server
function validates the session with `identityLoader`, then checks
`user.permissions` for `invoices:read`. Identity comes first;
permission comes second.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:3000`). Grant a test user a role with the
`invoices:read` permission.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What to try

1. Sign in as a user **with** `invoices:read`, then open `/invoices` →
   the invoice list.
2. Sign in as a user **without** it → `403 Forbidden` message.
3. Open `/invoices` without a session → redirected home.

## Gotchas

- **Authentication is not authorization**: `identityLoader` proves
  identity; the `hasPermission` check makes the decision. Both run
  server-side.
- **Fail-closed**: a missing `permissions` claim is a deny.
- **Don't drop `Set-Cookie`**: return the loader's `Response` unchanged
  on the callback route.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned:
`observability/tanstack-start`.
