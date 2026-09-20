# Research: Wave 4 Authentication

## Decision 1: Expo uses the published RN SDK

`@authdog/react-native@0.3.1` is on npm. The official guide is
`/docs/frameworks/expo`. Override `@authdog/node-commons` to `^0.3.1`
because the package still lists `workspace:*`.

## Decision 2: Native stacks are a REST / redirect bridge

`authdog/sdk` lists Swift, Kotlin, and Dart as planned. Do not invent
registry installs. Reuse the RN-documented URLs:

- Authorize: `{identityHost}/oidc/{environmentId}/authorize`
  (`client_id`, `response_type=code`, `scope=openid profile email`,
  `redirect_uri`)
- Return: `?token=` on the deep link
- Userinfo: `{identityHost}/oidc/{environmentId}/userinfo` + Bearer

Public-key parse matches node-commons: `pk_` + base64 JSON,
`environmentId` + `identityHost`, https only, host allowlist
`authdog.com` / `authdog.xyz`.

## Decision 3: Native samples are CLIs plus OS wiring notes

Linux CI cannot build iOS or Flutter device binaries. Each native
folder is a small CLI that prints the authorize URL and validates a
token, plus a README that names the OS browser
(`ASWebAuthenticationSession`, Custom Tabs, `url_launcher`).

## Decision 4: No authz folders

Wave 4 clients cannot enforce on the server. Next concept points at
`authz/express` and planned `observability/<stack>`.
