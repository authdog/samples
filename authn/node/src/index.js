import {
  fetchUserData,
  getPublicKeyPayload,
  isAuthenticatedUserInfo,
} from "@authdog/node-commons";

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

try {
  const info = await fetchUserData(identityHost, environmentId, token);
  if (!isAuthenticatedUserInfo(info)) {
    console.error("401 Unauthorized: token did not resolve to a user.");
    process.exit(1);
  }
  console.log("Authenticated:");
  console.log(`  id:    ${info.user.id}`);
  console.log(`  name:  ${info.user.displayName}`);
  console.log(`  email: ${info.user.emails?.[0]?.value}`);
} catch (error) {
  console.error("401 Unauthorized:", error.message);
  process.exit(1);
}
