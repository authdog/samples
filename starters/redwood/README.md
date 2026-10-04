# Job board (RedwoodJS)

Docs Application starter. This folder is the Authdog slice for a
Redwood app, not a generated Redwood project. Drop the files into an
app from `yarn create redwood-app job-board`.

`initAuthdog()` keeps the callback token in the browser.
`requireAuth` on `api/src/functions/me.ts` is the identity gate.

## What this sample shows

Authentication (`authn`): who the caller is when a Redwood Function
validates the bearer token. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

```bash
yarn create redwood-app job-board
```

Copy `web/src/App.tsx` over the generated `App.tsx`. Copy
`api/src/functions/me.ts` and `logout.ts` into the api side. Install
`@authdog/redwood` in both workspaces:

```bash
yarn workspace web add @authdog/redwood
yarn workspace api add @authdog/redwood
```

Add `REDWOOD_ENV_AUTHDOG_PUBLIC_KEY` to `includeEnvironmentVariables`
in `redwood.toml`. Copy `.env.example` values into the Redwood `.env`.

## Run

From the Redwood app, not from this folder alone:

```bash
yarn rw dev
```

## What to try

1. Call `/.redwood/functions/me` with no token. You should get 401.
2. Finish hosted sign-in. `initAuthdog()` stores the token. Send it
   as `Authorization: Bearer` to the Function.

## Gotchas

- **This folder does not boot by itself.** Redwood's CLI owns the app
  scaffold.
- **localStorage is not the gate.** `requireAuth` on the api side is.
- Do not wrap `initAuthdog()` with `AuthdogProvider`. That provider
  strips the token and does not persist it.
- Do not log access tokens.

## Next concept

Open `authz` on a server stack before any permission check. In
services, read the user with `await authdog.getUser(context.event)`.
That read is still identity, not a permission grant.
