# authdog authn on csharp

Smallest .NET token validator using `Authdog.Sdk`. The package is
**not on NuGet**. Point this sample at a pinned checkout of
[`authdog/sdk`](https://github.com/authdog/sdk). It takes a bearer
token you already have and resolves it against `GET /v1/userinfo`.
This SDK does not use a public key.

## What this sample shows

Authentication (`authn`): who the caller is, proven by validating an
access token. Authentication is not authorization. This sample does
not host sign-in; pair it with a framework SDK or your own callback
that obtains the token.

## What you need first

An **access token** to validate. Never ask for or embed the secret
key (`sk_...`). This core SDK is constructed with
`https://api.authdog.com` and does not take a `pk_...` public key.

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

1. `dotnet run -- <valid-token>` → prints the userinfo user.
2. `dotnet run -- <bad-token>` → prints `401 Unauthorized` and exits
   non-zero.

## Gotchas

- **Not on NuGet**: set `AUTHDOG_SDK` to a pinned `authdog/sdk`
  checkout. Do not write a production `dotnet add package Authdog.Sdk`.
- **This validates tokens, it doesn't issue them**: obtain the token
  from a framework SDK's callback or your own redirect handler before
  calling `GetUserInfoAsync`.
- **Dispose clients you own**: this sample uses `await using` so the
  `HttpClient` is released.
- **`AuthenticationException` is the 401 path**: a bad, expired, or
  revoked token is not a fabricated user.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/csharp`. Apply
[authorization](https://www.authdog.com/docs/concepts/authorization)
after `GetUserInfoAsync`. Do not treat a successful userinfo call as a
permission grant.
