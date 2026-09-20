# Specs

Spec Kit artifacts for this samples catalog. The constitution is
[`.specify/memory/constitution.md`](../.specify/memory/constitution.md).
Cursor skills live in `.cursor/skills/speckit-*`.

## What is already specified

| Folder | Status | Purpose |
| --- | --- | --- |
| [001-sample-catalog](./001-sample-catalog/) | Implemented | Layout, concepts, five framework waves, catalog scaffolding |
| [002-wave-1-authn](./002-wave-1-authn/) | Implemented | Wave 1 authentication: nextjs, remix, express |
| [003-wave-1-authz](./003-wave-1-authz/) | Implemented | Wave 1 authorization: nextjs, remix, express |

Start here: [001-sample-catalog/spec.md](./001-sample-catalog/spec.md),
then the [sample template](../.specify/templates/sample-template.md).

## Next feature

Wave 1 observability (`observability/nextjs`, `observability/remix`,
`observability/express`) or Wave 2 authentication. In Cursor:
`/speckit-specify` the next cohort.

## How to improve something

In Cursor, from the repo root:

1. `/speckit-specify` — new wave, new concept, or new kind of sample
2. `/speckit-clarify` — if the spec still has open questions
3. `/speckit-plan` — file-level plan
4. `/speckit-tasks` — implementable task list
5. `/speckit-implement` — execute tasks
6. `/speckit-converge` — compare files to spec/plan/tasks

Do not add a stack out of wave order, invent SDK surface, or treat
sign-in as a permission grant without updating the spec in the same
change.

## CLI

```bash
uv tool install specify-cli
specify check
```
