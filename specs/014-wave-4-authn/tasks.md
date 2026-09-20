# Tasks: Wave 4 Authentication

**Input**: Design documents from `/specs/014-wave-4-authn/`

## Phase 1: Setup

- [x] T001 Create `specs/014-wave-4-authn/` and point `.specify/feature.json` at it

## Phase 2: Expo (P1)

- [x] T002 [US1] Add `authn/expo` with the official RN provider and hooks

## Phase 3: Native bridges (P1)

- [x] T003 [P] [US2] Add `authn/ios-swift` authorize + userinfo CLI
- [x] T004 [P] [US3] Add `authn/android-kotlin` authorize + userinfo CLI
- [x] T005 [P] [US4] Add `authn/flutter-dart` authorize + userinfo CLI

## Phase 4: Catalog

- [x] T006 Add Wave 4 `authn` rows to `README.md`
- [x] T007 Update `specs/README.md` and follow-ups

## Phase 5: Verify

- [x] T008 Install/typecheck Expo; compile Kotlin; generate authorize URL from a trusted test key
