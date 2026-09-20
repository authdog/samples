# authdog authz on csharp

Smallest .NET authorization check using `Authdog.Sdk`. The package is
**not on NuGet**. It validates a bearer token, then reads
`user.permissions` for `invoices:read`. Fail-closed: a missing claim
is a deny.

The published `User` type does not model `permissions`. This sample
uses `GetUserInfoAsync` for identity and the official `RequestAsync`
helper on `GET /v1/userinfo` so the envelope still has the claim.

## What this sample shows

Authorization (`authz`): the allow/deny decision that follows
authentication. The token proves identity; the `permissions` claim
makes the decision. Authentication is not authorization.

## What you need first

An **access token** to check. Never ask for or embed the secret key
(`sk_...`). Grant a test user a role with the `invoices:read`
permission.

.NET **8.0+** is required.

## Run

```bash
git clone https://github.com/authdog/sdk.git /tmp/authdog-sdk
git -C /tmp/authdog-sdk checkout 9b9ad52f4b23e5e0bdcffa6dc591ecdb08c7e180
export AUTHDOG_SDK=/tmp/authdog-sdk
dotnet run -- <access-token>
```

Do not run `dotnet add package Authdog.Sdk` from nuget.org — that
package is not published.

## What to try

1. With a token whose user **has** `invoices:read` →
   `200 OK: ... may read invoices.`
2. With a token whose user **lacks** it →
   `403 Forbidden: missing invoices:read`.
3. With a bad token → `401 Unauthorized`.

## Gotchas

- **Not on NuGet**: set `AUTHDOG_SDK` to a pinned `authdog/sdk`
  checkout.
- **Authentication is not authorization**: `GetUserInfoAsync` proves
  identity; the `permissions` check makes the decision.
- **Typed `User` omits permissions**: read the claim from the
  userinfo envelope via `RequestAsync`. Do not invent a property on
  `User`.
- **Fail-closed**: a missing `permissions` claim is a deny.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Present: [`observability/csharp`](../../observability/csharp/).
