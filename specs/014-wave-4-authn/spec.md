# Feature Specification: Wave 4 Authentication

**Feature Branch**: `014-wave-4-authn`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Do it — Wave 4 authentication for expo, ios-swift, android-kotlin, and flutter-dart."

## Context

Wave 4 is mobile and native clients. Expo uses the published
`@authdog/react-native` SDK. Native Swift, Kotlin, and Dart have no
official SDK yet (planned in `authdog/sdk`). Those samples use the
documented REST / redirect bridge: hosted authorize URL, `?token=` on
the deep-link return, userinfo with a bearer. No `authz/<stack>`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Expo hosted sign-in (Priority: P1)

A developer copies `authn/expo`, sets the public key, starts Expo,
signs in through the hosted flow via a deep link, and sees the
userinfo user. `useAuthz` is not used.

**Independent Test**: Follow `authn/expo/README.md` only.

### User Story 2 - iOS redirect bridge (Priority: P1)

A developer copies `authn/ios-swift`. With a public key they can
print the hosted authorize URL. With a token they get the userinfo
user or an authentication error. The README states there is no
official Swift SDK and shows how to open the URL with
`ASWebAuthenticationSession`.

**Independent Test**: Follow `authn/ios-swift/README.md` only.

### User Story 3 - Android redirect bridge (Priority: P1)

Same contract for `authn/android-kotlin` (Custom Tabs in the README).

**Independent Test**: Follow `authn/android-kotlin/README.md` only.

### User Story 4 - Flutter redirect bridge (Priority: P1)

Same contract for `authn/flutter-dart` (`url_launcher` in the README).

**Independent Test**: Follow `authn/flutter-dart/README.md` only.

---

### Edge Cases

- Client samples collect only `pk_...`.
- Identity host from the public key MUST be https and on the
  documented trusted-host allowlist before a token is sent.
- JWT shape checks are not authentication.
- No unpublished mobile SDK install commands.
- Authorization samples are out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authn/{expo,ios-swift,android-kotlin,flutter-dart}` MUST exist.
- **FR-002**: `authn/expo` MUST use `@authdog/react-native` as documented
  in the Expo framework guide (`AuthdogProvider`, `useSignIn`,
  `useRedirectHandler`, `useUser`, `useSignOut`, SecureStore adapter).
- **FR-003**: Native samples MUST say there is no official SDK and MUST
  implement the documented bridge: parse `pk_...`, print
  `{identityHost}/oidc/{environmentId}/authorize`, fetch
  `{identityHost}/oidc/{environmentId}/userinfo` with Bearer.
- **FR-004**: Native samples MUST reject untrusted identity hosts
  before sending a bearer token (same allowlist as node-commons:
  `authdog.com`, `authdog.xyz`).
- **FR-005**: Each sample MUST include `README.md` with the
  constitution section order. `.env.example` when env vars are needed.
- **FR-006**: Samples MUST NOT implement authorization, observability,
  or Lidar. READMEs MUST NOT add `authz/<stack>`.
- **FR-007**: The root catalog MUST mark Wave 4 authentication Present
  and leave Wave 4 observability and Lidar planned.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from clone to a Wave 4 authn starter
  in under ten minutes once they have a public key (and, for native
  CLIs, a token).
- **SC-002**: Each README is usable without opening any other repo file.
- **SC-003**: An unsigned-in visitor never sees a fabricated identity.
- **SC-004**: The listing shows Wave 4 authentication as present and
  does not mark Wave 4 observability or Lidar present.

## Assumptions

- Wave 3 authentication is Present, so Wave 4 may start.
- Official Expo guide and `@authdog/react-native` are the Expo source
  of truth.
- Swift, Kotlin, and Dart SDKs remain planned; the RN authorize and
  userinfo URLs are the documented mobile bridge.
- Hosted Account portal / OIDC authorize still issues `?token=` on
  the registered deep link.
