import {
  fetchUserData,
  isAuthenticatedUserInfo,
  sanitizeRedirectPath,
} from "@authdog/node-commons";
import { getServerSidePayloadPublicKey } from "@authdog/nextjs-app/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const nextPath = sanitizeRedirectPath(
    request.nextUrl.searchParams.get("next"),
    "/dashboard",
  );
  const dest = new URL(nextPath, request.url);
  if (token) dest.searchParams.set("token", token);

  const publicKey = process.env.PK_AUTHDOG;
  if (!token || !publicKey) {
    return NextResponse.redirect(dest);
  }

  const { identityHost, environmentId } =
    getServerSidePayloadPublicKey(publicKey);
  const userData = await fetchUserData(identityHost, environmentId, token);
  const response = NextResponse.redirect(dest);

  if (isAuthenticatedUserInfo(userData)) {
    const options = {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };
    response.cookies.set({
      name: `user_session_${environmentId}`,
      value: JSON.stringify(userData.user),
      ...options,
    });
    response.cookies.set({
      name: `user_session_hash_${environmentId}`,
      value: token,
      ...options,
    });
  }

  return response;
}
