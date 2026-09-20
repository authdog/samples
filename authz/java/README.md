# authdog authz on java

Smallest Java authorization check using `com.authdog:authdog-java-sdk`.
The artifact is **not on Maven Central**. It validates a bearer token,
then reads `user.permissions` for `invoices:read`. Fail-closed: a
missing claim is a deny.

The published `User` type does not model `permissions`. This sample
uses `getUserInfo` for identity and the official `request` helper on
`GET /v1/userinfo` so the envelope still has the claim.

## What this sample shows

Authorization (`authz`): the allow/deny decision that follows
authentication. The token proves identity; the `permissions` claim
makes the decision. Authentication is not authorization.

## What you need first

An **access token** to check. Never ask for or embed the secret key
(`sk_...`). Grant a test user a role with the `invoices:read`
permission.

Java **11+** and Maven are required.

## Run

```bash
git clone https://github.com/authdog/sdk.git /tmp/authdog-sdk
git -C /tmp/authdog-sdk checkout 9b9ad52f4b23e5e0bdcffa6dc591ecdb08c7e180
mvn -q -f /tmp/authdog-sdk/java/pom.xml install -DskipTests -Dcheckstyle.skip=true -Dspotbugs.skip=true -Dmaven.javadoc.skip=true

mvn -q package
java -jar target/authdog-authz-java-0.1.0.jar <access-token>
```

Do not add `com.authdog:authdog-java-sdk` from Maven Central — that
coordinate is not published.

## What to try

1. With a token whose user **has** `invoices:read` →
   `200 OK: ... may read invoices.`
2. With a token whose user **lacks** it →
   `403 Forbidden: missing invoices:read`.
3. With a bad token → `401 Unauthorized`.

## Gotchas

- **Not on Maven Central**: install the SDK from the pinned
  `authdog/sdk` checkout above.
- **Authentication is not authorization**: `getUserInfo` proves
  identity; the `permissions` check makes the decision.
- **Typed `User` omits permissions**: read the claim from the
  userinfo envelope via `request`. Do not invent a getter on `User`.
- **Fail-closed**: a missing `permissions` claim is a deny.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Observability for this stack is Planned: `observability/java`.
