import { NextResponse, type NextRequest } from "next/server";

/**
 * `@authdog/nextjs-app` `useAuthMiddleware` cannot load in Next.js 15 Edge
 * (`Native module not found: next/dist/server/web/spec-extension/request`).
 * Forward `?token=` to a Node.js route that performs the same userinfo
 * exchange and cookie names as that helper.
 */
export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || request.nextUrl.pathname === "/auth/callback") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/auth/callback";
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
