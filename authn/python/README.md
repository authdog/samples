# authdog authn on python

Smallest FastAPI starter for Authdog identity using the **source-only**
`authdog-fastapi` extra. It is **not on PyPI**. Install a pinned
checkout of [`authdog/web-sdk`](https://github.com/authdog/web-sdk)
`packages/python`. `session` records context. `require_auth` on
`GET /me` is the identity gate.

## What this sample shows

Authentication (`authn`): who the caller is after a validated session.
This is a backend gate. Hosted sign-in still happens in a browser
(Account portal or a frontend SDK). Authentication is not
authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and set `PK_AUTHDOG`. Export it in your
shell (`export PK_AUTHDOG=pk_...`) before you run the server.

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

1. `curl -i http://localhost:3000/me` with no session. You should get
   `401 {"detail":"Unauthorized"}` (FastAPI's `HTTPException` shape).
2. Complete hosted sign-in, then send the session:

```bash
curl -i http://localhost:3000/me \
  -H "Authorization: Bearer <token>"
```

A valid `authdog-session` cookie also works. `GET /logout` expires the
local cookie and redirects.

## Gotchas

- **Not on PyPI yet**: pin a source checkout with the `fastapi` extra.
  Do not write a production `pip install authdog-fastapi`.
- **`session` is informational; `require_auth` is the boundary**: the
  session helper never raises on bad tokens. Use `require_auth` to
  gate.
- **`fetch_user=False` makes `require_auth` reject everything**: this
  sample does not use that option.
- **Logout is local only**: it clears the cookie and redirects; it
  does not revoke a bearer token or end the upstream IdP session.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Planned: `authz/python`. Apply
[authorization](https://www.authdog.com/docs/concepts/authorization)
after `require_auth`. Do not treat `/me` as a permission check.
