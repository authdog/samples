# Tasks: Wave 3 Authorization

**Input**: Design documents from `/specs/011-wave-3-authz/`

## Phase 1: Setup

- [x] T001 Create `specs/011-wave-3-authz/` and point `.specify/feature.json` at it

## Phase 2: Session gates (P1)

- [x] T002 [US1] Add `authz/go` with `RequireAuth` then local `invoices:read` gate
- [x] T003 [P] [US4] Add `authz/python` with `require_auth` then local permission dependency

## Phase 3: Token CLIs (P1)

- [x] T004 [P] [US2] Add `authz/java` CLI: userinfo identity, then `permissions` allow/deny
- [x] T005 [P] [US3] Add `authz/csharp` CLI: userinfo identity, then `permissions` allow/deny

## Phase 4: Catalog

- [x] T006 Add Wave 3 `authz` rows to `README.md`
- [x] T007 Update `specs/README.md` and follow-ups to list `011-wave-3-authz`

## Phase 5: Verify

- [x] T008 Compile/type-check each Wave 3 authz sample
