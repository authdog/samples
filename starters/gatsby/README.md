# Resource library (Gatsby)

Docs Application starter. `@authdog/gatsby` stores the callback token
in the browser and `requireAuth` gates the `me` Function. The browser
store is not cryptographic validation. The Function is the identity
gate.

## What this sample shows

Authentication (`authn`): who the caller is when a Gatsby Function
validates the bearer token. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set both values to the same public
key. Gatsby loads `.env` for `PK_AUTHDOG` and exposes
`GATSBY_AUTHDOG_PUBLIC_KEY` to the browser.

## Run

```bash
npm install
npm run develop
```

Open http://localhost:8000

## What to try

1. Click **GET /api/me** with no token. The Function returns 401.
2. Finish hosted sign-in so `?token=` is present. `initAuthdog()`
   keeps it, then **GET /api/me** sends `Authorization: Bearer`.

## Gotchas

- **localStorage is not the gate**: `initAuthdog()` only checks JWT
  shape. `requireAuth` on the Function calls userinfo.
- Do not mount `AuthdogProvider` around this bootstrap. It can strip
  the token before it is stored.
- Do not log access tokens.

## Next concept

Open `authz` on a server stack before any permission check. This
folder has no authorization sample.
