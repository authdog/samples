# authdog authn on vue

Smallest Vue 3 starter for Authdog browser identity using
`@authdog/vue`. `AuthdogProvider` bootstraps the token;
`useUser().fetchUser(publicKey)` validates it against userinfo.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in, in
the browser. Authentication is not authorization. This sample does not
protect any server route.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `VITE_AUTHDOG_PUBLIC_KEY`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:5173`).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What to try

1. Click **Sign in** and complete the hosted Account portal flow.
   You should see `Signed in as` plus an email from userinfo.
2. Click **Sign out**. The identity clears.

## Gotchas

- **Browser-only**: this sample has no server. Client-side state is UX,
  not a security boundary. Protect APIs with a backend SDK.
- **JWT-shape regex is not validation**: the provider stores `?token=`
  after a shape check only. Real validation happens at `fetchUser()` →
  userinfo.
- **No Nuxt module**: there is no Nuxt adapter. Wire server validation
  yourself with a backend SDK.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/vue`.
