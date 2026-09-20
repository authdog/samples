# Tasks: Wave 2 Authentication

**Input**: Design documents from `/specs/004-wave-2-authn/`

## Phase 1: Setup

- [x] T001 Create `specs/004-wave-2-authn/` and point `.specify/feature.json` at it

## Phase 2: Server-capable stacks (P1)

- [x] T002 [US1] Add `authn/sveltekit` with `createAuthdogHandle` + `getUser`
- [x] T003 [P] [US3] Add `authn/tanstack-start` with server `identityLoader`
- [x] T004 [P] [US5] Add `authn/astro` with `authdogMiddleware` + `getUser`
- [x] T005 [P] [US6] Add `authn/fastify` with `authdogPlugin` + `requireAuth`

## Phase 3: Browser-only stacks (P1)

- [x] T006 [P] [US2] Add `authn/vue` with `AuthdogProvider` + `useUser`
- [x] T007 [P] [US4] Add `authn/angular` with `provideAuthdog` + `AuthdogService`

## Phase 4: Node token validation (P1)

- [x] T008 [US7] Add `authn/node` CLI validator with `@authdog/node-sdk`

## Phase 5: Catalog

- [x] T009 Mark Wave 2 `authn` cells Present in `README.md`
- [x] T010 Update `specs/README.md` to list `004-wave-2-authn`

## Phase 6: Verify

- [x] T011 Install and build/type-check each Wave 2 sample
