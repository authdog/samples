# Tasks: Sample Catalog

**Input**: Design documents from `/specs/001-sample-catalog/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested. Validation is the catalog/README review in
quickstart.md.

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3, US4)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Spec Kit is already initialized; persist feature pointer
and ignore sample secrets.

- [x] T001 Initialize Spec Kit (`specify init --here --integration cursor-agent --script sh --force --non-interactive`)
- [x] T002 Replace `.specify/memory/constitution.md` with samples principles
- [x] T003 Persist `.specify/feature.json` → `specs/001-sample-catalog`
- [x] T004 [P] Add root `.gitignore` for sample secrets and language artifacts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Template and reserved concept directories every story uses

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Add `.specify/templates/sample-template.md` matching FR-004
- [x] T006 [P] Reserve concept directories `authn/`, `authz/`, `observability/`, `lidar/` with `.gitkeep`

**Checkpoint**: Template and concept roots exist

---

## Phase 3: User Story 1 - Developer finds a starter (Priority: P1) 🎯 MVP

**Goal**: Root catalog lists every concept/stack with wave and status

**Independent Test**: Open README.md, pick a concept and stack, see one row

- [x] T007 [US1] Write root `README.md` with purpose, layout, Spec Kit pointer, and concept tables for all five waves (all rows `Planned`)
- [x] T008 [US1] Write `specs/README.md` describing this feature and how to start Wave 1

**Checkpoint**: A newcomer can find any planned sample in under two minutes

---

## Phase 4: User Story 2 - Contributor adds a matching sample (Priority: P1)

**Goal**: Template and README tell a contributor how to add a folder

**Independent Test**: Copy the template path from README and confirm required headings

- [x] T009 [US2] Document "Adding a sample" in `README.md` using the template and constitution rules
- [x] T010 [US2] Confirm sample template sections match FR-004 order and forbid secret keys

**Checkpoint**: A contributor can produce a catalog-complete folder without hidden conventions

---

## Phase 5: User Story 3 - Maintainer ships stacks in waves (Priority: P1)

**Goal**: Wave membership and gates are visible in the catalog

**Independent Test**: README wave table matches spec Key Entities; gate text is in the constitution and README

- [x] T011 [US3] Publish the five-wave table (intent + stacks) in `README.md`
- [x] T012 [US3] State the wave gate and in-stack concept order in `README.md`

**Checkpoint**: A reviewer can reject an out-of-order wave using only the catalog

---

## Phase 6: User Story 4 - Developer progresses through concepts (Priority: P2)

**Goal**: Each concept table points to the next concept

**Independent Test**: From the `authn` section, a reader can name the next concept per stack posture

- [x] T013 [US4] Add a "Concept path" section to `README.md` (`authn` → `authz` / observability → `lidar`)
- [x] T014 [US4] Note UI-only and rest-bridge exceptions in the catalog (`react`, native stacks)

**Checkpoint**: Concept progression is obvious before any app exists

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T015 [P] Verify catalog row count: 4 concepts × listed stacks, with `authz` omitted in the table notes for non-capable stacks rather than fake rows
- [x] T016 Run [quickstart.md](./quickstart.md) validation (find a starter, add-a-sample instructions, Spec Kit iterate)
- [x] T017 Mark this spec Implemented when scaffolding matches FR-001–FR-013

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Spec Kit init already done; T004 remaining
- **Foundational (Phase 2)**: Depends on Setup
- **User Stories (Phase 3–6)**: Depend on Foundational; US1–US3 can share `README.md` sequentially
- **Polish (Phase 7)**: Depends on US1–US4

### User Story Dependencies

- **US1**: After Foundational — creates the catalog
- **US2**: After US1 — extends README with contributor steps
- **US3**: After US1 — wave tables may be written with US1
- **US4**: After US1 — concept path section

### Parallel Opportunities

- T004 and T006 can run in parallel with T005
- T008 can run in parallel with T007
- Do not edit `README.md` in parallel across US1–US4

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Finish Setup + Foundational
2. Publish the root catalog (US1)
3. Stop and confirm every wave row is visible

### Incremental Delivery

1. Catalog (US1) → contributor docs (US2) → wave gates (US3) → concept path (US4)
2. Do not start Wave 1 apps in this feature (FR-013)
