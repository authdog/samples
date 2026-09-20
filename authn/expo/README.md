# authdog authn on expo

Smallest Expo starter for Authdog mobile identity using
`@authdog/react-native`. `AuthdogProvider` plus SecureStore holds the
session. `useSignIn` opens the hosted flow; `useRedirectHandler`
completes it from a deep link; `useUser().fetchUser()` validates
against userinfo.

## What this sample shows

Authentication (`authn`): who the caller is after hosted sign-in, on
a device. Authentication is not authorization. Client-side state is
UX, not a security boundary.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_PK_AUTHDOG`.

In the console, register the deep-link callback this app uses (local
default `authdog-authn://callback`).

## Run

```bash
npm install
npx expo start
```

Open the project in Expo Go or a simulator.

## What to try

1. Tap **Sign in**, complete the hosted Account portal, and return
   through the deep link. You should see `Signed in as` plus an email
   from userinfo.
2. Tap **Sign out**. The identity clears.

## Gotchas

- **`workspace:*` on `@authdog/node-commons`**: the published RN
  package still lists a workspace dependency. This sample overrides
  it to `^0.3.1` so `npm install` works outside the SDK monorepo.
- **JWT-shape check is not validation**: `handleRedirect` stores
  `?token=` after a structure check only. Real validation is
  `fetchUser()` → userinfo, and your API must validate the bearer.
- **In-memory storage loses the session**: this sample uses
  `expo-secure-store`. Do not ship the in-memory fallback.
- **No `authz/expo`**: do not check permissions in the client as the
  authorization boundary. Pair with [`authz/express`](../../authz/express/).
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization is out of scope on this client. Pair with
[`authz/express`](../../authz/express/). Observability for this stack
is Planned: `observability/expo`.
