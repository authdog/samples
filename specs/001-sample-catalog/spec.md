# Feature Specification: Sample Catalog

**Feature Branch**: `001-sample-catalog`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Configure Spec Kit for this repository. The goal is quick samples that start an Authdog concept — authentication, authorization, observability, Lidar integration, and later concepts — on mainstream technologies. Define multiple waves for framework implementation."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer finds a starter for one concept on one stack (Priority: P1)

A developer (or coding agent) wants to add an Authdog concept to a new or existing app. They open the catalog, pick the concept they need and the stack they already use, copy that one folder, follow its README, and exercise the concept without reading any other sample.

**Why this priority**: Discovery and a single copyable starter are the product.

**Independent Test**: Given a request such as "start Authdog authentication on the flagship web stack", a reader can identify exactly one catalog row and complete the flow from that sample's README alone.

**Acceptance Scenarios**:

1. **Given** the root catalog, **When** a developer looks up a concept and a stack, **Then** there is at most one folder for that pair and the catalog row points at it.
2. **Given** a sample README, **When** the developer follows it without other repo files, **Then** they know what the sample shows, what to set first, how to run it, what to try, the pitfalls, and which concept to do next.
3. **Given** a client sample, **When** the developer configures credentials, **Then** the README asks only for the public key and does not request the secret key.

---

### User Story 2 - Contributor adds a sample that matches the others (Priority: P1)

A contributor (human or coding agent) needs to add or edit a sample. They open the constitution, this spec, and the sample template, fill the required README sections, and produce a folder that runs the same way as every existing sample.

**Why this priority**: Inconsistent starters are the failure mode this repo is meant to prevent.

**Independent Test**: Create a new sample folder from the template and confirm it has the required README sections, a catalog row, and no unpublished package presented as official.

**Acceptance Scenarios**:

1. **Given** the sample template and constitution, **When** a contributor authors a new sample, **Then** the folder path is `<concept>/<stack>/`, `README.md` uses the required section order, and `.env.example` (when needed) contains placeholders only.
2. **Given** an existing sample, **When** a reviewer checks it against this spec, **Then** it covers exactly one concept, uses real API surface, and does not treat sign-in as a permission grant.
3. **Given** a stack with no official SDK, **When** the contributor writes the sample, **Then** the sample states that fact and documents the REST / redirect bridge instead of a fictional client.

---

### User Story 3 - Maintainer ships stacks in numbered waves (Priority: P1)

A maintainer plans work so the catalog is useful after every increment. They implement authentication samples for Wave 1 stacks first, then deepen those stacks or open the next wave. They do not start a later wave's authentication samples until the previous wave's authentication samples are present or the catalog records an explicit deferral.

**Why this priority**: The repository is empty; waves are how mainstream stacks arrive without a half-finished catalog.

**Independent Test**: The catalog lists every planned stack under exactly one wave. A reviewer can see which wave is in progress and which samples are planned versus present.

**Acceptance Scenarios**:

1. **Given** the catalog, **When** a reader scans Wave 1, **Then** they see the flagship published web and Node session stacks and their sample status.
2. **Given** Wave N authentication samples are still missing and not marked deferred, **When** a contributor proposes Wave N+1 authentication samples, **Then** the change is rejected until Wave N authentication is present or deferred in the catalog.
3. **Given** a stack that already has authentication, **When** a contributor adds authorization, observability, or Lidar, **Then** those concept folders appear only after authentication for that stack.

---

### User Story 4 - Developer progresses through Authdog concepts (Priority: P2)

A developer who finished authentication on a stack wants the next concept on the same stack. The catalog and the sample's "Next concept" section point them to authorization (when the stack can enforce on the server), then observability, then Lidar.

**Why this priority**: Concepts are the reason the repo exists; the path between them must be obvious once the first starter works.

**Independent Test**: From an authentication sample README, a reader can name the next concept for that stack and find its catalog row (present or planned).

**Acceptance Scenarios**:

1. **Given** an authentication sample, **When** the developer reads Next concept, **Then** they are sent to authorization if the stack can enforce on the server, otherwise to observability or a sibling server sample.
2. **Given** a UI-only or token-validation-only stack, **When** authorization is requested, **Then** the catalog does not invent a client-side permission check; it links to a server sample or states that authorization is out of scope on that stack.
3. **Given** a later concept that is not yet a canonical directory, **When** someone wants a sample for it, **Then** they must add the concept through Spec Kit before creating a folder.

---

### Edge Cases

- What happens when a host app needs two packages (presentational UI plus a session SDK)? The primary sample MUST link to the sibling sample rather than duplicating it.
- How does the system handle an unreleased or planned SDK? The sample MUST say it is unreleased and MUST NOT give a production install command for a registry package that does not exist.
- What happens when a stack cannot enforce authorization on the server? Skip `authz/<stack>` or provide a paired server sample; do not "authorize" in the client.
- How are renamed stacks handled? Directory name and catalog id MUST stay identical.
- What happens when a new concept (MCP, agentic identity, and similar) appears? Add it through Spec Kit, then open a wave or extend an existing wave; do not create an ad-hoc top-level folder.
- How is a wave deferred? The catalog row records `Deferred` plus a one-line reason. Deferral counts as satisfying the wave gate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST publish a root catalog that lists every sample with concept, stack, wave number, and status (`Present`, `Planned`, or `Deferred`).
- **FR-002**: Every sample MUST live at `<concept>/<stack>/` using the canonical concept names `authn`, `authz`, `observability`, and `lidar` until Spec Kit adds another concept.
- **FR-003**: Stack directory names MUST be lowercase kebab-case and MUST equal the catalog id.
- **FR-004**: Every sample directory MUST contain `README.md` with these sections, in this order: What this sample shows; What you need first; Run; What to try; Gotchas; Next concept.
- **FR-005**: A sample README MUST be understandable as a quickstart without opening any other file in the repository.
- **FR-006**: Samples MUST NOT present unpublished packages, invented methods, or unverified hosts as official facts.
- **FR-007**: Client samples MUST instruct the reader to collect the public key and MUST NOT instruct the reader to collect or embed the secret key.
- **FR-008**: Authentication samples MUST demonstrate identity only. Authorization samples MUST demonstrate a server-side allow/deny decision. Observability samples MUST demonstrate the identity event stream. Lidar samples MUST demonstrate identity SIEM behavior (monitors, Signals, and/or a SIEM channel).
- **FR-009**: Frameworks MUST be assigned to exactly one of five waves as defined in Key Entities. A later wave's authentication samples MUST NOT be added while the previous wave still has authentication rows that are `Planned` (not `Present` or `Deferred`).
- **FR-010**: Within a stack, `authz`, `observability`, and `lidar` samples MUST NOT be marked `Present` before that stack's `authn` sample is `Present`.
- **FR-011**: The sample template MUST exist so a contributor can copy it into a new `<concept>/<stack>/README.md`.
- **FR-012**: Spec Kit MUST remain the workflow for new concepts, new waves, or a new kind of sample.
- **FR-013**: This feature MUST deliver catalog scaffolding and wave definitions only. It MUST NOT add runnable application code for any stack.

### Key Entities

- **Concept**: An Authdog capability a starter demonstrates. Canonical values: `authn` (prove identity), `authz` (allow or deny after identity), `observability` (identity event stream), `lidar` (identity SIEM). Further values require a Spec Kit feature.
- **Stack**: A mainstream technology id (for example `nextjs` or `express`). One folder per concept/stack pair.
- **Sample**: The copyable folder at `<concept>/<stack>/` plus its catalog row.
- **Wave**: A numbered cohort of stacks that may receive authentication samples together.

**Wave membership (initial catalog)**:

| Wave | Intent | Stacks |
| --- | --- | --- |
| 1 | Flagship published web and Node session stacks | `nextjs`, `remix`, `express` |
| 2 | Remaining official web frameworks plus Node token validation | `sveltekit`, `vue`, `tanstack-start`, `angular`, `astro`, `fastify`, `node` |
| 3 | Official language backends, plus labeled Python source extras | `go`, `java`, `csharp`, `python` |
| 4 | Mobile and native clients | `expo`, `ios-swift`, `android-kotlin`, `flutter-dart` |
| 5 | Long-tail web, UI-only, and remaining source-only stacks | `gatsby`, `redwood`, `react`, `rust` |

Wave 1 is the first implementation feature after this catalog. Later waves each get their own Spec Kit feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A newcomer can pick a concept and a stack from the catalog in under two minutes and know whether a starter is present, planned, or deferred.
- **SC-002**: A contributor can add a new sample folder from the template and produce a catalog-complete starter (required README sections, correct path, no secret key) without asking for hidden conventions.
- **SC-003**: After this feature, the repository has a complete planned catalog for all five waves and zero runnable stack applications (those arrive in later features).
- **SC-004**: A reviewer can reject an out-of-order wave or an out-of-order concept using only the catalog and this spec.

## Assumptions

- Target readers already chose a stack and have an Authdog environment with a public key.
- Official Authdog documentation and published SDKs are the source of truth for API surface; agent-skills platform ids are the source of truth for stack names.
- Python is included in Wave 3 because it is a mainstream backend, even though extras are source-only today; samples MUST label that fact.
- `react` is UI-only and will not receive an `authz` sample; it links to a session stack.
- Native mobile stacks in Wave 4 may use a REST / redirect bridge until an official SDK ships.
- Lidar and observability samples may require console-side configuration (monitors, notification channels) in addition to application code; the README MUST say so.
- MCP, agentic identity, and similar capabilities are out of scope until a later Spec Kit feature adds them as concepts.
- Samples are copy-out starters, not a single deployable monorepo application.
- Spec Kit 1.0.6 with the Cursor agent integration is the workflow tool; this feature configures it and does not change the CLI.
