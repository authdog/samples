# Quickstart: Sample Catalog

**Feature**: `001-sample-catalog` | **Date**: 2026-09-20

This feature does not produce a running app. Validate the catalog.

## Find a starter

1. Open [README.md](../../README.md).
2. Pick a concept table (`authn`, `authz`, `observability`, `lidar`).
3. Find your stack and note Wave and Status.
4. If Status is `Present`, open `<concept>/<stack>/README.md` and
   follow it. After this feature, every row is `Planned`.

**Pass**: A concept/stack pair maps to one row. No duplicate ids.

## Add a sample (later wave features)

1. Confirm the stack's wave is allowed to start (constitution VI).
2. Confirm `authn/<stack>` is `Present` before adding other concepts.
3. Copy [sample-template.md](../../.specify/templates/sample-template.md)
   to `<concept>/<stack>/README.md`.
4. Fill every required section. Use only real API surface.
5. Add `.env.example` with placeholders if the sample needs env vars.
6. Add or update the catalog row. Set Status to `Present`.

**Pass**: Path, README sections, and catalog row agree.

## Iterate with Spec Kit

From the repo root in Cursor:

1. `/speckit-specify` — new wave, new concept, or new kind of sample
2. `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`
3. `/speckit-converge`

**Pass**: Wave 1 authentication is a new feature, not a drive-by
commit on this catalog.
