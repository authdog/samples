import {
  fetchUserData,
  isAuthenticatedUserInfo,
} from "@authdog/node-commons";
import { getServerSidePayloadPublicKey } from "@authdog/nextjs-app/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const REQUIRED_PERMISSION = "invoices:read";

type AuthdogUserClaims = {
  permissions?: string[];
  roles?: string[];
};

export async function GET() {
  const publicKey = process.env.PK_AUTHDOG;
  if (!publicKey) {
    return NextResponse.json(
      { error: "PK_AUTHDOG is not set" },
      { status: 500 },
    );
  }

  const { identityHost, environmentId } =
    getServerSidePayloadPublicKey(publicKey);
  const cookieStore = await cookies();
  const token = cookieStore.get(`user_session_hash_${environmentId}`)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await fetchUserData(identityHost, environmentId, token);
  if (!isAuthenticatedUserInfo(userData)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = userData.user as AuthdogUserClaims;
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];

  if (!permissions.includes(REQUIRED_PERMISSION)) {
    return NextResponse.json(
      { error: "Forbidden", missing: [REQUIRED_PERMISSION] },
      { status: 403 },
    );
  }

  return NextResponse.json({
    invoices: [
      { id: "inv_001", amount: 1200, status: "paid" },
      { id: "inv_002", amount: 340, status: "open" },
    ],
  });
}
