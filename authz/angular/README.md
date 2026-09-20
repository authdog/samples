# authdog authz on angular

Smallest standalone Angular starter for an Authdog permission **UI
hint** using `@authdog/angular`.

## What this sample shows

Authorization (`authz`) as a browser UI hint: show or hide the
invoices panel from the user's `permissions` claim. This is not a
security boundary — a browser check can be bypassed. Enforce access on
a backend.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Angular has no built-in `.env`. Set the key in
`src/environments/environment.ts` for local use, or inject it via your
build. Never commit a real key. Grant a test user a role with the
`invoices:read` permission.

In the console, send the Account portal back to this app (for local
use, `http://localhost:4200`).

## Run

```bash
npm install
npm start
```

Open http://localhost:4200

## What to try

1. Sign in as a user **with** `invoices:read`, then open **Invoices** →
   the list shows.
2. Sign in as a user **without** it → the list is hidden.

## Gotchas

- **UI hint, not enforcement**: the claim shapes UI only. A browser
  check can be bypassed; enforce access on your backend with a server
  SDK.
- **`authdogGuard` is UX, not security**: a client route guard can be
  bypassed in the browser.
- **`isAuthenticated()` requires `fetchUser()`**: call `fetchUser()` on
  init so the claims are loaded.
- **Interceptor attaches the bearer to all requests**: scope it or
  strip the header for non-authdog origins.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/angular`.
