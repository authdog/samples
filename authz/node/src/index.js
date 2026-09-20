import {
  fetchUserData,
  getPublicKeyPayload,
  isAuthenticatedUserInfo,
} from "@authdog/node-commons";

const REQUIRED_PERMISSION = "invoices:read";

const publicKey = process.env.PK_AUTHDOG;
const token = process.argv[2];

if (!publicKey) {
  console.error("Set PK_AUTHDOG to a pk_... public key.");
  process.exit(1);
}
if (!token) {
  console.error("Usage: PK_AUTHDOG=pk_... node src/index.js <access-token>");
  process.exit(1);
}

const { identityHost, environmentId } = getPublicKeyPayload(publicKey);

let info;
try {
  info = await fetchUserData(identityHost, environmentId, token);
} catch (error) {
  console.error("401 Unauthorized:", error.message);
  process.exit(1);
}

if (!isAuthenticatedUserInfo(info)) {
  console.error("401 Unauthorized: token did not resolve to a user.");
  process.exit(1);
}

// Identity is proven. Now the authorization decision: fail-closed.
const permissions = Array.isArray(info.user?.permissions)
  ? info.user.permissions
  : [];

if (!permissions.includes(REQUIRED_PERMISSION)) {
  console.log(`403 Forbidden: missing ${REQUIRED_PERMISSION}`);
  process.exit(0);
}

console.log(`200 OK: ${info.user.displayName} may read invoices.`);
