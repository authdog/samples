# Policy service (Rust)

Docs Application starter. `authdog-axum` is **source-only**. This
binary depends on a sibling checkout of
[authdog/web-sdk](https://github.com/authdog/web-sdk) at
`../../../web-sdk/packages/rust/axum` (the `samples` and `web-sdk`
repos next to each other). `require_auth` on `GET /me` is the identity
gate. Axum is one of the adapters; Actix Web, Rocket, Warp, and Poem
share the same core.

## What this sample shows

Authentication (`authn`): who the caller is after a validated session.
Hosted sign-in still happens in a browser. Authentication is not
authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Clone `authdog/web-sdk` next to `samples`:

```
authdog/samples
authdog/web-sdk
```

Copy `.env.example` and export `PK_AUTHDOG`. Rust **1.75+**.

## Run

```bash
export PK_AUTHDOG=pk_...
cargo run
```

Open http://127.0.0.1:3000

## What to try

1. `curl -i http://127.0.0.1:3000/me` with no session. You should get
   401.
2. Send a session:

```bash
curl -i http://127.0.0.1:3000/me \
  -H "Authorization: Bearer <token>"
```

## Gotchas

- **Not on crates.io for this checkout.** Do not `cargo add
  authdog-axum` against the registry until a release exists. The path
  dependency is the pin.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

This stack can enforce on the server. There is no `authz/rust` sample
yet. Do not treat a successful sign-in as a permission grant.
