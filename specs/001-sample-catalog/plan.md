# Implementation Plan: Sample Catalog

**Branch**: `001-sample-catalog` | **Date**: 2026-09-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-sample-catalog/spec.md`

## Summary

Adopt GitHub Spec Kit in this empty samples repo and publish a
catalog of Authdog concept starters (`authn`, `authz`, `observability`,
`lidar`) across mainstream stacks, gated by five implementation waves.
This feature delivers constitution, templates, root catalog, and Spec
Kit artifacts only — no runnable stack applications.

## Technical Context

**Language/Version**: Markdown / catalog tables

**Primary Dependencies**: GitHub Spec Kit 1.0.6 (`specify-cli`),
Cursor agent integration (`speckit-*` skills), official Authdog docs
and SDK surface (read-only)

**Storage**: Git files under `<concept>/<stack>/` (later features),
`specs/`, `.specify/`

**Testing**: Manual review against FR-004 section order, FR-001 catalog
completeness, and FR-009 wave membership

**Target Platform**: Developers and coding agents copying a single
starter folder

**Project Type**: Documentation / sample catalog

**Performance Goals**: A newcomer finds a concept/stack row in under
two minutes (SC-001)

**Constraints**: Real API surface only; public key only on the client;
no secrets; no runnable apps in this feature; wave gating

**Scale/Scope**: 4 concepts × 22 planned stacks, 5 waves; this feature
scaffolds the catalog, not the apps

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. One sample per concept per stack — PASS (layout is
  `<concept>/<stack>/`)
- II. Real API surface — PASS (no sample apps; catalog labels
  source-only / no-SDK stacks)
- III. Quickstart, not a product — PASS (template is a starter
  README, not a product spec)
- IV. Authentication is not authorization — PASS (concepts are
  separate directories)
- V. Security boundaries explicit — PASS (template forbids secret
  keys; root `.gitignore` excludes `.env`)
- VI. Wave-gated framework delivery — PASS (five waves in catalog)
- VII. Spec Kit governs catalog changes — PASS (this feature)

Re-check after design: still PASS. No sample application code is
created here, so principles II–V apply to the template and catalog
wording only.

## Project Structure

### Documentation (this feature)

```text
specs/001-sample-catalog/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
.specify/
  memory/constitution.md
  templates/sample-template.md
  feature.json
.cursor/skills/speckit-*/
README.md
.gitignore
specs/README.md
authn/          # reserved; no stack folders yet
authz/
observability/
lidar/
```

**Structure Decision**: Catalog at repo root. Concept directories exist
as reserved top-level names. Stack folders arrive in later wave
features. Spec Kit lives at `.specify/`, `specs/`, and
`.cursor/skills/`.

## Complexity Tracking

> No constitution violations.
