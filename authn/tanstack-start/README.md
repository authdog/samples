# authdog authn on tanstack-start

Smallest TanStack Start starter for Authdog identity using
`@authdog/tanstack-start`. The server `identityLoader` exchanges the
callback and resolves identity; `logoutLoader` clears the cookies.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in.
Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:3000`).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What to try

1. Sign in through the hosted Account portal. The server loader sets
   the session cookies and the home page shows `Signed in as` plus an
   email from userinfo.
2. Open `/api/logout`. The cookies clear and you are signed out.

## Gotchas

- **`AuthdogProvider` is presentational cleanup, not an auth
  provider**: it strips `?token=` and reloads; it does not validate,
  persist, or guard. The server loader runs first on the original
  request.
- **Don't drop `Set-Cookie`**: return the loader's `Response`
  unchanged. Calling `.json()` and rebuilding the response loses both
  cookie headers.
- **The loader doesn't deny access**: it reports `isAuthenticated`;
  protected handlers must enforce it.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/tanstack-start`.
