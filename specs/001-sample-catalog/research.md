# Research: Sample Catalog

**Feature**: `001-sample-catalog` | **Date**: 2026-09-20

## Decision 1: Concept-first layout

**Decision**: Samples live at `<concept>/<stack>/` (for example
`authn/nextjs`), not `<stack>/<concept>/`.

**Rationale**: The repository goal is to start from an Authdog
concept. Developers who already know their stack still scan one
concept table. Waves add stack folders under each concept over time.

**Alternatives considered**:

- Stack-first (`nextjs/authn`): nicer for copying a whole stack, but
  hides the concept catalog the user asked for.
- Flat (`nextjs-authn`): breaks wave and concept grouping.

## Decision 2: Five framework waves

**Decision**: Ship stacks in five waves ordered by official SDK
maturity and demand, using the same platform ids as
`authdog/agent-skills`.

| Wave | Stacks | Why this cohort |
| --- | --- | --- |
| 1 | nextjs, remix, express | Published session SDKs; highest copy-paste demand |
| 2 | sveltekit, vue, tanstack-start, angular, astro, fastify, node | Remaining official web + Node token validation |
| 3 | go, java, csharp, python | Language backends; Python labeled source-only |
| 4 | expo, ios-swift, android-kotlin, flutter-dart | Mobile; native stacks may use REST bridge |
| 5 | gatsby, redwood, react, rust | Long-tail web, UI-only kit, remaining source-only |

**Rationale**: An empty repo that tries every stack at once stays
empty. Wave 1 yields three usable authentication starters. Each later
wave is its own Spec Kit feature.

**Alternatives considered**:

- Concept waves (all stacks get authn, then all get authz): leaves
  most stacks unfinished for a long time and fights wave-gating on
  frameworks.
- Two waves only (web vs everything else): Wave 2 becomes too large
  for one implement run.
- Put Python in Wave 5 with Rust: technically cleaner (unreleased),
  but Python is mainstream and the user asked for mainstream
  technologies. Label source-only instead.

## Decision 3: Concept order inside a stack

**Decision**: `authn` → `authz` (if the stack can enforce on the
server) → `observability` → `lidar`. Skip `authz` for UI-only or
client-only stacks and link a sibling server sample.

**Rationale**: Matches Authdog's own split (identity, then access,
then the event stream, then identity SIEM) and constitution
principle IV.

**Alternatives considered**:

- Bundle all four concepts in one app: violates one-sample-per-concept
  and produces a product, not a starter.
- Lidar before observability: Lidar consumes the same event stream
  observability introduces.

## Decision 4: This feature is scaffolding only

**Decision**: FR-013 — no runnable stack applications in
`001-sample-catalog`. Deliver constitution, sample template, root
catalog, reserved concept directories, and Spec Kit artifacts.

**Rationale**: Spec Kit's complex-feature guidance: a catalog spec
should not also implement Wave 1 apps in the same run.

**Follow-up**: `/speckit-specify` for Wave 1 authentication samples
(`authn/nextjs`, `authn/remix`, `authn/express`).

## Decision 5: Stack ids match agent-skills

**Decision**: Reuse `authdog/agent-skills` directory names so samples
and skills resolve to the same platform.

**Rationale**: Agents and humans already search those ids. Inventing
`next-js` vs `nextjs` would fork the catalog.

## Decision 6: Reserved concept directories

**Decision**: Create empty `authn/`, `authz/`, `observability/`, and
`lidar/` directories (via `.gitkeep`) so the layout is visible before
Wave 1.

**Rationale**: The constitution names these directories; leaving them
absent makes the catalog look unimplemented rather than reserved.

## Open questions resolved without clarification

- MCP / agentic identity: out of scope until a later concept feature.
- ABAC / FGA variants: still `authz/<stack>`; the sample README names
  the environment model. Do not create `authz-rbac/` folders.
- Observability vs Lidar: Events API / webhooks vs monitors, Signals,
  and SIEM channels — already distinct in official docs.
