# authdog authn on astro

Smallest Astro SSR starter for Authdog identity using
`@authdog/astro`. The middleware reads the cookie; `getUser` validates
it on the profile page.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in.
Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PUBLIC_AUTHDOG_PUBLIC_KEY`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:4321/profile`). The server must set the
HttpOnly `authdog-session` cookie after validating the token; the
client bootstrap does not create it.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:4321

## What to try

1. Sign in through the hosted Account portal, then open `/profile`.
   You should see `Signed in as` plus an email from userinfo.
2. Open `/profile` without a session. You are redirected home.

## Gotchas

- **Middleware boolean ≠ authentication**: `locals.authdog.isAuthenticated`
  only means the cookie exists. This sample uses `getUser` for the
  decision.
- **Client bootstrap ≠ server cookie**: `initAuthdog()` stores the
  token in `localStorage`; the HttpOnly cookie must be set by your
  server callback/backend after validation.
- **SSR required**: the server helpers need `output: "server"` or
  `"hybrid"`.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/astro`.
