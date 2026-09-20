# authdog authz on node

Smallest Node.js authorization check using `@authdog/node-commons`.
It validates a bearer token, reads `user.permissions`, and prints
allow/deny.

## What this sample shows

Authorization (`authz`): the allow/deny decision that follows
authentication. The token proves identity; the `permissions` claim
makes the decision. Fail-closed: a missing claim is a deny.

## What you need first

Your authdog **public key** (`pk_...`) and an **access token** to
check. Never ask for or embed the secret key (`sk_...`) in client
code.

Set `PK_AUTHDOG` in your shell or a `.env` you load yourself.

## Run

```bash
npm install
PK_AUTHDOG=pk_... node src/index.js <access-token>
```

## What to try

1. With a token whose user **has** `invoices:read` →
   `200 OK: ... may read invoices.`
2. With a token whose user **lacks** it →
   `403 Forbidden: missing invoices:read`.
3. With a bad token → `401 Unauthorized`.

## Gotchas

- **Authentication is not authorization**: `fetchUserData` proves
  identity; the `permissions` check makes the decision.
- **Fail-closed**: a missing `permissions` claim is a deny.
- **Prefer the framework adapter when one exists**: `@authdog/express`
  and `@authdog/fastify` add session middleware and a `requireAuth`
  boundary on top of this core.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/node`.
