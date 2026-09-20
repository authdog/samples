# authdog authn on java

Smallest Java token validator using `com.authdog:authdog-java-sdk`.
The artifact is **not on Maven Central**. Install a pinned checkout of
[`authdog/sdk`](https://github.com/authdog/sdk) first. It takes a
bearer token you already have and resolves it against
`GET /v1/userinfo`. This SDK does not use a public key.

## What this sample shows

Authentication (`authn`): who the caller is, proven by validating an
access token. Authentication is not authorization. This sample does
not host sign-in; pair it with a framework SDK or your own callback
that obtains the token.

## What you need first

An **access token** to validate. Never ask for or embed the secret
key (`sk_...`). This core SDK is constructed with
`https://api.authdog.com` and does not take a `pk_...` public key.

Java **11+** and Maven are required.

## Run

```bash
git clone https://github.com/authdog/sdk.git /tmp/authdog-sdk
git -C /tmp/authdog-sdk checkout 9b9ad52f4b23e5e0bdcffa6dc591ecdb08c7e180
mvn -q -f /tmp/authdog-sdk/java/pom.xml install -DskipTests -Dcheckstyle.skip=true -Dspotbugs.skip=true -Dmaven.javadoc.skip=true

mvn -q package
java -jar target/authdog-authn-java-0.1.0.jar <access-token>
```

Do not add `com.authdog:authdog-java-sdk` from Maven Central — that
coordinate is not published.

## What to try

1. `java -jar target/authdog-authn-java-0.1.0.jar <valid-token>` →
   prints the userinfo user.
2. `java -jar target/authdog-authn-java-0.1.0.jar <bad-token>` →
   prints `401 Unauthorized` and exits non-zero.

## Gotchas

- **Not on Maven Central**: install the SDK from the pinned
  `authdog/sdk` checkout above. Do not write a production
  `com.authdog:authdog-java-sdk` Central coordinate.
- **This validates tokens, it doesn't issue them**: obtain the token
  from a framework SDK's callback or your own redirect handler before
  calling `getUserInfo`.
- **`AuthdogClient` is `AutoCloseable`**: this sample uses
  try-with-resources so OkHttp is released.
- **`AuthenticationException` is the 401 path**: a bad, expired, or
  revoked token is not a fabricated user.
- Do not log access tokens.
- Bearer tokens go only to a trusted HTTPS identity host.

## Next concept

Authorization for this stack is Present: [`authz/java`](../../authz/java/).
Apply
[authorization](https://www.authdog.com/docs/concepts/authorization)
after `getUserInfo`. Do not treat a successful userinfo call as a
permission grant.
