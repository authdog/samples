# authdog authz on fastify

Smallest Fastify starter for an Authdog server-side permission
decision using `@authdog/fastify`.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision.
`requireAuth` proves identity; a local `requirePermission` preHandler
checks `user.permissions` for `invoices:read`. Identity comes first;
permission comes second.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

Copy `.env.example` to `.env` and set `PK_AUTHDOG`. Grant a test user
a role with the `invoices:read` permission.

## Run

```bash
npm install
npm run dev
```

The server listens on http://localhost:3000

## What to try

1. `curl http://localhost:3000/invoices` → `401 Unauthorized`.
2. `curl -H "Authorization: Bearer <token>" http://localhost:3000/invoices`
   with a token whose user **lacks** `invoices:read` → `403 Forbidden`.
3. Same with a user who **has** it → the invoice list.

## Gotchas

- **Authentication is not authorization**: `requireAuth` proves
  identity; `requirePermission` makes the decision. Both run
  server-side.
- **Fail-closed**: a missing `permissions` claim is a deny.
- **The plugin is informational; `requireAuth` is the boundary**:
  anonymous context never fails the request.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/fastify`.
