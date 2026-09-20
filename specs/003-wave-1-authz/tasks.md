# Tasks: Wave 1 Authorization

**Input**: Design documents from `/specs/003-wave-1-authz/`

## Phase 1: Setup

- [x] T001 Create `specs/003-wave-1-authz/` and point `.specify/feature.json` at it

## Phase 2: User Story 1 - Next.js (P1)

- [x] T002 [US1] Add `authz/nextjs` with a session-validated `/api/invoices` gate
- [x] T003 [US1] Add `authz/nextjs/README.md` and `.env.example`

## Phase 3: User Story 2 - Remix (P1)

- [x] T004 [P] [US2] Add `authz/remix` with an `/invoices` loader gate
- [x] T005 [US2] Add `authz/remix/README.md` and `.env.example`

## Phase 4: User Story 3 - Express (P1)

- [x] T006 [P] [US3] Add `authz/express` with `requireAuth` + `requirePermission`
- [x] T007 [US3] Add `authz/express/README.md` and `.env.example`

## Phase 5: Catalog

- [x] T008 Mark Wave 1 `authz` cells Present in `README.md`
- [x] T009 Update `specs/README.md` to list `003-wave-1-authz`

## Phase 6: Verify

- [x] T010 Install and build `authz/nextjs`
- [x] T011 Install and type-check/build `authz/remix`
- [x] T012 Install and type-check `authz/express`
