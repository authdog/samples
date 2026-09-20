# Research: Wave 3 Authentication

## Decision 1: Use official surfaces only

- Go: `github.com/authdog/web-sdk/packages/go` (Gin). Pin commit
  `52466b0888a2c369264c6af19ca1da3bd9804dda`. No tags exist.
- Java: `com.authdog:authdog-java-sdk` — `getUserInfo`. Not on
  Maven Central. Pin `authdog/sdk` commit
  `9b9ad52f4b23e5e0bdcffa6dc591ecdb08c7e180` and `mvn install`.
- C#: `Authdog.Sdk` — `GetUserInfoAsync`. Not on NuGet. Pin the
  same `authdog/sdk` commit and `ProjectReference` the csproj.
- Python: source-only `packages/python[fastapi]` from
  `authdog/web-sdk` commit `06bb9cec0eaead7a4ce0a2228473e1ecdf79d0c5`.
  Do not write `pip install authdog-fastapi` as a registry install.

## Decision 2: Session gates vs token CLIs

- Go and Python have session adapters (Gin / FastAPI) and mirror
  Wave 1 Express: informational session helper, `GET /me` gate,
  logout.
- Java and C# are token-validation SDKs with no session middleware.
  They mirror Wave 2 `authn/node`: CLI takes a bearer token and
  prints the userinfo user or exits non-zero.

## Decision 3: Credentials match the SDK

- Go and Python collect `PK_AUTHDOG` (`pk_...`) only.
- Java and C# collect an access token argument. They do not collect
  a public key because `AuthdogClient` does not use one. Base URL is
  the documented `https://api.authdog.com`.
- No sample collects `sk_...`.

## Decision 4: FastAPI 401 shape is the real surface

Python `require_auth` raises FastAPI `HTTPException(401, "Unauthorized")`,
which serializes as `{"detail":"Unauthorized"}`. Do not invent an
`error` field to match Express.

## Decision 5: Python extra is FastAPI

The Python package ships FastAPI, Django, Flask, Starlette, and
aiohttp extras. One sample per stack: FastAPI is the documented
first extra and matches the Express/Gin mental model.
