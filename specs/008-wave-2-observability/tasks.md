# Tasks: Wave 2 Observability

**Input**: Design documents from `/specs/008-wave-2-observability/`

## Phase 1: Setup

- [x] T001 Create `specs/008-wave-2-observability/` and point `.specify/feature.json` at it

## Phase 2: Server-capable stacks (P1)

- [x] T002 [US1] Add `observability/sveltekit` receiver + events
- [x] T003 [P] [US2] Add `observability/astro` receiver + events
- [x] T004 [P] [US3] Add `observability/tanstack-start` receiver + events
- [x] T005 [P] [US4] Add `observability/fastify` receiver + events
- [x] T006 [P] [US5] Add `observability/node` receiver + poller

## Phase 3: Browser-only companions (P2)

- [x] T007 [P] [US6] Add `observability/vue` companion receiver
- [x] T008 [P] [US7] Add `observability/angular` companion receiver

## Phase 4: Catalog

- [x] T009 Mark Wave 2 `observability` cells Present in `README.md`
- [x] T010 Update `specs/README.md` to list `008-wave-2-observability`

## Phase 5: Verify

- [x] T011 Install and build/type-check each Wave 2 observability sample
