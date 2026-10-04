# Customer navbar (React)

Docs Application starter. `@authdog/react-elements` is UI only. The
navbar opens hosted sign-in. It does not mint a session. Pair it with
`starters/nextjs` or a backend starter for the gate.

## What this sample shows

Authentication (`authn`) as a browser control. Authentication is not
authorization. There is no server identity gate in this folder.

## What you need first

The identity host and environment id for your Authdog environment,
from the [authdog console](https://console.authdog.com/). Never ask
for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and fill both values.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints.

## What to try

1. Click the sign-in control. You should land on the hosted flow for
   that environment.
2. After return, this app still has no session. That is expected.
   Continue in `starters/nextjs`.

## Gotchas

- **Wrong host**: `VITE_AUTHDOG_IDENTITY_HOST` is the identity origin,
  not `console.authdog.com`.
- **No session after return**: elements do not store a cookie. Use a
  server framework for the gate.
- Do not log access tokens.

## Next concept

UI-only. Open `authn` on a server stack (`starters/express` or
`starters/nextjs`) before any permission check. Do not check
permissions in the client.
