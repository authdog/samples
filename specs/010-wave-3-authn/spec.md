# Feature Specification: Wave 3 Authentication

**Feature Branch**: `010-wave-3-authn`

**Created**: 2026-09-20

**Status**: Implemented

**Input**: User description: "Continue with next wave — Wave 3 authentication for go, java, csharp, and python."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Go identity gate (Priority: P1)

A developer copies `authn/go`, sets the public key, runs the Gin server, and confirms `GET /me` is 401 without a session and the user JSON with a valid cookie or bearer token. `AttachSession` is labeled informational. The sample does not decide what the user is allowed to do.

**Why this priority**: Go is the first Wave 3 language backend and the only stack in this wave with a ready session adapter (Gin).

**Independent Test**: Follow `authn/go/README.md` only. `GET /me` without a session is 401; with a valid session it returns the user.

**Acceptance Scenarios**:

1. **Given** `PK_AUTHDOG` is set, **When** `GET /me` has no cookie or bearer token, **Then** the response is `401 {"error":"Unauthorized"}`.
2. **Given** a valid session from hosted sign-in, **When** `GET /me` sends `authdog-session` or `Authorization: Bearer`, **Then** the body is the userinfo user.
3. **Given** `GET /logout`, **When** a cookie session exists, **Then** the cookie is expired and the client is redirected.

---

### User Story 2 - Java token validation (Priority: P1)

A developer copies `authn/java`, passes a bearer token, and gets the userinfo user or an authentication error. The sample does not host sign-in. The public key is not collected because this SDK does not use it.

**Why this priority**: Java is an official language SDK in Wave 3 and is token-validation only.

**Independent Test**: Follow `authn/java/README.md` only. The documented command prints the user or an authentication error.

**Acceptance Scenarios**:

1. **Given** a valid access token, **When** the developer runs the documented command, **Then** the output includes an id from userinfo.
2. **Given** a bad or expired token, **When** they run the same command, **Then** the process reports authentication failure and exits non-zero.
3. **Given** the README, **When** a reader looks for credentials, **Then** they are asked for an access token and are not asked for a secret key or a public key.

---

### User Story 3 - C# token validation (Priority: P1)

A developer copies `authn/csharp`, passes a bearer token, and gets the userinfo user or an authentication error. The sample does not host sign-in. The public key is not collected because this SDK does not use it.

**Why this priority**: C# is the other official Wave 3 token-validation SDK and must match Java's contract.

**Independent Test**: Follow `authn/csharp/README.md` only. The documented command prints the user or an authentication error.

**Acceptance Scenarios**:

1. **Given** a valid access token, **When** the developer runs the documented command, **Then** the output includes an id from userinfo.
2. **Given** a bad or expired token, **When** they run the same command, **Then** the process reports authentication failure and exits non-zero.
3. **Given** the README, **When** a reader looks for credentials, **Then** they are asked for an access token and are not asked for a secret key or a public key.

---

### User Story 4 - Python identity gate (Priority: P1)

A developer copies `authn/python`, installs the source-only FastAPI extra from a pinned checkout (not a PyPI name that does not exist), sets the public key, and confirms `GET /me` is 401 without a session and the user object with one. `session` is labeled informational. The README states the extra is unreleased.

**Why this priority**: Python is the remaining Wave 3 backend and the constitution requires a source-only label.

**Independent Test**: Follow `authn/python/README.md` only. `GET /me` without a session is 401; with a valid session it returns the user.

**Acceptance Scenarios**:

1. **Given** `PK_AUTHDOG` is set and the pinned source extra is installed, **When** `GET /me` has no cookie or bearer token, **Then** the response is 401 Unauthorized.
2. **Given** a valid session, **When** `GET /me` sends `authdog-session` or `Authorization: Bearer`, **Then** the body is the userinfo user.
3. **Given** the README, **When** a reader looks at install steps, **Then** they see a pinned source checkout and do not see `pip install authdog-fastapi` as a registry install.

---

### Edge Cases

- Missing or malformed `pk_...` on Go and Python fails fast with a readable message.
- Java and C# fail fast when the access token argument is missing.
- Secret key is never requested or committed.
- Python MUST NOT present a PyPI install that does not exist.
- Go MUST pin a commit; the module has no tagged versions.
- Authorization, observability, and Lidar are out of scope.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `authn/go`, `authn/java`, `authn/csharp`, and `authn/python` MUST exist.
- **FR-002**: `authn/go` MUST use the official Go module `github.com/authdog/web-sdk/packages/go` (Gin adapter) and MUST pin a commit.
- **FR-003**: The Go sample MUST call `authdog.New`, mount `AttachSession`, protect `GET /me` with `RequireAuth`, and expose `Logout`.
- **FR-004**: `authn/java` MUST use `com.authdog:authdog-java-sdk` and `AuthdogClient.getUserInfo`. The README MUST state the artifact is not on Maven Central and MUST install it from a pinned `authdog/sdk` checkout.
- **FR-005**: `authn/csharp` MUST use `Authdog.Sdk` and `AuthdogClient.GetUserInfoAsync`. The README MUST state the package is not on NuGet and MUST reference a pinned `authdog/sdk` checkout.
- **FR-006**: Java and C# samples MUST validate a bearer token they already have. They MUST NOT host sign-in and MUST NOT collect a public key this SDK does not use.
- **FR-007**: `authn/python` MUST use the FastAPI binding (`authdog.fastapi.Authdog`) from a pinned `web-sdk` checkout with the `fastapi` extra. It MUST state the extra is source-only and MUST NOT use an unpinned PyPI install.
- **FR-008**: The Python sample MUST construct `Authdog(public_key=...)`, expose informational `session` on a public route, protect `GET /me` with `require_auth`, and expose `logout`.
- **FR-009**: Each sample MUST include `README.md` with the constitution section order. `.env.example` is required when the sample needs env vars, with placeholders only.
- **FR-010**: Samples MUST NOT request, embed, or document the secret key as required for this concept.
- **FR-011**: Samples MUST NOT implement authorization checks, event streaming, or Lidar.
- **FR-012**: The root listing MUST add the four Wave 3 authentication samples as present and leave Wave 3 authorization, observability, and Lidar planned.

### Key Entities

- **Wave 3 authn sample**: A copyable folder at `authn/go`, `authn/java`, `authn/csharp`, or `authn/python`.
- **Public key**: `pk_...` collected only by Go and Python, which parse it to reach a trusted identity host.
- **Access token**: The bearer credential Java and C# present to `GET /v1/userinfo`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can go from clone to a running Wave 3 authn sample in under ten minutes once they have the credential that sample documents (public key or access token).
- **SC-002**: Each of the four READMEs is usable without opening any other repo file.
- **SC-003**: An unsigned-in visitor never sees a fabricated identity, and a protected Go or Python route never returns success without a validated session.
- **SC-004**: The root listing shows Wave 3 authentication as present and does not mark Wave 3 authorization, observability, or Lidar as present.

## Assumptions

- Official agent-skills and SDK READMEs are the API source of truth.
- Wave 1 and Wave 2 authentication samples are already present, so Wave 3 may start.
- Hosted Account portal is still how a browser obtains a session; Go and Python gate that session, they do not embed a credentials UI.
- Java and C# language SDKs talk to `https://api.authdog.com` and do not parse `pk_...`.
- Python extras remain unreleased on PyPI; the sample pins a public checkout.
- Go module versions are untagged; the sample pins a commit and requires Go 1.25 as declared by the module.
- A real public key or access token is required to complete the success path; CI can still install and compile.
