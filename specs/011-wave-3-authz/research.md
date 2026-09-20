# Research: Wave 3 Authorization

## Decision 1: Local permission helper, not an SDK export

None of the Wave 3 packages export `RequirePermission`. Mirror
Express/Fastify: `RequireAuth` / `require_auth` first, then a local
fail-closed check on `user.permissions` for `invoices:read`.

## Decision 2: Session gates vs token CLIs

- Go (Gin) and Python (FastAPI): `GET /invoices` → 401 / 403 / 200.
- Java and C#: CLI like `authz/node` (401 exit 1, 403/200 printed).

## Decision 3: Java/C# typed User omits permissions

`com.authdog.types.User` and `Authdog.Types.User` have no
`permissions` field, so Jackson/Newtonsoft drop the claim. Identity
still uses `getUserInfo` / `GetUserInfoAsync`. The authorization
read uses the official `request` / `RequestAsync` helper on
`GET /v1/userinfo` so the envelope keeps `user.permissions`. Do not
invent a field on `User`.

## Decision 4: Source-only pins stay

Same commits and install steps as `authn/{java,csharp,python}`.
Go pins `v0.0.0-20260710181327-52466b0888a2`.
