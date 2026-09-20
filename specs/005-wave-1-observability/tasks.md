# Tasks: Wave 1 Observability

**Input**: Design documents from `/specs/005-wave-1-observability/`

## Phase 1: Setup

- [x] T001 Create `specs/005-wave-1-observability/` and point `.specify/feature.json` at it

## Phase 2: Webhook receivers (P1)

- [x] T002 [US1] Add `observability/express` webhook receiver with raw-body HMAC verify
- [x] T003 [P] [US3] Add `observability/nextjs` webhook route handler
- [x] T004 [P] [US4] Add `observability/remix` webhook action

## Phase 3: Events API read path (P1)

- [x] T005 [US2] Add Events API list + cursor to `observability/express`
- [x] T006 [P] Add Events API list + cursor to `observability/nextjs`
- [x] T007 [P] Add Events API list + cursor to `observability/remix`

## Phase 4: Catalog

- [x] T008 Mark Wave 1 `observability` cells Present in `README.md`
- [x] T009 Update `specs/README.md` to list `005-wave-1-observability`

## Phase 5: Verify

- [x] T010 Install and build/type-check each observability sample
