# authdog authn on node

Smallest Node.js token validator using `@authdog/node-commons`, the
shared core every authdog Node SDK builds on. It takes a bearer token
you already have and resolves it against userinfo.

## What this sample shows

Authentication (`authn`): who the caller is, proven by validating an
access token. Authentication is not authorization. This sample does
not host sign-in; pair it with a framework SDK or your own callback
that obtains the token.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings,
and an **access token** to validate. Never ask for or embed the secret
key (`sk_...`) in client code.

Set `PK_AUTHDOG` in your shell or a `.env` you load yourself.

## Run

```bash
npm install
PK_AUTHDOG=pk_... node src/index.js <access-token>
```

## What to try

1. `PK_AUTHDOG=pk_... node src/index.js <valid-token>` → prints the
   userinfo user.
2. `PK_AUTHDOG=pk_... node src/index.js <bad-token>` → prints
   `401 Unauthorized` and exits non-zero.

## Gotchas

- **Prefer the framework adapter when one exists**: `@authdog/express`
  and `@authdog/fastify` add session middleware and a `requireAuth`
  boundary on top of this core. Use `node-commons` directly only when
  there's no adapter for your stack.
- **This validates tokens, it doesn't issue them**: obtain the token
  from a framework SDK's callback or your own redirect handler.
- **`isAuthenticatedUserInfo` is the decision**: `fetchUserData`
  returns the envelope; only a success envelope with a user
  authenticates the caller.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/node`.
