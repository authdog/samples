# Tasks: Wave 3 Authentication

**Input**: Design documents from `/specs/010-wave-3-authn/`

## Phase 1: Setup

- [x] T001 Create `specs/010-wave-3-authn/` and point `.specify/feature.json` at it

## Phase 2: Session gates (P1)

- [x] T002 [US1] Add `authn/go` with `New` + `AttachSession` + `RequireAuth`
- [x] T003 [P] [US4] Add `authn/python` with FastAPI `session` + `require_auth` from a pinned source extra

## Phase 3: Token validators (P1)

- [x] T004 [P] [US2] Add `authn/java` CLI validator with `AuthdogClient.getUserInfo`
- [x] T005 [P] [US3] Add `authn/csharp` CLI validator with `AuthdogClient.GetUserInfoAsync`

## Phase 4: Catalog

- [x] T006 Add Wave 3 `authn` rows to `README.md`
- [x] T007 Update `specs/README.md` to list `010-wave-3-authn`

## Phase 5: Verify

- [x] T008 Install and compile/type-check each Wave 3 sample
