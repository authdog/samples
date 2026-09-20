# authdog <concept> on <stack>

<One or two sentences: what this starter proves, which official
package it uses, or a "no official SDK yet" / "source-only" banner
plus the REST/redirect bridge.>

## What this sample shows

<One short paragraph. Name the concept (`authn`, `authz`,
`observability`, or `lidar`) and nothing else. Authentication is not
authorization.>

## What you need first

Their authdog **public key** (`pk_...`), from the
[authdog console](https://console.authdog.com/) → Project settings.
Never ask for or embed the secret key (`sk_...`) in client code.

<Add only the other values this concept needs — for example an
environment id, a webhook URL, or a Lidar monitor name. Label any
illustrative host as illustrative.>

Copy `.env.example` to `.env` and fill placeholders. Do not commit
`.env`.

## Run

```bash
# install and start — only real package names
# source-only extras: pin a checkout, do not invent a registry install
```

## What to try

1. <The one action that proves the concept.>
2. <The failure or deny path, if the concept has one.>

## Gotchas

- **Name the failure mode**: one sentence on what goes wrong and what
  to do instead.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

- If this is `authn` and the stack can enforce on the server: open
  `authz/<stack>` (or say it is Planned).
- If the stack is UI-only or client-only: link the sibling server
  sample. Do not check permissions in the client.
- After `authz`: `observability/<stack>`.
- After `observability`: `lidar/<stack>`.
