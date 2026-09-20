# authdog/samples

Quick starters for [Authdog](https://www.authdog.com) concepts on
mainstream stacks. Copy one folder, set the public key, run the
README.

Concepts:

| Concept | What the starter proves |
| --- | --- |
| [`authn`](authn/) | Identity — session, cookie, or bearer |
| [`authz`](authz/) | Server-side allow or deny after identity |
| [`observability`](observability/) | Identity event stream (Events API and/or webhooks) |
| [`lidar`](lidar/) | Identity SIEM — monitors, Signals, and/or a SIEM channel |

Authentication is not authorization. A successful sign-in is not a
permission grant.

## Layout

```
<concept>/<stack>/
  README.md       # required standalone quickstart
  .env.example    # placeholders only
```

Copy [`.specify/templates/sample-template.md`](.specify/templates/sample-template.md).
Required README sections, in order: What this sample shows → What you
need first → Run → What to try → Gotchas → Next concept.

## Concept path

On a stack that can enforce access on the server:

`authn` → `authz` → `observability` → `lidar`

Exceptions:

- **UI-only** (`react`): authentication (or elements usage) only. Link
  a session stack such as `nextjs` or `remix`. Do not check permissions
  in the client.
- **Mobile / native** (`expo`, `ios-swift`, `android-kotlin`,
  `flutter-dart`): no `authz/<stack>` folder. Pair with a Wave 1–3
  server sample for authorization.
- **No official SDK**: the sample MUST say so and use the documented
  REST / redirect bridge. Do not invent a client.

New concepts (MCP, agentic identity, and similar) need a Spec Kit
feature before they get a top-level folder.

## Implementation waves

Stacks ship in numbered waves. A later wave's authentication samples
MUST NOT start while the previous wave still has `Planned`
authentication rows (mark a row `Deferred` with a reason to skip it).
Within a stack, do not mark `authz`, `observability`, or `lidar`
`Present` before that stack's `authn` is `Present`.

| Wave | Intent | Stacks |
| --- | --- | --- |
| 1 | Flagship published web and Node session stacks | `nextjs`, `remix`, `express` |
| 2 | Remaining official web frameworks plus Node token validation | `sveltekit`, `vue`, `tanstack-start`, `angular`, `astro`, `fastify`, `node` |
| 3 | Official language backends, plus labeled Python source extras | `go`, `java`, `csharp`, `python` |
| 4 | Mobile and native clients | `expo`, `ios-swift`, `android-kotlin`, `flutter-dart` |
| 5 | Long-tail web, UI-only, and remaining source-only stacks | `gatsby`, `redwood`, `react`, `rust` |

`—` in the catalog means that concept is not applicable on that stack.

### Wave 1

| Stack | authn | authz | observability | lidar |
| --- | --- | --- | --- | --- |
| `nextjs` | [Present](authn/nextjs/) | [Present](authz/nextjs/) | Planned | Planned |
| `remix` | [Present](authn/remix/) | [Present](authz/remix/) | Planned | Planned |
| `express` | [Present](authn/express/) | [Present](authz/express/) | Planned | Planned |

### Wave 2

| Stack | authn | authz | observability | lidar |
| --- | --- | --- | --- | --- |
| `sveltekit` | Planned | Planned | Planned | Planned |
| `vue` | Planned | Planned | Planned | Planned |
| `tanstack-start` | Planned | Planned | Planned | Planned |
| `angular` | Planned | Planned | Planned | Planned |
| `astro` | Planned | Planned | Planned | Planned |
| `fastify` | Planned | Planned | Planned | Planned |
| `node` | Planned | Planned | Planned | Planned |

### Wave 3

| Stack | authn | authz | observability | lidar |
| --- | --- | --- | --- | --- |
| `go` | Planned | Planned | Planned | Planned |
| `java` | Planned | Planned | Planned | Planned |
| `csharp` | Planned | Planned | Planned | Planned |
| `python` | Planned | Planned | Planned | Planned |

`python` extras are source-only today. Samples MUST say so and MUST
NOT use a PyPI install that does not exist.

### Wave 4

| Stack | authn | authz | observability | lidar |
| --- | --- | --- | --- | --- |
| `expo` | Planned | — | Planned | Planned |
| `ios-swift` | Planned | — | Planned | Planned |
| `android-kotlin` | Planned | — | Planned | Planned |
| `flutter-dart` | Planned | — | Planned | Planned |

Native stacks (`ios-swift`, `android-kotlin`, `flutter-dart`) have no
official SDK yet. Samples MUST document the REST / redirect bridge.

### Wave 5

| Stack | authn | authz | observability | lidar |
| --- | --- | --- | --- | --- |
| `gatsby` | Planned | Planned | Planned | Planned |
| `redwood` | Planned | Planned | Planned | Planned |
| `react` | Planned | — | — | — |
| `rust` | Planned | Planned | Planned | Planned |

`react` is the presentational UI kit (`@authdog/react-elements`), not
a session SDK. `rust` is source-only until a crate is published.

## Adding a sample

1. Confirm the stack's wave may start (previous wave `authn` rows are
   `Present` or `Deferred`).
2. Confirm `authn/<stack>` is `Present` before adding other concepts.
3. Copy [`.specify/templates/sample-template.md`](.specify/templates/sample-template.md)
   to `<concept>/<stack>/README.md`.
4. Keep the required sections in order. Use only real Authdog docs or
   SDK surface. Client samples collect the public key (`pk_...`) only.
5. Add `.env.example` with placeholders if the sample needs env vars.
   Never commit `.env` or live keys.
6. Set the matching catalog cell to `Present` (link the folder).

For a new *kind* of sample, a new concept, or a wave-membership
change, run `/speckit-specify` first.

## Specs

This repo uses [GitHub Spec Kit](https://github.com/github/spec-kit)
to govern layout, concepts, and waves.

- Constitution: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
- Catalog feature: [`specs/001-sample-catalog/`](specs/001-sample-catalog/)
- How to iterate: [`specs/README.md`](specs/README.md)

In Cursor: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement` → `/speckit-converge`.

Next feature: Wave 1 observability, or Wave 2 authentication.
