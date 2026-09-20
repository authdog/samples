# authdog authz on vue

Smallest Vue 3 starter for an Authdog permission **UI hint** using
`@authdog/vue`'s `useAuthz`.

## What this sample shows

Authorization (`authz`) as a browser UI hint: show or hide the
invoices panel with `useAuthz().hasPermission("invoices:read")`. This
is not a security boundary — a browser check can be bypassed. Enforce
access on a backend.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `VITE_AUTHDOG_PUBLIC_KEY`. Grant
a test user a role with the `invoices:read` permission.

In the console, send the Account portal back to this app (for local
use, `http://localhost:5173`).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What to try

1. Sign in as a user **with** `invoices:read` → the invoices panel
   shows.
2. Sign in as a user **without** it → the panel is hidden.

## Gotchas

- **UI hint, not enforcement**: `useAuthz` shows/hides UI only. A
  browser check can be bypassed; enforce access on your backend with a
  server SDK.
- **Authentication is not authorization**: `fetchUser` proves identity;
  the permission check shapes the UI. The real decision is server-side.
- **No Nuxt module**: wire server validation yourself with a backend
  SDK.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/vue`.
