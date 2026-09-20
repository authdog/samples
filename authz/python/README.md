# authdog authz on python

Smallest FastAPI starter for an Authdog server-side permission
decision using the **source-only** `authdog-fastapi` extra. It is
**not on PyPI**. `require_auth` proves identity. A local dependency
then allows only users with `invoices:read`.

## What this sample shows

Authorization (`authz`): a server-side allow/deny decision after
identity. Authentication is not authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`. Export it
(`export PK_AUTHDOG=pk_...`) before you run the server.

In the console, create the `invoices:read` permission and grant it to
a role, then to a user.

Python **3.10+** is required.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export PK_AUTHDOG=pk_...
uvicorn main:app --reload --port 3000
```

`requirements.txt` installs the FastAPI extra from commit
`06bb9cec0eaead7a4ce0a2228473e1ecdf79d0c5`. Do not run
`pip install authdog-fastapi` from PyPI — that package is not
published.

Open http://localhost:3000

## What to try

1. `curl -i http://localhost:3000/invoices` with no session. You
   should get `401 {"detail":"Unauthorized"}`.
2. Complete hosted sign-in, then send the session:

```bash
curl -i http://localhost:3000/invoices \
  -H "Authorization: Bearer <token>"
```

With a session that lacks `invoices:read` you get 403. With the
permission you get 200 and sample data.

## Gotchas

- **Not on PyPI yet**: pin a source checkout with the `fastapi` extra.
- **Claim names vary by environment**: this sample reads
  `user["permissions"]` on the userinfo dict. Adjust the accessor in
  `main.py` to match your token's shape.
- **Missing permissions deny**: an absent or non-list `permissions`
  claim is treated as no permissions (403), not allow.
- **`require_auth` is identity; the local dependency is the decision**:
  keep 401 (no session) distinct from 403 (no permission).
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/python`.
