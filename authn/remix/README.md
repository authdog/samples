# authdog authn on remix

Smallest Remix v2 starter for Authdog identity using
`@authdog/remix-node`. Root `identityLoader` exchanges the callback,
`AuthdogProvider` strips `?token=`, and `/profile` enforces identity.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in.
Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`.

In the console, send the Account portal back to this app (for local
use, `http://localhost:5173`). The root loader must receive `?token=`.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## What to try

1. Sign in through the hosted Account portal, then open `/profile`.
   You should see `Signed in as` plus an email from userinfo.
2. Open `/profile` without a session. You are redirected to the
   loader's `signinUri`. `/logout` clears the session cookies.

## Gotchas

- **Published SDK lists `workspace:*`**: `@authdog/remix-node` depends on
  `@authdog/node-commons` as `workspace:*`. This sample pins
  `@authdog/node-commons` with an npm override so `npm install` works
  outside the SDK monorepo.
- **The loader does not deny access by itself**: `identityLoader`
  returns an unauthenticated result. `/profile` checks
  `isAuthenticated` and redirects.
- **Preserve `Set-Cookie` on callback**: do not take the root
  callback response, call `.json()`, and drop the headers. This
  sample keeps callback exchange on the root loader.
- **Client cleanup vs server cookie**: `AuthdogProvider` strips
  `?token=`; the HttpOnly cookie is set by the server loader.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/remix`. Do not treat
`/profile` as a permission check.
