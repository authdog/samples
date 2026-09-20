# Specs

Spec Kit artifacts for this samples catalog. The constitution is
[`.specify/memory/constitution.md`](../.specify/memory/constitution.md).
Cursor skills live in `.cursor/skills/speckit-*`.

## What is already specified

| Folder | Status | Purpose |
| --- | --- | --- |
| [001-sample-catalog](./001-sample-catalog/) | Implemented | Layout, concepts, five framework waves, catalog scaffolding |
| [002-wave-1-authn](./002-wave-1-authn/) | Implemented | Wave 1 authentication: nextjs, remix, express |
| [003-wave-1-authz](./003-wave-1-authz/) | Implemented | Wave 1 authorization: nextjs, remix, express |
| [004-wave-2-authn](./004-wave-2-authn/) | Implemented | Wave 2 authentication: sveltekit, vue, tanstack-start, angular, astro, fastify, node |
| [005-wave-1-observability](./005-wave-1-observability/) | Implemented | Wave 1 observability: nextjs, remix, express |
| [006-wave-1-lidar](./006-wave-1-lidar/) | Implemented | Wave 1 Lidar: nextjs, remix, express |
| [007-wave-2-authz](./007-wave-2-authz/) | Implemented | Wave 2 authorization: sveltekit, vue, tanstack-start, angular, astro, fastify, node |
| [008-wave-2-observability](./008-wave-2-observability/) | Implemented | Wave 2 observability: sveltekit, vue, tanstack-start, angular, astro, fastify, node |
| [009-wave-2-lidar](./009-wave-2-lidar/) | Implemented | Wave 2 Lidar: sveltekit, vue, tanstack-start, angular, astro, fastify, node |
| [010-wave-3-authn](./010-wave-3-authn/) | Implemented | Wave 3 authentication: go, java, csharp, python |
| [011-wave-3-authz](./011-wave-3-authz/) | Implemented | Wave 3 authorization: go, java, csharp, python |

Start here: [001-sample-catalog/spec.md](./001-sample-catalog/spec.md),
then the [sample template](../.specify/templates/sample-template.md).

## Next waves

Wave 3 authentication is Present, so Wave 4 `authn` is allowed by
the wave gate. Default order still **deepens Wave 3 first**, then
opens Wave 4, matching how Wave 2 finished before Wave 3 `authn`.

One Spec Kit feature per row. Do not implement a later row until
the previous feature is Present or Deferred. In Cursor:
`/speckit-specify` the next cohort.

| # | Feature | Stacks | Shape |
| --- | --- | --- | --- |
| 011 | Wave 3 authorization (Present) | `go`, `java`, `csharp`, `python` | `go` / `python`: `GET /invoices` after the identity gate, `invoices:read`, 401 / 403 / 200. `java` / `csharp`: token CLI like `authz/node`. Fail-closed. Source-only labels stay. |
| 012 | Wave 3 observability | same | Signed webhook (`X-Authdog-Signature`) + Events API pull. `go` / `python` in-app. `java` / `csharp` standalone HTTP receiver (no invented SDK helper). Secrets stay server-only. |
| 013 | Wave 3 lidar | same | Same receiver rules; mark subject on a verified security event; `GET /sensitive` → 428 challenge, not a block. No Signals API. |
| 014 | Wave 4 authentication | `expo`, `ios-swift`, `android-kotlin`, `flutter-dart` | Identity only. Native stacks use the documented REST / redirect bridge until an official SDK ships. No `authz/<stack>`. |
| 015 | Wave 4 observability | same | Server-side concept: companion receiver or pair with `observability/express`. Do not put webhook secrets or API tokens on device. |
| 016 | Wave 4 lidar | same | Companion / paired-server step-up. Console Signals stay console-only. |
| 017 | Wave 5 authentication | `gatsby`, `redwood`, `react`, `rust` | `react` is UI-only (`@authdog/react-elements`). `rust` is source-only until a crate is published. |
| 018 | Wave 5 remaining concepts | per stack | `authz` only where the stack can enforce on the server (`gatsby`, `redwood`, `rust`). Skip `authz/react`. Then observability, then lidar. |

Start with **012 Wave 3 observability**. Tick the same list in
[`010-wave-3-authn/follow-ups.md`](./010-wave-3-authn/follow-ups.md).
MCP, agentic identity, and other new concepts still need their own
Spec Kit feature before any top-level folder.

## How to improve something

In Cursor, from the repo root:

1. `/speckit-specify` — new wave, new concept, or new kind of sample
2. `/speckit-clarify` — if the spec still has open questions
3. `/speckit-plan` — file-level plan
4. `/speckit-tasks` — implementable task list
5. `/speckit-implement` — execute tasks
6. `/speckit-converge` — compare files to spec/plan/tasks

Do not add a stack out of wave order, invent SDK surface, or treat
sign-in as a permission grant without updating the spec in the same
change.

## CLI

```bash
uv tool install specify-cli
specify check
```
