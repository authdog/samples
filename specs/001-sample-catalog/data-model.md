# Data Model: Sample Catalog

**Feature**: `001-sample-catalog` | **Date**: 2026-09-20

## Sample

A copyable starter plus its catalog row.

| Field | Rules |
| --- | --- |
| concept | One of `authn`, `authz`, `observability`, `lidar` until Spec Kit adds another |
| stack | Lowercase kebab-case; equals directory name and catalog id |
| path | `<concept>/<stack>/` |
| wave | Integer 1–5; inherited from the stack's wave membership |
| status | `Present`, `Planned`, or `Deferred` |
| readme | Required; sections in constitution order |
| env_example | Required when the sample needs configuration; placeholders only |

**Validation**: Unique `(concept, stack)`. `authz` / `observability` /
`lidar` cannot be `Present` before that stack's `authn` is `Present`.

## Stack

A mainstream technology that may receive samples.

| Field | Rules |
| --- | --- |
| id | Catalog id and directory name |
| wave | Exactly one wave (1–5) |
| sdk_posture | `official`, `source-only`, `rest-bridge`, or `ui-only` |
| authz_capable | Whether a server-side `authz/<stack>` sample is allowed |

## Wave

A cohort of stacks that may open authentication samples together.

| Field | Rules |
| --- | --- |
| number | 1–5 |
| intent | One-line purpose |
| stacks | The ids assigned to this wave |
| gate | Wave N+1 `authn` cannot become `Present` while Wave N still has `Planned` `authn` rows |

## Concept

An Authdog capability.

| id | Meaning | Typical next concept |
| --- | --- | --- |
| authn | Prove identity (session, cookie, or bearer) | authz if server-capable, else observability |
| authz | Server-side allow/deny | observability |
| observability | Identity event stream (Events API and/or webhooks) | lidar |
| lidar | Identity SIEM (monitors, Signals, and/or SIEM channel) | none (or a later Spec Kit concept) |

## Relationships

```text
Wave 1──n Stack 1──n Sample
Concept 1──n Sample
Sample.concept + Sample.stack = unique path
```
