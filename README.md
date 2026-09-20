<p align="center">
  <img width="420" alt="Authdog" src="https://raw.githubusercontent.com/authdog/.github/main/profile/logo-light.svg#gh-light-mode-only" />
  <img width="420" alt="Authdog" src="https://raw.githubusercontent.com/authdog/.github/main/profile/logo-dark.svg#gh-dark-mode-only" />
</p>

<p align="center">
<b>Agentic Identity, Access Control, Observability.</b>
</p>

<p align="center">
<a href="https://www.authdog.com">Website</a> ·
<a href="https://www.authdog.com/docs">Docs</a> ·
<a href="https://www.authdog.com/pricing">Pricing</a> ·
<a href="https://console.authdog.com">Console</a> ·
<a href="https://status.authdog.com">Status</a>
</p>

Quick starters for [Authdog](https://www.authdog.com) on mainstream stacks. Copy one folder, set the public key, run the README.

Authentication is not authorization. A successful sign-in is not a permission grant.

## Authentication

Identity — session, cookie, or bearer. Who the caller is.

| Sample | Stack | What it shows |
| --- | --- | --- |
| [`authn/nextjs`](authn/nextjs/) | Next.js | Hosted Account portal, App Router callback, `useUser` |
| [`authn/remix`](authn/remix/) | Remix | Hosted sign-in, `identityLoader`, HttpOnly cookies |
| [`authn/express`](authn/express/) | Express | Session attach and `requireAuth` gate |
| [`authn/sveltekit`](authn/sveltekit/) | SvelteKit | Handle hook, `getUser`, hosted sign-in |
| [`authn/vue`](authn/vue/) | Vue | Browser identity with `AuthdogProvider` and userinfo |
| [`authn/tanstack-start`](authn/tanstack-start/) | TanStack Start | Hosted sign-in and `identityLoader` |
| [`authn/angular`](authn/angular/) | Angular | Standalone browser identity |
| [`authn/astro`](authn/astro/) | Astro | SSR hosted sign-in |
| [`authn/fastify`](authn/fastify/) | Fastify | Plugin session and `requireAuth` preHandler |
| [`authn/node`](authn/node/) | Node.js | Bearer token validation with `@authdog/node-commons` |

## Access Control

One environment, one model. The check from your app stays the same. These starters take a validated identity and allow or deny.

| Sample | Stack | What it shows |
| --- | --- | --- |
| [`authz/nextjs`](authz/nextjs/) | Next.js | Server allow/deny after session (`invoices:read`) |
| [`authz/remix`](authz/remix/) | Remix | Server allow/deny after identity |
| [`authz/express`](authz/express/) | Express | Server allow/deny after session |
| [`authz/sveltekit`](authz/sveltekit/) | SvelteKit | Load-function allow/deny |
| [`authz/vue`](authz/vue/) | Vue | Browser UI hint only — pair with a server sample |
| [`authz/tanstack-start`](authz/tanstack-start/) | TanStack Start | Server allow/deny after identity |
| [`authz/angular`](authz/angular/) | Angular | Browser UI hint only — pair with a server sample |
| [`authz/astro`](authz/astro/) | Astro | SSR page allow/deny |
| [`authz/fastify`](authz/fastify/) | Fastify | preHandler allow/deny |
| [`authz/node`](authz/node/) | Node.js | Token plus permission check |

Do not check permissions in the client as the authorization boundary.

## Observability

The identity event stream — webhooks push signed events; the Events API pulls them.

| Sample | Stack | What it shows |
| --- | --- | --- |
| [`observability/nextjs`](observability/nextjs/) | Next.js | Signed webhook receiver and Events API read |
| [`observability/remix`](observability/remix/) | Remix | Signed webhook receiver and Events API read |
| [`observability/express`](observability/express/) | Express | Signed webhook receiver and Events API read |
| [`observability/sveltekit`](observability/sveltekit/) | SvelteKit | Signed webhook receiver and Events API read |
| [`observability/vue`](observability/vue/) | Vue | Companion Node webhook receiver (SPA) |
| [`observability/tanstack-start`](observability/tanstack-start/) | TanStack Start | Signed webhook receiver and Events API read |
| [`observability/angular`](observability/angular/) | Angular | Companion Node webhook receiver (SPA) |
| [`observability/astro`](observability/astro/) | Astro | Signed webhook receiver and Events API read |
| [`observability/fastify`](observability/fastify/) | Fastify | Signed webhook receiver and Events API read |
| [`observability/node`](observability/node/) | Node.js | Signed webhook receiver on `node:http` |

This is not Lidar. Lidar runs detectors inside Authdog and surfaces Signals in the console.

## Lidar

Identity SIEM — monitors, Signals, and a step-up challenge when a security-relevant event fires. Signals live in the console; there is no public Signals API.

| Sample | Stack | What it shows |
| --- | --- | --- |
| [`lidar/nextjs`](lidar/nextjs/) | Next.js | React to the event stream with a challenge |
| [`lidar/remix`](lidar/remix/) | Remix | React to the event stream with a challenge |
| [`lidar/express`](lidar/express/) | Express | React to the event stream with a challenge |
| [`lidar/sveltekit`](lidar/sveltekit/) | SvelteKit | React to the event stream with a challenge |
| [`lidar/vue`](lidar/vue/) | Vue | Companion Node Lidar receiver (SPA) |
| [`lidar/tanstack-start`](lidar/tanstack-start/) | TanStack Start | React to the event stream with a challenge |
| [`lidar/angular`](lidar/angular/) | Angular | Companion Node Lidar receiver (SPA) |
| [`lidar/astro`](lidar/astro/) | Astro | React to the event stream with a challenge |
| [`lidar/fastify`](lidar/fastify/) | Fastify | React to the event stream with a challenge |
| [`lidar/node`](lidar/node/) | Node.js | React to the event stream on `node:http` |

## Coming next

On a stack that can enforce access on the server:

`authn` → `authz` → `observability` → `lidar`

| Wave | Stacks | Status |
| --- | --- | --- |
| 3 | `go`, `java`, `csharp`, `python` | Planned — language backends (`python` extras are source-only) |
| 4 | `expo`, `ios-swift`, `android-kotlin`, `flutter-dart` | Planned — mobile / native; no `authz/<stack>` (pair with a server sample). Native stacks use the REST / redirect bridge until an official SDK ships |
| 5 | `gatsby`, `redwood`, `react`, `rust` | Planned — `react` is UI-only (`@authdog/react-elements`); `rust` is source-only until a crate is published |

## SDKs and docs

| Repo | What it is |
| --- | --- |
| [web-sdk](https://github.com/authdog/web-sdk) | Framework SDKs for web, mobile, and backends |
| [sdk](https://github.com/authdog/sdk) | Language SDKs for Authdog APIs |
| [cli](https://github.com/authdog/cli) | Official CLI for management and identity services |
| [agent-skills](https://github.com/authdog/agent-skills) | Skills for agentic onboarding onto Authdog |

Point an agent at [`/llms.txt`](https://www.authdog.com/llms.txt) — every guide is also available as Markdown.

## Layout

```
<concept>/<stack>/
  README.md       # required standalone quickstart
  .env.example    # placeholders only
```

Copy [`.specify/templates/sample-template.md`](.specify/templates/sample-template.md).
Required README sections, in order: What this sample shows → What you
need first → Run → What to try → Gotchas → Next concept.

New concepts (MCP, agentic identity, and similar) need a Spec Kit
feature before they get a top-level folder.

## Adding a sample

1. Confirm the stack's wave may start (previous wave `authn` rows are
   present or deferred).
2. Confirm `authn/<stack>` exists before adding other concepts.
3. Copy [`.specify/templates/sample-template.md`](.specify/templates/sample-template.md)
   to `<concept>/<stack>/README.md`.
4. Keep the required sections in order. Use only real Authdog docs or
   SDK surface. Client samples collect the public key (`pk_...`) only.
5. Add `.env.example` with placeholders if the sample needs env vars.
   Never commit `.env` or live keys.
6. Add a row to the listing above.

For a new *kind* of sample, a new concept, or a wave-membership
change, run `/speckit-specify` first.

## Specs

This repo uses [GitHub Spec Kit](https://github.com/github/spec-kit)
to govern layout, concepts, and waves.

- Constitution: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
- Catalog feature: [`specs/001-sample-catalog/`](specs/001-sample-catalog/)
- How to iterate: [`specs/README.md`](specs/README.md)
