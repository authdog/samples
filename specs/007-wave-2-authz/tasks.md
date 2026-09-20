# Tasks: Wave 2 Authorization

**Input**: Design documents from `/specs/007-wave-2-authz/`

## Phase 1: Setup

- [x] T001 Create `specs/007-wave-2-authz/` and point `.specify/feature.json` at it

## Phase 2: Server-capable stacks (P1)

- [x] T002 [US1] Add `authz/sveltekit` permission gate on `/invoices`
- [x] T003 [P] [US2] Add `authz/astro` permission gate on `/invoices`
- [x] T004 [P] [US3] Add `authz/tanstack-start` permission gate in a loader
- [x] T005 [P] [US4] Add `authz/fastify` `requirePermission` preHandler
- [x] T006 [P] [US5] Add `authz/node` permission check CLI

## Phase 3: Browser-only stacks (P2)

- [x] T007 [P] [US6] Add `authz/vue` UI hint with `useAuthz`
- [x] T008 [P] [US7] Add `authz/angular` UI hint from claims

## Phase 4: Catalog

- [x] T009 Mark Wave 2 `authz` cells Present in `README.md`
- [x] T010 Update `specs/README.md` to list `007-wave-2-authz`

## Phase 5: Verify

- [x] T011 Install and build/type-check each Wave 2 authz sample
