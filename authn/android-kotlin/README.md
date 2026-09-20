# authdog authn on android-kotlin

There is **no official Kotlin SDK** yet (it is listed as planned in
[`authdog/sdk`](https://github.com/authdog/sdk)). This sample is the
documented REST / redirect bridge used by `@authdog/react-native`:
parse `pk_...`, open the hosted authorize URL, read `?token=` from
the deep-link return, then call OIDC userinfo.

## What this sample shows

Authentication (`authn`): who the caller is after a hosted redirect.
Authentication is not authorization. This CLI does not host a UI.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and export `PK_AUTHDOG`. Register a
deep-link redirect (for example `myapp://callback`) on the environment.

Java **17+** and Gradle are required.

## Run

```bash
export PK_AUTHDOG=pk_...
./gradlew run --args='authorize myapp://callback'
```

On Android, open that URL with Chrome Custom Tabs. After the portal
returns, take `?token=` from the callback and validate it:

```bash
./gradlew run --args='userinfo <access-token>'
```

Do not add an Authdog artifact from Maven Central — that coordinate
is not published.

## What to try

1. `authorize` prints `{identityHost}/oidc/{environmentId}/authorize`.
2. Complete hosted sign-in and pass the returned token to `userinfo`
   → prints the userinfo user.
3. A bad token → `401 Unauthorized` and a non-zero exit.

## Gotchas

- **No official Kotlin SDK**: this is the REST / redirect bridge, not
  an Android library from Authdog.
- **Trusted hosts only**: the parser allows `authdog.com` and
  `authdog.xyz` over https, matching `@authdog/node-commons`.
- **`?token=` shape is not validation**: userinfo is the identity
  check. Your API must validate the bearer too.
- **No `authz/android-kotlin`**: pair with
  [`authz/express`](../../authz/express/).
- Do not log access tokens.

## Next concept

Authorization is out of scope on this client. Pair with
[`authz/express`](../../authz/express/). Observability for this stack
is Planned: `observability/android-kotlin`.
