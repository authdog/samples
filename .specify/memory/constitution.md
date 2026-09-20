# Authdog Samples Constitution

## Core Principles

### I. One Sample Per Concept Per Stack

Each sample directory MUST cover exactly one Authdog concept on
exactly one technology stack. Do not merge unrelated concepts into a
single starter, and do not split one concept across multiple folders
for the same stack. A sample MAY link to a sibling sample when a
second stack is required (for example a UI kit plus a server gate).

Rationale: developers copy one folder to start. Ambiguous folders
make the catalog unusable.

### II. Real API Surface Only (NON-NEGOTIABLE)

A sample MUST use package names, env vars, hosts, and APIs that exist
in the current official docs or published SDK. If there is no official
SDK, the sample MUST say so and use the documented REST / redirect
bridge instead of inventing a client. Source-only or unreleased
packages MUST be labeled and MUST NOT be installed from a registry
that does not publish them. Illustrative hosts MUST be labeled as
such.

Rationale: invented surface becomes broken starter code.

### III. Quickstart, Not a Product

A sample MUST be the smallest runnable starter that demonstrates the
concept. No extra product features, design systems, or demo datasets
beyond what the concept needs. A newcomer MUST be able to clone the
folder, set the documented env vars, run the documented command, and
exercise the concept.

Rationale: this repo exists to start apps, not to showcase a
fictional product.

### IV. Authentication Is Not Authorization

Authentication samples MUST stop at proving identity (session, cookie,
or bearer). Authorization samples MUST take a validated identity and
ask the environment's access engine (RBAC, ABAC, or FGA) before a
protected action. Observability samples MUST show the identity event
stream (Events API and/or webhooks). Lidar samples MUST show identity
SIEM behavior (monitors, Signals, and/or a SIEM channel). A sample
MUST NOT treat a successful sign-in as a permission grant.

Rationale: copied snippets become production authz mistakes.

### V. Security Boundaries Stay Explicit

Client samples MUST collect only the public key (`pk_...`) and MUST
NOT ask for or embed the secret key (`sk_...`). Do not commit secrets,
`.env` files, or live keys. Do not log access tokens. Bearer tokens
go only to a trusted HTTPS identity host. Session helpers that never
reject bad tokens MUST be labeled informational; the named auth gate
is the authentication boundary.

Rationale: starters are pasted into real apps.

### VI. Wave-Gated Framework Delivery

Frameworks MUST ship in numbered waves defined by the root catalog.
A later wave MUST NOT start until the previous wave's authentication
samples are present or the catalog records an explicit deferral.
Within a stack, concepts MUST ship in this order: authentication,
then authorization (when the stack can enforce on the server), then
observability, then Lidar. New concepts (for example MCP or agentic
identity) MUST be added through Spec Kit before any sample uses them.

Rationale: parallel unfinished stacks produce an empty catalog;
waves keep the repo useful at every increment.

### VII. Spec Kit Governs Catalog Changes

Sample layout, required README sections, concept names, and wave
rules live in `.specify/memory/constitution.md` and `specs/`. New
concepts, new waves, or a new kind of sample MUST go through Spec Kit
(`/speckit-specify` → plan → tasks → implement). Do not invent a
parallel conventions doc.

Rationale: every starter must look like the others.

## Sample Layout

```
<concept>/
  <stack>/
    README.md       # required — standalone quickstart
    .env.example    # required when the sample needs env vars
    ...             # only the files needed to run
```

Canonical concept directory names: `authn`, `authz`, `observability`,
`lidar`. Stack directory names MUST be lowercase kebab-case and MUST
match the catalog id (for example `nextjs`, `express`, `ios-swift`).

The root README MUST list every sample with its wave and status.
Adding a sample without a catalog row is incomplete.

## Implementation Waves

Waves are framework cohorts, not concept releases. Membership is
recorded in the root catalog and MAY change through a Spec Kit
feature. The gating rules in principle VI do not change without a
constitution amendment.

| Wave | Intent |
| --- | --- |
| 1 | Flagship published web and Node session stacks |
| 2 | Remaining official web frameworks plus Node token validation |
| 3 | Official language backends (plus labeled Python source extras) |
| 4 | Mobile and native clients |
| 5 | Long-tail web, UI-only, and remaining source-only stacks |

## Security

- Do not commit secrets, `.env` files, or live `pk_` / `sk_` values.
- `.env.example` MUST use placeholders only.
- Do not log access tokens in sample output.
- Bearer tokens go only to a trusted HTTPS identity host.

## Development Workflow

- Author against current authdog docs or the SDK source, not memory.
- Commits use Conventional Commits (`feat:`, `fix:`, `docs:`).
- In Cursor: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks`
  → `/speckit-implement` → `/speckit-converge`.
- Prefer one Spec Kit feature per wave (or per concept added to an
  existing wave), not one feature that implements every stack.

## Governance

This constitution supersedes ad-hoc README guidance when they
conflict. Amendments:

1. Update this file and bump **Version** (MAJOR for removed or
   redefined principles, MINOR for new principles or material
   expansion, PATCH for clarification).
2. Set **Last Amended** to the change date.
3. If a principle change invalidates a spec or sample template, update
   those files in the same change set.

Reviews MUST check: one concept per stack folder, real API surface,
required README sections, wave gating, and a catalog row for every
sample.

Runtime guidance for agents lives in `.specify/` templates and
`specs/`. Do not fork a second set of principles in chat.

**Version**: 1.0.0 | **Ratified**: 2026-09-20 | **Last Amended**: 2026-09-20
