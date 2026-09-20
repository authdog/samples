# authdog authn on angular

Smallest standalone Angular starter for Authdog browser identity using
`@authdog/angular`. `provideAuthdog` wires the service and interceptor;
`AuthdogService.fetchUser()` validates the token against userinfo.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in, in
the browser. Authentication is not authorization. The route guard is
UX, not a security boundary.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Angular has no built-in `.env`. Set the key in
`src/environments/environment.ts` for local use, or inject it via your
build. Never commit a real key.

In the console, send the Account portal back to this app (for local
use, `http://localhost:4200`).

## Run

```bash
npm install
npm start
```

Open http://localhost:4200

## What to try

1. Click **Sign in** and complete the hosted Account portal flow.
   Open **Profile** — you should see `Signed in as` plus an email from
   userinfo.
2. Click **Sign out**. The identity clears.

## Gotchas

- **`authdogGuard` is UX, not security**: a client route guard can be
  bypassed in the browser. Enforce access server-side.
- **`isAuthenticated()` requires `fetchUser()`**: it only flips true
  after userinfo returns a user. Call `fetchUser()` on init.
- **Interceptor attaches the bearer to all requests**: scope it or
  strip the header for non-authdog origins.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/angular`.
