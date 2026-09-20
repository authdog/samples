# authdog authn on nextjs

Smallest App Router starter for Authdog identity using
`@authdog/nextjs-app`. Hosted Account portal sign-in, callback
exchange, and `useUser` on `/dashboard`.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in.
Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env.local` and set both variables to that
same public key.

In the console, send the Account portal back to a URL this app
serves (for local use, `http://localhost:3000/dashboard`). A
middleware forwards `?token=` to `/auth/callback`, which runs the
same userinfo exchange and cookie names as `useAuthMiddleware`.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## What to try

1. Sign in through the hosted Account portal, then open `/dashboard`.
   You should see `Signed in as` plus an email from userinfo.
2. Open `/dashboard` without a session. You should see `Not signed in`.
   Sign out clears the server cookies and the browser token.

## Gotchas

- **Published SDK lists `workspace:*`**: `@authdog/nextjs-app` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- **`useAuth` is not identity or authorization**: it only reports
  whether a browser token exists. This sample uses `useUser`, which
  calls userinfo.
- **`useAuthMiddleware` is not used here**: the published
  `@authdog/nextjs-app` server bundle crashes in Next.js 15 Edge
  middleware (`Native module not found:
  next/dist/server/web/spec-extension/request`). `/auth/callback`
  performs the same userinfo check and sets the same
  `user_session_*` cookies. It still does not guard later requests.
  Privileged Route Handlers need a [backend SDK](https://www.authdog.com/docs/backend).
- **JWT-shape regex is not validation**: the provider stores `?token=`
  after a shape check only. Real validation happens at userinfo.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/nextjs`. Do not treat
this dashboard as a permission check.
