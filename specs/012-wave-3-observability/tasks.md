# Tasks: Wave 3 Observability

**Input**: Design documents from `/specs/012-wave-3-observability/`

## Phase 1: Setup

- [x] T001 Create `specs/012-wave-3-observability/` and point `.specify/feature.json` at it

## Phase 2: In-app receivers (P1)

- [x] T002 [US1] Add `observability/go` with Gin webhook + Events API
- [x] T003 [P] [US2] Add `observability/python` with FastAPI webhook + Events API

## Phase 3: Standalone receivers (P1)

- [x] T004 [P] [US3] Add `observability/java` JDK HTTP receiver
- [x] T005 [P] [US4] Add `observability/csharp` HttpListener receiver

## Phase 4: Catalog

- [x] T006 Add Wave 3 `observability` rows to `README.md`
- [x] T007 Update `specs/README.md` and follow-ups to list `012`

## Phase 5: Verify

- [x] T008 Compile each sample and prove 401 on a bad signature
