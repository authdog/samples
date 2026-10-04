# Clinic portal (Django)

Docs Application starter. Source-only `authdog-fastapi` extra
(`django`). It is **not on PyPI**. Pin a checkout of
[authdog/web-sdk](https://github.com/authdog/web-sdk) `packages/python`.
`require_auth` is the identity gate.

## What this sample shows

Authentication (`authn`): who the caller is after a validated session.
Hosted sign-in still happens in a browser. Authentication is not
authorization.

## What you need first

Your authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`).

Copy `.env.example` to `.env` and export `PK_AUTHDOG` before you run.

Python **3.10+** is required.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export PK_AUTHDOG=pk_...
python manage.py runserver 3000
```

## What to try

1. Call the gated route with no session. You should get 401.

```bash
curl -i http://localhost:3000/me
```

2. Complete hosted sign-in, then send the session:

```bash
curl -i http://localhost:3000/me \
  -H "Authorization: Bearer <token>"
```

A valid `authdog-session` cookie also works.

## Gotchas

- **Not on PyPI**: do not `pip install authdog-fastapi`. `pip install
  authdog` is the management client and does not include this extra.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

This stack can enforce on the server. There is no `authz/django`
sample yet. Do not treat a successful sign-in as a permission grant.
